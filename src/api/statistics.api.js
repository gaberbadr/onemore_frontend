import { apiClient } from './client';
import { apiCache } from './cache';

export const statisticsApi = {
  getStatistics: (startDate, endDate, forceRefresh = false) => {
    const params = {};
    if (startDate) params.StartDate = startDate;
    if (endDate) params.EndDate = endDate;
    
    return apiCache.fetch({
      url: '/api/Statistics',
      params,
      fetcher: () => apiClient.get('/api/Statistics', { params }),
      ttlMs: 60 * 1000, // 1 minute cache
      tag: 'statistics',
      forceRefresh
    });
  }
};
