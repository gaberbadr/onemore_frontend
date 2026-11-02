import { apiClient } from './client';
import { apiCache } from './cache';

export const couponsApi = {
  getCoupons: (forceRefresh = false) => {
    return apiCache.fetch({
      url: '/api/Coupons',
      fetcher: () => apiClient.get('/api/Coupons'),
      ttlMs: 5 * 60 * 1000, // 5 minutes cache
      tag: 'coupons',
      forceRefresh
    });
  },

  createCoupon: async (data) => {
    const res = await apiClient.post('/api/Coupons', data);
    apiCache.invalidateByTag('coupons');
    return res;
  },

  deleteCoupon: async (id) => {
    const res = await apiClient.delete(`/api/Coupons/${id}`);
    apiCache.invalidateByTag('coupons');
    return res;
  }
};
