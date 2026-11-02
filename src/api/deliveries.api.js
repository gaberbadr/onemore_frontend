import { apiClient } from './client';
import { apiCache } from './cache';

export const deliveriesApi = {
  getDeliveries: (pageIndex = 1, pageSize = 10, forceRefresh = false) => {
    return apiCache.fetch({
      url: '/api/Deliveries',
      params: { PageIndex: pageIndex, PageSize: pageSize },
      fetcher: () => apiClient.get('/api/Deliveries', {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      }),
      ttlMs: 3 * 60 * 1000, // 3 minutes cache
      tag: 'deliveries',
      forceRefresh
    });
  },

  createDelivery: async (data) => {
    const res = await apiClient.post('/api/Deliveries', data);
    apiCache.invalidateByTag('deliveries');
    return res;
  },

  updateDelivery: async (id, data) => {
    const res = await apiClient.put(`/api/Deliveries/${id}`, { id, ...data });
    apiCache.invalidateByTag('deliveries');
    return res;
  },

  deleteDelivery: async (id) => {
    const res = await apiClient.delete(`/api/Deliveries/${id}`);
    apiCache.invalidateByTag('deliveries');
    return res;
  }
};
