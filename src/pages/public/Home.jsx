import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Utensils, Clock, ThumbsUp, Sparkles } from 'lucide-react';
import { categoriesApi } from '../../api/categories.api';
import { productsApi } from '../../api/products.api';
import { CategoryDomeCard } from '../../components/customer/CategoryDomeCard';
import { ProductCard } from '../../components/customer/ProductCard';
import { SkeletonCard } from '../../components/common/SkeletonLoader';
import { ProductDetailsModal } from '../../components/customer/ProductDetailsModal';
import { useCart } from '../../context/CartContext';
import logoImg from '../../assets/logo.jpeg';

export const Home = () => {
  const { settings } = useOutletContext();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
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

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-[#0d0d0d] overflow-hidden py-24 sm:py-32 flex items-center min-h-[600px] lg:min-h-[720px]">
        
        {/* Creative Atmospheric Background with Layered Lighting */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Main Cinematic Restaurant & Grill Background Image */}
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop" 
            alt="ONE MORE Restaurant Atmosphere" 
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.52] contrast-[1.12] saturate-[1.2] transition-transform duration-1000"
          />

          {/* Creative Modern Architectural Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] z-10 pointer-events-none"></div>

          {/* Deep Cinematic Vignette & Readability Gradient Masks */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/60 to-black/82 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/75 z-10"></div>

          {/* Warm Amber & Flame Brand Ambient Glow Spots */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(255,106,0,0.22)_0%,_transparent_70%)] blur-2xl z-10"></div>
          <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-[radial-gradient(circle,_rgba(255,140,58,0.18)_0%,_transparent_70%)] blur-2xl z-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              {settings?.restaurantOpen ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-semantic-success/15 text-semantic-success font-bold text-sm mb-6 border border-semantic-success/30 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  فاتحين دلوقتي
                </span>
              ) : settings && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-semantic-danger/15 text-semantic-danger font-bold text-sm mb-6 border border-semantic-danger/30 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-semantic-danger"></span>
                  قافلين حالياً
                </span>
              )}
              
              <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] mb-6 tracking-tighter" dir="ltr">
                One Bite, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff8c3a] to-[#ffb873] filter drop-shadow-sm">
                  One More.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 mb-10 font-medium max-w-lg leading-relaxed drop-shadow-xs">
                جرب أطعم أكل في البلد. معمول بأجود المكونات وبشغف يخليك دايماً عايز كمان!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <a 
                  href="#menu-section"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-[#ff8c3a] text-white font-black tracking-wide text-lg transition-all duration-300 shadow-[0_8px_25px_rgba(255,106,0,0.4)] hover:shadow-[0_12px_35px_rgba(255,106,0,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 group border border-primary/50 relative overflow-hidden"
                >
                  <span className="relative z-10">اطلب دلوقتي</span>
                  <ArrowLeft size={22} className="relative z-10 group-hover:-translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Content / Image showcase */}
            <div className="relative hidden lg:block">
              
              {/* Main showcase image - with appetizing framing & subtle orange back-glow */}
              <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(255,106,0,0.2)] border border-neutral-700/60 rotate-3 hover:rotate-0 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" 
                  alt="Delicious premium burger" 
                  width={600}
                  height={600}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-8 left-8 z-20 bg-brand-black/80  border border-neutral-700 px-6 py-3 rounded-2xl shadow-xl transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-brand-black">100%</div>
                    </div>
                    <div className="text-white">
                      <p className="text-sm font-bold leading-tight">جودة فريش</p>
                      <p className="text-xs text-neutral-400">لحم بلدي</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* Our Menu Section */}
      <section id="menu-section" className="py-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-2xl bg-white border border-neutral-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-brand-black font-black text-xl sm:text-2xl tracking-wide mb-4">
              <Sparkles size={20} className="text-primary fill-primary/20" />
              <span>قائمتنا</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-brand-black mb-3 tracking-tight">المنيو بتاعنا</h2>
            <p className="text-neutral-500 font-medium text-base sm:text-lg">شوف كل الأصناف بتاعتنا، معمولة فريش مخصوص عشانك.</p>
          </div>

          {/* Main Content Area */}
          {selectedCategory === null ? (
            <div className="space-y-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-7">
                {loadingCats ? (
                  <div className="col-span-full flex justify-center py-16">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {categories.map(cat => (
                      <CategoryDomeCard 
                        key={cat.id}
                        category={cat}
                        isSelected={false}
                        onClick={() => setSelectedCategory(cat.id)}
                      />
                    ))}
                    
                    {categories.length === 0 && (
                      <div className="col-span-full text-center py-16 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm">
                        <Utensils size={48} className="mx-auto text-neutral-300 mb-4" />
                        <p className="text-neutral-500 font-bold text-xl">مفيش أصناف متاحة حالياً.</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {categories.length > 0 && (
                <div className="text-center">
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-black hover:bg-neutral-800 text-white font-black text-base transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span>عرض المنيو الكامل</span>
                    <ArrowLeft size={18} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-100">
                <button 
                  onClick={() => setSelectedCategory(null)} 
                  className="flex items-center gap-2 text-neutral-500 hover:text-brand-black font-bold transition-colors w-fit bg-neutral-50 hover:bg-neutral-100 px-4 py-2 rounded-xl"
                >
                  <ArrowLeft size={20} /> ارجع للتصنيفات
                </button>
                <h2 className="text-2xl font-black text-brand-black">
                  {categories.find(c => c.id === selectedCategory)?.name || 'القسم'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(() => {
                  if (loadingProds) return Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />);
                  const filteredProducts = products.filter(p => p.categoryId === selectedCategory);
                  if (filteredProducts.length > 0) {
                    return filteredProducts.map(prod => <ProductCard key={prod.id} product={prod} onAddClick={setSelectedProduct} />);
                  }
                  return (
                    <div className="col-span-full text-center py-16 text-neutral-500 font-medium bg-white rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center">
                      <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      </div>
                      <p className="text-lg text-brand-black font-bold mb-1">مفيش منتجات</p>
                      <p className="text-sm">القسم ده لسه مفيهوش منتجات.</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story Highlights */}
      <section className="py-24 bg-brand-black text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <Utensils size={40} />
              </div>
              <h3 className="text-2xl font-black mb-3">مكونات فريش</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">بنجيب أنضف وأجود المكونات عشان نظبطلك الطعم في كل قطمة.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <Clock size={40} />
              </div>
              <h3 className="text-2xl font-black mb-3">تحضير سريع</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">الأكل بيتعملك سخن وفريش أول ما تطلب عشان يوصلك مظبوط.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <ThumbsUp size={40} />
              </div>
              <h3 className="text-2xl font-black mb-3">جودة ملهاش مثيل</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">عشان بنهتم بالتفاصيل، أكيد هترجع تطلب مننا كمان وكمان.</p>
            </div>
          </div>
        </div>
      </section>

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
