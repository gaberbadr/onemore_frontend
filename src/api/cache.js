/**
 * Lightweight, in-memory caching and request deduplication manager for OneMore frontend.
 * 
 * Features:
 * - TTL (Time-To-Live) cache expiration
 * - Concurrent in-flight request deduplication (prevents redundant identical network calls)
 * - Tag-based cache invalidation (e.g. invalidate all product pages upon product create/update/delete)
 * - Safe session clearing on logout
 * - Zero external library dependencies
 */

class ApiCacheManager {
  constructor() {
    this.cache = new Map();
    this.inFlight = new Map();
  }

  /**
   * Generates a deterministic cache key from an endpoint and its parameters.
   */
  generateKey(url, params = {}) {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }
    const sortedKeys = Object.keys(params).sort();
    const query = sortedKeys
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] ?? '')}`)
      .join('&');
    return `${url}?${query}`;
  }

  /**
   * Executes a cached fetch with deduplication.
   * 
   * @param {Object} options
   * @param {string} options.url - The endpoint URL
   * @param {Object} [options.params] - Query parameters
   * @param {Function} options.fetcher - Async function making the axios request
   * @param {number} [options.ttlMs=180000] - Cache TTL in milliseconds (default: 3 mins)
   * @param {string} [options.tag] - Invalidation tag (e.g., 'products', 'categories')
   * @param {boolean} [options.forceRefresh=false] - If true, bypasses existing cache
   * @returns {Promise<any>}
   */
  async fetch({ url, params = {}, fetcher, ttlMs = 180000, tag = 'default', forceRefresh = false }) {
    const key = this.generateKey(url, params);
    const now = Date.now();

    // 1. Check if valid cached response exists
    if (!forceRefresh && this.cache.has(key)) {
      const entry = this.cache.get(key);
      if (entry.expiresAt > now) {
        return Promise.resolve(entry.data);
      }
      this.cache.delete(key);
    }

    // 2. Check if an identical request is currently in flight (Deduplication)
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    // 3. Initiate request and deduplicate concurrent callers
    const requestPromise = (async () => {
      try {
        const response = await fetcher();
        // Store in cache if TTL is positive
        if (ttlMs > 0) {
          this.cache.set(key, {
            data: response,
            expiresAt: Date.now() + ttlMs,
            tag,
            key,
          });
        }
        return response;
      } finally {
        // Clear in-flight status once resolved or rejected
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Invalidates all cache entries matching a tag.
   * @param {string} tag - Tag name (e.g., 'products', 'categories', 'settings')
   */
  invalidateByTag(tag) {
    if (!tag) return;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tag === tag) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears all cached items and in-flight tracking.
   * Useful during user logout to ensure session isolation.
   */
  clearAll() {
    this.cache.clear();
    this.inFlight.clear();
  }
}

export const apiCache = new ApiCacheManager();
