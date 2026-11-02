import { apiClient, refreshAccessToken } from './client';

export const authApi = {
  loginAdmin: async ({ email, password }) => {
    return apiClient.post('/api/Auth/login-admin', { email, password });
  },
  
  loginStaff: async ({ email, password }) => {
    return apiClient.post('/api/Auth/login-staff', { email, password });
  },
  
  logout: async () => {
    return apiClient.post('/api/Auth/logout');
  },
  
  refreshToken: async (token) => {
    if (token) {
      return refreshAccessToken();
    }
    return apiClient.post('/api/Auth/refresh-token', { refreshToken: token });
  }
};

