import { apiClient } from './client';
import { apiCache } from './cache';

export const deliveryAreasApi = {
  getDeliveryAreas: (pageIndex = 1, pageSize = 100, forceRefresh = false) => {
    return apiCache.fetch({
      url: '/api/DeliveryAreas',
      params: { PageIndex: pageIndex, PageSize: pageSize },
      fetcher: () => apiClient.get('/api/DeliveryAreas', {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      }),
      ttlMs: 10 * 60 * 1000, // 10 minutes cache
      tag: 'deliveryAreas',
      forceRefresh
    });
  },

  createDeliveryArea: async (data) => {
    const res = await apiClient.post('/api/DeliveryAreas', data);
    apiCache.invalidateByTag('deliveryAreas');
    return res;
  },

  updateDeliveryArea: async (id, data) => {
    const res = await apiClient.put(`/api/DeliveryAreas/${id}`, { id, ...data });
    apiCache.invalidateByTag('deliveryAreas');
    return res;
  },

  deleteDeliveryArea: async (id) => {
    const res = await apiClient.delete(`/api/DeliveryAreas/${id}`);
    apiCache.invalidateByTag('deliveryAreas');
    return res;
  }
};
