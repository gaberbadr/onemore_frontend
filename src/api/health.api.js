import { apiClient } from './client';
import { apiCache } from './cache';

export const healthApi = {
  getApiInfo: () => {
    return apiCache.fetch({
      url: '/',
      fetcher: () => apiClient.get('/'),
      ttlMs: 60 * 1000,
      tag: 'health'
    });
  },

  getHealthCheck: (forceRefresh = false) => {
    return apiCache.fetch({
      url: '/health',
      fetcher: () => apiClient.get('/health'),
      ttlMs: 30 * 1000, // 30 seconds
      tag: 'health',
      forceRefresh
    });
  }
};
