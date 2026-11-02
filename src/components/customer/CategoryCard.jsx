import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.jpeg';

export const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/menu?category=${category.id}`} 
      className="group flex flex-col items-center gap-4 text-center shrink-0 w-32"
    >
      <div className="w-24 h-24 rounded-full bg-brand-white shadow-sm border border-neutral-100 overflow-hidden relative transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-primary/50 flex items-center justify-center">
        {category.image ? (
          <img 
            src={category.image} 
            alt={category.name} 
            loading="lazy"
            decoding="async"
            width={96}
            height={96}
            className="w-full h-full object-cover" 
            onError={(e) => { e.target.src = logoImg; e.target.onerror = null; }} 
          />
        ) : (
          <img 
            src={logoImg} 
            alt={category.name} 
            loading="lazy"
            decoding="async"
            width={96}
            height={96}
            className="w-full h-full object-cover p-2 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" 
          />
        )}
      </div>
      <h3 className="font-bold text-brand-black group-hover:text-primary transition-colors line-clamp-2 leading-tight">
        {category.name}
      </h3>
    </Link>
  );
};
