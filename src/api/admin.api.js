import { apiClient } from './client';
import { apiCache } from './cache';

export const adminApi = {
  getStaff: (pageIndex = 1, pageSize = 10, forceRefresh = false) => {
    return apiCache.fetch({
      url: '/api/Admin/staff',
      params: { PageIndex: pageIndex, PageSize: pageSize },
      fetcher: () => apiClient.get('/api/Admin/staff', {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      }),
      ttlMs: 3 * 60 * 1000,
      tag: 'staff',
      forceRefresh
    });
  },

  createStaff: async (data) => {
    const res = await apiClient.post('/api/Admin/staff', data);
    apiCache.invalidateByTag('staff');
    return res;
  },

  deleteUser: async (id) => {
    const res = await apiClient.delete(`/api/Admin/users/${id}`);
    apiCache.invalidateByTag('staff');
    return res;
  },

  deleteOrder: async (id) => {
    const res = await apiClient.delete(`/api/Admin/orders/${id}`);
    apiCache.invalidateByTag('statistics');
    return res;
  },

  setNotificationRecipient: async (email) => {
    const res = await apiClient.put('/api/admin/notification-recipient', { email });
    apiCache.invalidateByTag('settings');
    return res;
  },

  deleteNotificationRecipient: async () => {
    const res = await apiClient.delete('/api/admin/notification-recipient');
    apiCache.invalidateByTag('settings');
    return res;
  }
};
