import { apiClient } from './client';
import { apiCache } from './cache';

export const ordersApi = {
  getTodayOrders: async ({ pageIndex = 1, pageSize = 10, status = null }) => {
    return apiClient.get('/api/Orders', {
      params: { PageIndex: pageIndex, PageSize: pageSize, ...(status && { Status: status }) }
    });
  },

  getHistoricalOrders: async ({ date, pageIndex = 1, pageSize = 10, status = null }) => {
    return apiClient.get('/api/Orders/history', {
      params: { Date: date, PageIndex: pageIndex, PageSize: pageSize, ...(status && { Status: status }) }
    });
  },

  createOrder: async (orderPayload) => {
    const res = await apiClient.post('/api/Orders', orderPayload);
    apiCache.invalidateByTag('statistics');
    apiCache.invalidateByTag('customerHistory');
    return res;
  },

  moveOrderToPrepare: async (id) => {
    return apiClient.post(`/api/Orders/${id}/to-prepare`, {
      orderId: id
    });
  },

  moveOrderToOnWay: async (id, deliveryId) => {
    return apiClient.post(`/api/Orders/${id}/to-on-way`, {
      orderId: id,
      deliveryId: parseInt(deliveryId)
    });
  },

  cancelOrder: async (id, cancellationReason) => {
    const res = await apiClient.patch(`/api/Orders/${id}/cancel`, {
      orderId: id,
      cancellationReason
    });
    apiCache.invalidateByTag('statistics');
    return res;
  },

  markWhatsAppSent: async (id) => {
    return apiClient.post(`/api/Orders/${id}/whatsapp-sent`);
  },

  getOrderInvoice: (id, forceRefresh = false) => {
    return apiCache.fetch({
      url: `/api/Orders/${id}/invoice`,
      fetcher: () => apiClient.get(`/api/Orders/${id}/invoice`),
      ttlMs: 30 * 1000,
      tag: 'invoices',
      forceRefresh
    });
  },

  getCustomerHistory: ({ phoneNumber, pageIndex = 1, pageSize = 10, forceRefresh = false }) => {
    return apiCache.fetch({
      url: '/api/Orders/customer-history',
      params: { PhoneNumber: phoneNumber, PageIndex: pageIndex, PageSize: pageSize },
      fetcher: () => apiClient.get('/api/Orders/customer-history', {
        params: { PhoneNumber: phoneNumber, PageIndex: pageIndex, PageSize: pageSize }
      }),
      ttlMs: 60 * 1000, // 1 minute cache
      tag: 'customerHistory',
      forceRefresh
    });
  }
};
