import React from 'react';
import logoImg from '../../assets/logo.jpeg';

// Curated high quality transparent food fallbacks when category image is missing
const getCategoryFallbackImage = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('برجر') || n.includes('burger') || n.includes('beef') || n.includes('لحم')) {
    return 'https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4098.png';
  }
  if (n.includes('100')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/1/11/Cheeseburger.png';
  }
  if (n.includes('تشيكن') || n.includes('chicken') || n.includes('دجاج') || n.includes('فراخ')) {
    return 'https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4106.png';
  }
  if (n.includes('كيتو') || n.includes('keto')) {
    return 'https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG96773.png';
  }
  if (n.includes('بطاطس') || n.includes('fries') || n.includes('جانب') || n.includes('sides')) {
    return 'https://pngimg.com/uploads/fries/fries_PNG1.png';
  }
  if (n.includes('صوص') || n.includes('sauce') || n.includes('ديب') || n.includes('dip')) {
    return 'https://pngimg.com/uploads/sauce/sauce_PNG25.png';
  }
  if (n.includes('حلو') || n.includes('dessert') || n.includes('pie') || n.includes('كيك') || n.includes('sweet')) {
    return 'https://pngimg.com/uploads/pie/pie_PNG20.png';
  }
  if (n.includes('فطار') || n.includes('breakfast') || n.includes('بيض') || n.includes('morning')) {
    return 'https://pngimg.com/uploads/sandwich/sandwich_PNG3.png';
  }
  if (n.includes('عروض') || n.includes('offer') || n.includes('كومبو') || n.includes('combo') || n.includes('وجب')) {
    return 'https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4139.png';
  }
  if (n.includes('جديد') || n.includes('new')) {
    return 'https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4100.png';
  }
  return 'https://upload.wikimedia.org/wikipedia/commons/1/11/Cheeseburger.png';
};

export const CategoryDomeCard = ({ category, isSelected = false, onClick }) => {
  const fallbackImg = getCategoryFallbackImage(category.name);
  const displayImg = category.image || category.imageUrl || fallbackImg;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      className={`group flex flex-col items-center cursor-pointer select-none transition-all duration-300 hover:-translate-y-2 focus:outline-none ${
        isSelected ? 'scale-[1.02]' : ''
      }`}
    >
      {/* Arch / Dome Container */}
      <div 
        className={`w-full aspect-[1/1] sm:aspect-[4/4.8] rounded-t-[70px] sm:rounded-t-[85px] lg:rounded-t-[95px] p-3 sm:p-4 flex flex-col items-center justify-between relative overflow-hidden transition-all duration-300 border ${
          isSelected 
            ? 'bg-gradient-to-b from-[#FFF5ED] via-[#FCEEE2] to-[#FCE8D8] border-primary shadow-[0_12px_30px_rgba(255,106,0,0.2)] ring-2 ring-primary'
            : 'bg-gradient-to-b from-[#F4F5F8] via-[#ECEEF2] to-[#E3E6EB] border-neutral-200/50 hover:border-primary/40 hover:shadow-[0_14px_35px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-white/40 pointer-events-none rounded-t-[90px]"></div>

        {/* 3 Flavor Burst Sparks */}
        <div className="pt-1.5 sm:pt-2 z-10">
          <svg 
            width="22" 
            height="14" 
            viewBox="0 0 24 14" 
            fill="none" 
            className="text-primary group-hover:scale-125 group-hover:-translate-y-0.5 transition-transform duration-300"
          >
            <path d="M12 1V5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M4 4L7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 4L17 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Floating Food Item */}
        <div className="relative w-full flex-1 flex items-center justify-center p-1 sm:p-2 z-10">
          <img
            src={displayImg}
            alt={category.name}
            loading="lazy"
            decoding="async"
            className="max-h-[105px] sm:max-h-[125px] lg:max-h-[145px] w-auto max-w-[92%] object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:-translate-y-1 group-hover:drop-shadow-[0_16px_25px_rgba(0,0,0,0.22)] transition-all duration-300"
            onError={(e) => {
              if (e.target.src !== fallbackImg) {
                e.target.src = fallbackImg;
              } else if (e.target.src !== logoImg) {
                e.target.src = logoImg;
              }
              e.target.onerror = null;
            }}
          />
        </div>
      </div>

      {/* Vibrant Orange Bottom Pill Button */}
      <div className="w-full mt-2 sm:mt-2.5">
        <div 
          className={`w-full font-black py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl sm:rounded-2xl text-center text-sm sm:text-base lg:text-lg transition-all duration-300 flex items-center justify-center tracking-tight shadow-md ${
            isSelected
              ? 'bg-[#E05500] text-white shadow-[0_6px_20px_rgba(255,106,0,0.5)] scale-[1.02]'
              : 'bg-[#FF6A00] group-hover:bg-[#FF5500] text-white shadow-[0_4px_14px_rgba(255,106,0,0.32)] group-hover:shadow-[0_8px_22px_rgba(255,106,0,0.45)] group-hover:scale-[1.02] active:scale-95'
          }`}
        >
          <span className="truncate">{category.name}</span>
        </div>
      </div>
    </div>
  );
};

export const CategoryDomeSkeleton = () => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="w-full aspect-[1/1] sm:aspect-[4/4.8] rounded-t-[70px] sm:rounded-t-[85px] lg:rounded-t-[95px] p-3 sm:p-4 bg-neutral-200/80"></div>
    <div className="w-full mt-2 sm:mt-2.5 h-10 sm:h-12 bg-neutral-200/80 rounded-xl sm:rounded-2xl"></div>
  </div>
);
