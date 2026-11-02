import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../api/categories.api';

export const CategorySelector = ({ selectedCategoryId, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await categoriesApi.getCategories(1, 50); // Fetch all for selector
        const data = res.data?.data?.data || res.data?.data || [];
        
        // Sort explicitly by displayOrder
        const sortedCats = Array.isArray(data) ? data.sort((a, b) => a.displayOrder - b.displayOrder) : [];
        setCategories(sortedCats);
      } catch (err) {
        console.error("Failed to load categories for selector", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-11 w-28 bg-neutral-100 rounded-full animate-pulse shrink-0 border border-neutral-200"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar py-3 px-1 snap-x">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all snap-start ${
          selectedCategoryId === null 
            ? 'bg-brand-black text-white shadow-lg shadow-black/20 scale-105' 
            : 'bg-white border border-neutral-200 text-neutral-500 hover:border-brand-black hover:text-brand-black'
        }`}
      >
        All Menu
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all snap-start ${
            selectedCategoryId === cat.id 
              ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
              : 'bg-white border border-neutral-200 text-neutral-500 hover:border-primary hover:text-primary'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
