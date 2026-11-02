import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LogOut, ClipboardList, History, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.jpeg';
import { ApiStatusBadge } from '../admin/ApiStatusBadge';

export const StaffLayout = () => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'الطلبات', path: '/staff/orders', icon: ClipboardList },
    { name: 'سجل العملاء', path: '/staff/customer-history', icon: History },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-brand-lightBg font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden "
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-brand-black text-white flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 flex items-center justify-between gap-4 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-white flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 overflow-hidden">
              <img src={logoImg} alt="ONE MORE Logo" loading="lazy" decoding="async" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div>
              <Link to="/" className="text-xl font-black tracking-tight block hover:text-primary transition-colors">
                ONE<span className="text-primary">MORE</span>
              </Link>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">بوابة الموظفين</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-white p-1"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-4">
          <ApiStatusBadge />
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-neutral-400 hover:bg-semantic-danger/10 hover:text-semantic-danger transition-colors duration-200"
          >
            <LogOut size={20} strokeWidth={2.5} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-[100dvh] relative overflow-x-hidden flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-neutral-200 p-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl text-brand-black hover:bg-neutral-100 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="font-black tracking-tight text-lg text-brand-black">ONE<span className="text-primary">MORE</span> Staff</div>
        </div>

        {/* Background gradient decorative element */}
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-neutral-200/40 to-transparent -z-10"></div>
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
