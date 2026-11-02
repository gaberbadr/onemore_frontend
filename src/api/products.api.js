import { apiClient } from './client';
import { apiCache } from './cache';

export const productsApi = {
  getProducts: (pageIndex = 1, pageSize = 10, forceRefresh = false) => {
    return apiCache.fetch({
      url: '/api/Products',
      params: { PageIndex: pageIndex, PageSize: pageSize },
      fetcher: () => apiClient.get('/api/Products', {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      }),
      ttlMs: 3 * 60 * 1000, // 3 minutes cache
      tag: 'products',
      forceRefresh
    });
  },

  createProduct: async (formData) => {
    const res = await apiClient.post('/api/Products', formData);
    apiCache.invalidateByTag('products');
    return res;
  },

  updateProduct: async (id, formData) => {
    const res = await apiClient.put(`/api/Products/${id}`, formData);
    apiCache.invalidateByTag('products');
    return res;
  },

  deleteProduct: async (id) => {
    const res = await apiClient.delete(`/api/Products/${id}`);
    apiCache.invalidateByTag('products');
    return res;
  }
};
