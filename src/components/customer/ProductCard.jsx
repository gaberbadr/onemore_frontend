import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

export const ProductCard = ({ product, onAddClick }) => {
  const minPrice = product.variants?.length 
    ? Math.min(...product.variants.map(v => v.price))
    : 0;

  return (
    <div className="bg-brand-white rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-neutral-100 overflow-hidden transition-all duration-300 group flex flex-col h-full hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy"
            decoding="async"
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => { e.target.src = logoImg; e.target.onerror = null; }}
          />
        ) : (
          <img 
            src={logoImg} 
            alt={product.name} 
            loading="lazy"
            decoding="async"
            width={400}
            height={300}
            className="w-full h-full object-cover opacity-80" 
          />
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-brand-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-brand-black text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
              غير متوفر
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-black text-lg text-brand-black line-clamp-1 mb-1.5 leading-tight">{product.name}</h3>
        <p className="text-sm text-neutral-500 font-medium line-clamp-2 mb-5 flex-grow leading-relaxed">
          {product.description || 'محضرة بعناية وطازجة مخصوص عشانك في ONE MORE.'}
        </p>
        
        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-xs text-neutral-400 font-bold block mb-0.5">يبدأ من</span>
            <span className="text-2xl font-black text-primary leading-none">{minPrice} <span className="text-xs sm:text-sm font-bold">ج.م</span></span>
          </div>
          
          <button 
            onClick={(e) => {
              if (!product.isAvailable) {
                e.preventDefault();
                return;
              }
              if (onAddClick) onAddClick(product);
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm ${
              product.isAvailable 
                ? 'bg-brand-black text-white hover:bg-primary hover:scale-110 hover:shadow-primary/30' 
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Plus size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
