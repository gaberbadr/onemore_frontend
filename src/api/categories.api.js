import { apiClient } from './client';
import { apiCache } from './cache';

export const categoriesApi = {
  getCategories: (pageIndex = 1, pageSize = 10, forceRefresh = false) => {
    return apiCache.fetch({
      url: '/api/Categories',
      params: { PageIndex: pageIndex, PageSize: pageSize },
      fetcher: () => apiClient.get('/api/Categories', {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      }),
      ttlMs: 5 * 60 * 1000, // 5 minutes cache
      tag: 'categories',
      forceRefresh
    });
  },

  createCategory: async (formData) => {
    const res = await apiClient.post('/api/Categories', formData);
    apiCache.invalidateByTag('categories');
    apiCache.invalidateByTag('products');
    return res;
  },

  updateCategory: async (id, formData) => {
    const res = await apiClient.put(`/api/Categories/${id}`, formData);
    apiCache.invalidateByTag('categories');
    apiCache.invalidateByTag('products');
    return res;
  },

  deleteCategory: async (id) => {
    const res = await apiClient.delete(`/api/Categories/${id}`);
    apiCache.invalidateByTag('categories');
    apiCache.invalidateByTag('products');
    return res;
  }
};
