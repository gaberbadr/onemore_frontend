import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Navbar = ({ settings }) => {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isClosed = settings?.restaurantOpen === false;

  return (
    <div className={`fixed ${isClosed ? 'top-12' : 'top-0'} left-0 w-full z-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pointer-events-none transition-all duration-300`}>
      <header className="max-w-6xl mx-auto bg-white/85  border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-full pointer-events-auto transition-all duration-300">
        <div className="flex justify-between items-center h-16 px-6 sm:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            {settings?.logo && settings.logo !== 'string' ? (
              <img 
                src={settings.logo.replace(/\[|\]|\(|\)/g, '')} 
                alt="ONE MORE" 
                height={36}
                decoding="async"
                className="h-9 object-contain group-hover:scale-105 transition-transform duration-300" 
              />
            ) : (
              <span className="text-2xl font-black text-brand-black tracking-tight group-hover:text-primary transition-colors">
                ONE<span className="text-primary">MORE</span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-brand-black hover:text-primary font-bold text-sm transition-colors relative group py-2"
            >
              الرئيسية
              <span className="absolute bottom-0 right-1/2 translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/menu" 
              className="text-brand-black hover:text-primary font-bold text-sm transition-colors relative group py-2"
            >
              المنيو
              <span className="absolute bottom-0 right-1/2 translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {settings?.phoneNumber && (
              <a 
                href={`tel:${settings.phoneNumber}`} 
                className="flex items-center gap-2 text-neutral-500 hover:text-brand-black font-bold text-sm transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100"
              >
                <Phone size={16} className="text-primary" />
                <span dir="ltr">{settings.phoneNumber}</span>
              </a>
            )}
            
            <div className="w-px h-6 bg-neutral-200 mx-1"></div>

            <Link 
              to="/cart" 
              className="relative w-10 h-10 bg-brand-black text-white rounded-full flex items-center justify-center group hover:bg-primary transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border-2 border-white group-hover:border-primary transition-colors">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Link 
              to="/cart" 
              className="relative w-10 h-10 bg-brand-black text-white rounded-full flex items-center justify-center shadow-md"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="w-10 h-10 bg-neutral-100 text-brand-black rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-28 left-4 right-4 bg-white/95  border border-white shadow-2xl rounded-3xl animate-in slide-in-from-top-4 fade-in duration-200 pointer-events-auto overflow-hidden">
          <div className="p-4 flex flex-col gap-1">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="px-6 py-4 rounded-2xl font-black text-lg text-brand-black hover:bg-neutral-50 transition-colors text-center"
            >
              الرئيسية
            </Link>
            <Link 
              to="/menu" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="px-6 py-4 rounded-2xl font-black text-lg text-brand-black hover:bg-neutral-50 transition-colors text-center"
            >
              المنيو
            </Link>
            
            {settings?.phoneNumber && (
              <a 
                href={`tel:${settings.phoneNumber}`} 
                className="mt-2 px-6 py-4 rounded-2xl bg-primary/5 text-primary flex items-center justify-center gap-3 font-black text-lg border border-primary/10"
              >
                <Phone size={20} />
                <span dir="ltr">{settings.phoneNumber}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
