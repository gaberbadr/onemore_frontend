import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { apiCache } from '../api/cache';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState({
    role: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const role = localStorage.getItem('userRole');

    if (accessToken && role) {
      setSession({
        role,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setSession(prev => ({ ...prev, isLoading: false }));
    }

    const handleSessionUpdated = (e) => {
      if (e.detail?.accessToken) {
        setSession(prev => ({
          ...prev,
          accessToken: e.detail.accessToken,
          refreshToken: e.detail.refreshToken || prev.refreshToken,
        }));
      }
    };

    const handleUnauthorized = () => {
      setSession({
        role: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    window.addEventListener('auth:session-updated', handleSessionUpdated);
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:session-updated', handleSessionUpdated);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (email, password, role) => {
    setSession(prev => ({ ...prev, isLoading: true }));
    try {
      let res;
      if (role === 'Admin') {
        res = await authApi.loginAdmin({ email, password });
      } else if (role === 'Staff') {
        res = await authApi.loginStaff({ email, password });
      } else {
        throw new Error('Invalid role specified');
      }

      const data = res.data?.data || res.data;
      const { accessToken, refreshToken } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', role);

      setSession({
        role,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      setSession(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed. Please check your credentials.'
      };
    }
  }, []);

  const logout = useCallback(async () => {
    setSession(prev => ({ ...prev, isLoading: true }));
    try {
      const token = localStorage.getItem('accessToken') || session.accessToken;
      if (token) {
        await authApi.logout();
      }
    } catch (e) {
      console.error('Logout request failed', e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      apiCache.clearAll();
      setSession({
        role: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      navigate('/', { replace: true });
    }
  }, [session.accessToken, navigate]);

  const value = useMemo(() => ({
    ...session,
    login,
    logout
  }), [session, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
