import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { Home } from '../pages/public/Home';

// Lazy loaded public pages
const Menu = React.lazy(() => import('../pages/public/Menu').then(m => ({ default: m.Menu })));
const Cart = React.lazy(() => import('../pages/public/Cart').then(m => ({ default: m.Cart })));

// Lazy loaded auth
const AdminLogin = React.lazy(() => import('../pages/auth/AdminLogin').then(m => ({ default: m.AdminLogin })));
const StaffLogin = React.lazy(() => import('../pages/auth/StaffLogin').then(m => ({ default: m.StaffLogin })));

// Lazy loaded layouts
const AdminLayout = React.lazy(() => import('../components/layout/AdminLayout').then(m => ({ default: m.AdminLayout })));
const StaffLayout = React.lazy(() => import('../components/layout/StaffLayout').then(m => ({ default: m.StaffLayout })));
const ProtectedRoute = React.lazy(() => import('./ProtectedRoute').then(m => ({ default: m.ProtectedRoute })));

// Lazy loaded admin/staff pages
const StaffManagement = React.lazy(() => import('../pages/admin/StaffManagement').then(m => ({ default: m.StaffManagement })));
const CategoriesManagement = React.lazy(() => import('../pages/admin/CategoriesManagement').then(m => ({ default: m.CategoriesManagement })));
const CouponsManagement = React.lazy(() => import('../pages/admin/CouponsManagement').then(m => ({ default: m.CouponsManagement })));
const DeliveriesManagement = React.lazy(() => import('../pages/admin/DeliveriesManagement').then(m => ({ default: m.DeliveriesManagement })));
const DeliveryAreasManagement = React.lazy(() => import('../pages/admin/DeliveryAreasManagement').then(m => ({ default: m.DeliveryAreasManagement })));
const OrdersManagement = React.lazy(() => import('../pages/admin/Orders').then(m => ({ default: m.OrdersManagement })));
const CustomerHistory = React.lazy(() => import('../pages/shared/CustomerHistory').then(m => ({ default: m.CustomerHistory })));
const ProductsManagement = React.lazy(() => import('../pages/admin/ProductsManagement').then(m => ({ default: m.ProductsManagement })));
const SettingsManagement = React.lazy(() => import('../pages/admin/SettingsManagement').then(m => ({ default: m.SettingsManagement })));
const StatisticsDashboard = React.lazy(() => import('../pages/admin/StatisticsDashboard').then(m => ({ default: m.StatisticsDashboard })));

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-[100dvh] bg-brand-lightBg">
    <Loader2 className="animate-spin text-primary w-12 h-12" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <Routes>
        {/* Public Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/staff/login" element={<StaffLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute role="Admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route path="/admin/categories" element={<CategoriesManagement />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/coupons" element={<CouponsManagement />} />
            <Route path="/admin/deliveries" element={<DeliveriesManagement />} />
            <Route path="/admin/delivery-areas" element={<DeliveryAreasManagement />} />
            <Route path="/admin/customer-history" element={<CustomerHistory />} />
            <Route path="/admin/statistics" element={<StatisticsDashboard />} />
            <Route path="/admin/settings" element={<SettingsManagement />} />
          </Route>
        </Route>

        {/* Protected Staff Routes */}
        <Route element={<ProtectedRoute role="Staff" />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff" element={<Navigate to="/staff/orders" replace />} />
            <Route path="/staff/orders" element={<OrdersManagement />} />
            <Route path="/staff/customer-history" element={<CustomerHistory />} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
