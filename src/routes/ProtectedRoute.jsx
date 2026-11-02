import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ role }) => {
  const { role: userRole, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-brand-lightBg">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={role === 'Admin' ? '/admin/login' : '/staff/login'} state={{ from: location }} replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === 'Admin' ? '/admin/staff' : '/staff/orders'} replace />;
  }

  return <Outlet />;
};
