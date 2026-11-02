import axios from 'axios';
import { apiCache } from './cache.js';

export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://onemore.runasp.net';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Decodes the payload portion of a JWT token.
 * Pure JS implementation with no external library dependencies.
 */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const decodeBase64 = typeof atob === 'function'
      ? atob(padded)
      : Buffer.from(padded, 'base64').toString('binary');
    const jsonPayload = decodeURIComponent(
      decodeBase64
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Checks if a token is expiring within thresholdSeconds (default: 60s).
 */
export function isTokenExpiringSoon(token, thresholdSeconds = 60) {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') {
    return false;
  }
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return (payload.exp - nowInSeconds) <= thresholdSeconds;
}

export function isTokenExpired(token) {
  return isTokenExpiringSoon(token, 0);
}

/**
 * Extracts human-readable backend error messages from various API response shapes
 * (standard API result envelope, ASP.NET ModelState errors, ProblemDetails RFC 7807, or string).
 */
export function getErrorMessage(error, defaultMessage = 'An unexpected error occurred') {
  if (!error) return defaultMessage;
  if (typeof error === 'string') return error;

  const data = error.response?.data;
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === 'object') {
    // 1. Validation errors dictionary or array
    if (data.errors) {
      if (Array.isArray(data.errors)) {
        const msgs = data.errors
          .map((e) => (typeof e === 'string' ? e : e?.message || JSON.stringify(e)))
          .filter(Boolean);
        if (msgs.length > 0) return msgs.join(', ');
      } else if (typeof data.errors === 'object') {
        const msgs = Object.values(data.errors)
          .flatMap((val) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') return [val];
            return [];
          })
          .filter(Boolean);
        if (msgs.length > 0) return msgs.join(', ');
      }
    }

    // 2. Message field
    if (data.message && typeof data.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }

    // 3. ProblemDetails / RFC 7807 detail or title
    if (data.detail && typeof data.detail === 'string' && data.detail.trim()) {
      return data.detail.trim();
    }
    if (data.title && typeof data.title === 'string' && data.title.trim()) {
      return data.title.trim();
    }

    // 4. Error field
    if (data.error && typeof data.error === 'string' && data.error.trim()) {
      return data.error.trim();
    }
  }

  if (error.message && typeof error.message === 'string' && !error.message.startsWith('Request failed with status code')) {
    return error.message;
  }

  return defaultMessage;
}

/**
 * Clears stored tokens and redirects to appropriate login page if user was in a protected section.
 */
export function clearAuthAndRedirect() {
  const role = typeof localStorage !== 'undefined' ? localStorage.getItem('userRole') : null;
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
  }

  apiCache.clearAll();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:unauthorized'));

    const isAdmin = pathname.startsWith('/admin') || role === 'Admin';
    const isStaff = pathname.startsWith('/staff') || role === 'Staff';

    if (isAdmin && !pathname.includes('/login')) {
      window.location.href = '/admin/login';
    } else if (isStaff && !pathname.includes('/login')) {
      window.location.href = '/staff/login';
    }
  }
}

let refreshPromise = null;

/**
 * Centralized refresh logic.
 * Guarantees that concurrent refresh requests share the single in-flight promise.
 */
export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  if (!refreshToken) {
    clearAuthAndRedirect();
    return Promise.reject(new Error('No refresh token available'));
  }

  refreshPromise = (async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Auth/refresh-token`,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        }
      );

      const data = response.data?.data || response.data;
      const newAccessToken = data?.accessToken;
      const newRefreshToken = data?.refreshToken;

      if (!newAccessToken) {
        throw new Error('Invalid token format received from refresh endpoint');
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
      }

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('auth:session-updated', {
            detail: {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken || refreshToken,
            },
          })
        );
      }

      return newAccessToken;
    } catch (refreshError) {
      const isAuthFailure =
        refreshError.response &&
        (refreshError.response.status === 401 ||
         refreshError.response.status === 400 ||
         refreshError.response.status === 403);

      if (isAuthFailure) {
        clearAuthAndRedirect();
      } else {
        // Temporary network failure or 5xx server error.
        // DO NOT destroy an otherwise potentially valid session.
        console.warn('Token refresh failed due to network/server issue. Session preserved.', refreshError);
      }

      throw refreshError;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

apiClient.interceptors.request.use(
  async (config) => {
    // 1. Remove explicit Content-Type for FormData so Axios/browser sets boundary
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    // 2. Auth endpoints bypass Authorization header and proactive refresh
    const isAuthEndpoint = config.url && (
      config.url.includes('/api/Auth/login') ||
      config.url.includes('/api/Auth/refresh-token')
    );

    if (isAuthEndpoint) {
      return config;
    }

    let accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;

    // 3. Proactive token refresh when approaching expiration
    if (accessToken && refreshToken) {
      if (isTokenExpiringSoon(accessToken, 60)) {
        try {
          accessToken = await refreshAccessToken();
        } catch (refreshErr) {
          const isNetworkError = !refreshErr.response || refreshErr.response.status >= 500;
          if (isNetworkError && !isTokenExpired(accessToken)) {
            // Token is not strictly expired; proceed with current token despite temporary network hiccup
          } else {
            return Promise.reject(refreshErr);
          }
        }
      } else if (refreshPromise) {
        // Await in-flight refresh so concurrent requests use the fresh token
        try {
          accessToken = await refreshPromise;
        } catch {
          // If refresh fails, let response interceptor handle
        }
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1. Centralized backend error extraction for all errors (400 Bad Request, 422, etc.)
    const backendMessage = getErrorMessage(error, '');
    if (backendMessage) {
      error.message = backendMessage;
      if (error.response) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          if (!error.response.data.message) {
            error.response.data.message = backendMessage;
          }
        } else if (typeof error.response.data !== 'object') {
          error.response.data = { message: backendMessage };
        }
      }
    }

    // 2. Check 401 Unauthorized handling
    const is401 = error.response?.status === 401;
    const isAuthEndpoint = originalRequest?.url && (
      originalRequest.url.includes('/api/Auth/login') ||
      originalRequest.url.includes('/api/Auth/refresh-token') ||
      originalRequest.url.includes('/api/Auth/logout')
    );

    // 3. 403 Forbidden does NOT refresh or log out. Only 401 triggers token refresh.
    if (is401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!refreshToken) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
