import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer = ({ settings }) => {
  const { isAuthenticated, role, logout } = useAuth();
  return (
    <footer className="bg-brand-black text-white pt-16 pb-8 border-t-[6px] border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="text-3xl font-black tracking-tight mb-4 block">ONE<span className="text-primary">MORE</span></span>
            <p className="text-neutral-400 font-medium italic">"One Bite , One More"</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">روابط سريعة</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-neutral-400 font-medium hover:text-primary transition-colors">الرئيسية</Link>
              <Link to="/menu" className="block text-neutral-400 font-medium hover:text-primary transition-colors">المنيو</Link>
              <Link to="/cart" className="block text-neutral-400 font-medium hover:text-primary transition-colors">السلة</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to={role === 'Admin' ? '/admin' : '/staff'} className="block text-neutral-400 font-medium hover:text-primary transition-colors">
                    لوحة التحكم
                  </Link>
                  <button onClick={logout} className="block w-full text-right text-neutral-400 font-medium hover:text-semantic-danger transition-colors">
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/admin/login" className="block text-neutral-400 font-medium hover:text-primary transition-colors">
                    دخول الإدارة
                  </Link>
                  <Link to="/staff/login" className="block text-neutral-400 font-medium hover:text-primary transition-colors">
                    دخول الموظفين
                  </Link>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">تواصل معانا</h4>
            <div className="space-y-4">
              {settings?.address && (
                <div className="flex items-start gap-3 text-neutral-400 font-medium">
                  <MapPin className="text-primary shrink-0" size={20} />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings?.phoneNumber && (
                <a href={`tel:${settings.phoneNumber}`} className="flex items-center gap-3 text-neutral-400 font-medium hover:text-white transition-colors">
                  <Phone className="text-primary shrink-0" size={20} />
                  <span>{settings.phoneNumber}</span>
                </a>
              )}
              {settings?.whatsAppNumber && (
                <a href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-neutral-400 font-medium hover:text-white transition-colors">
                  <MessageCircle className="text-primary shrink-0" size={20} />
                  <span>كلمنا واتساب</span>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col items-center gap-6 text-center">
          <p className="text-neutral-500 text-sm font-medium">حقوق النشر &copy; {new Date().getFullYear()} ONE MORE. جميع الحقوق محفوظة.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs text-neutral-500 bg-brand-black px-6 py-3 rounded-2xl border border-neutral-800 shadow-inner">
            <span className="text-neutral-400">تم التطوير بواسطة:</span>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a href="tel:01067688524" className="hover:text-primary transition-colors flex items-center gap-1.5 group" dir="ltr">
                <span className="font-bold text-neutral-300 group-hover:text-primary">Ahmed Megahed</span>
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">01067688524</span>
              </a>
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-700 hidden sm:block"></div>
              <a href="tel:01019806684" className="hover:text-primary transition-colors flex items-center gap-1.5 group" dir="ltr">
                <span className="font-bold text-neutral-300 group-hover:text-primary">Gaber Badr</span>
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">01019806684</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
