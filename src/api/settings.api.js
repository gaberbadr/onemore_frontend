import { apiClient } from './client';
import { apiCache } from './cache';

export const settingsApi = {
  getSettings: (forceRefresh = false) => {
    return apiCache.fetch({
      url: '/api/Settings',
      fetcher: () => apiClient.get('/api/Settings'),
      ttlMs: 10 * 60 * 1000, // 10 minutes cache
      tag: 'settings',
      forceRefresh
    });
  },

  updateSettings: async (formData) => {
    const res = await apiClient.put('/api/Settings', formData);
    apiCache.invalidateByTag('settings');
    return res;
  }
};
