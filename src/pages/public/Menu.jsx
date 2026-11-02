import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { categoriesApi } from '../../api/categories.api';
import { productsApi } from '../../api/products.api';
import { CategoryDomeCard, CategoryDomeSkeleton } from '../../components/customer/CategoryDomeCard';
import { ProductCard } from '../../components/customer/ProductCard';
import { SkeletonCard } from '../../components/common/SkeletonLoader';
import { ProductDetailsModal } from '../../components/customer/ProductDetailsModal';
import { useCart } from '../../context/CartContext';
import { ArrowRight, Search, X, Sparkles, UtensilsCrossed } from 'lucide-react';

export const Menu = () => {
  const { addToCart } = useCart();
  const outletContext = useOutletContext();
  const isClosed = outletContext?.settings?.restaurantOpen === false;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchMenuData = async () => {
      try {
        const catRes = await categoriesApi.getCategories(1, 100);
        const catData = catRes.data?.data?.data || catRes.data?.data || [];
        if (isMounted) setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        if (isMounted) console.error("Categories fetch error", err);
      } finally {
        if (isMounted) setLoadingCats(false);
      }

      try {
        const prodRes = await productsApi.getProducts(1, 100);
        const prodData = prodRes.data?.data?.data || prodRes.data?.data || [];
        if (isMounted) setProducts(Array.isArray(prodData) ? prodData : []);
      } catch (err) {
        if (isMounted) console.error("Products fetch error", err);
      } finally {
        if (isMounted) setLoadingProds(false);
      }
    };

    fetchMenuData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products by selected category and search query
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== null) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className={`flex flex-col w-full min-h-[100dvh] bg-[#FAF9F6] ${isClosed ? 'pt-40 sm:pt-48' : 'pt-32 sm:pt-36'} pb-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          
          {/* Iconic "قائمتنا" Badge matching reference design */}
          <div className="inline-flex items-center justify-center gap-2 px-7 py-2 rounded-2xl bg-white border border-neutral-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-brand-black font-black text-xl sm:text-2xl tracking-wide mb-5">
            <Sparkles size={20} className="text-primary fill-primary/20" />
            <span>قائمتنا</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-brand-black mb-3 tracking-tight">
            ألذ وأشهى الوجبات الفريش
          </h1>
          <p className="text-neutral-500 font-medium text-base sm:text-lg max-w-xl mx-auto">
            اختر من بين أقسامنا المميزة، كل وجبة معمولة مخصوص عشانك بأعلى جودة.
          </p>

          {/* Search Input Bar */}
          <div className="mt-7 max-w-md mx-auto relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن وجبة، برجر، صوص..."
                className="w-full pl-10 pr-12 py-3.5 bg-white border border-neutral-200/90 rounded-2xl text-brand-black placeholder:text-neutral-400 font-semibold shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm sm:text-base"
              />
              <Search className="w-5 h-5 text-neutral-400 absolute right-4 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute left-3.5 p-1 text-neutral-400 hover:text-brand-black rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Dome Grid (Iconic 5-columns layout matching reference) */}
        <div className="mb-14">
          {loadingCats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-7">
              {Array.from({ length: 5 }).map((_, i) => (
                <CategoryDomeSkeleton key={i} />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-7">
              {categories.map(cat => (
                <CategoryDomeCard
                  key={cat.id}
                  category={cat}
                  isSelected={selectedCategory === cat.id}
                  onClick={() => {
                    if (selectedCategory === cat.id) {
                      setSelectedCategory(null);
                    } else {
                      setSelectedCategory(cat.id);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-neutral-100 p-8 shadow-xs">
              <UtensilsCrossed size={40} className="mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500 font-bold text-lg">مفيش أقسام متاحة حالياً.</p>
            </div>
          )}
        </div>

        {/* Section Divider & Active Category Filter Info */}
        <div className="border-t border-neutral-200/80 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                {selectedCategory ? activeCategoryObj?.name : (searchQuery ? `نتائج البحث عن "${searchQuery}"` : 'جميع الأصناف')}
              </h2>
              <span className="bg-primary/10 text-primary font-black px-3 py-1 rounded-full text-xs sm:text-sm">
                {filteredProducts.length} صنف
              </span>
            </div>

            {/* If a category or search filter is active, show reset button */}
            {(selectedCategory !== null || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-brand-black bg-white hover:bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-xl transition-all shadow-xs self-start sm:self-auto"
              >
                <ArrowRight size={16} />
                عرض كل الأصناف
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {loadingProds ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(prod => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  onAddClick={setSelectedProduct} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-neutral-100 shadow-xs flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                  <UtensilsCrossed size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-brand-black mb-1">لا توجد منتجات</h3>
                <p className="text-neutral-500 font-medium text-sm">
                  {searchQuery ? 'جرب البحث بكلمات أخرى.' : 'هذا القسم لا يحتوي على منتجات حالياً.'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Product Details Customizer Modal */}
      <ProductDetailsModal 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={({ product, variant, quantity, comment }) => {
          addToCart({
            productVariantId: variant.id,
            productName: product.name,
            variantName: variant.name,
            quantity: quantity,
            unitPrice: variant.price,
            comment: comment
          });
        }} 
      />
    </div>
  );
};

