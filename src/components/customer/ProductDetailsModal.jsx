import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';
import { useBodyScrollLock } from '../common/useBodyScrollLock';

export const ProductDetailsModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');

  useBodyScrollLock(isOpen, onClose);

  useEffect(() => {
    if (isOpen && product) {
      // Auto-select first available variant
      const available = product.variants?.filter(v => v.isAvailable) || [];
      setSelectedVariant(available.length > 0 ? available[0] : null);
      setQuantity(1);
      setComment('');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    if (!selectedVariant) return;
    
    onAddToCart({
      product,
      variant: selectedVariant,
      quantity,
      comment
    });
    onClose();
  };

  const totalPrice = selectedVariant ? (selectedVariant.price * quantity) : 0;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-[2px] sm:p-4 overflow-hidden"
    >
      <div className="bg-brand-lightBg w-full sm:max-w-lg max-h-[90dvh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 relative border border-neutral-200/80">
        
        {/* Close Button Floating */}
        <button 
          type="button"
          onClick={onClose} 
          aria-label="Close dialog"
          className="absolute top-3.5 right-3.5 z-30 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20 transition-all active:scale-95"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Product Image */}
        <div className="w-full h-40 sm:h-52 bg-white relative shrink-0 overflow-hidden">
          <img 
            src={product.image || logoImg} 
            alt={product.name} 
            decoding="async"
            width={500}
            height={208}
            className={`w-full h-full transition-transform duration-500 hover:scale-105 ${!product.image ? 'object-contain p-6' : 'object-cover'}`}
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = logoImg;
              e.target.className = "w-full h-full object-contain p-6 transition-transform duration-500 hover:scale-105";
            }}
          />
          {product.image && <div className="absolute inset-0 bg-gradient-to-t from-brand-lightBg via-black/15 to-transparent"></div>}
        </div>

        {/* Scrollable details & options */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto modal-scroll-area overscroll-contain relative z-10 -mt-4 bg-brand-lightBg rounded-t-3xl space-y-5">
          {/* Title & Desc */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-black tracking-tight leading-tight mb-1.5">{product.name}</h2>
            {product.description && (
              <p className="text-neutral-500 font-medium text-sm leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Variants Selection */}
          <div>
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2.5">Choose Size / Variant</h3>
            <div className="space-y-2.5">
              {product.variants?.filter(v => v.isAvailable).map((variant) => (
                <div 
                  key={variant.id} 
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedVariant?.id === variant.id 
                      ? 'border-primary bg-primary/5 shadow-sm scale-[1.01]' 
                      : 'border-transparent bg-white shadow-sm hover:border-primary/30 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedVariant?.id === variant.id ? 'border-primary' : 'border-neutral-300'
                    }`}>
                      {selectedVariant?.id === variant.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className="font-bold text-brand-black text-base sm:text-lg">{variant.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-brand-black text-base sm:text-lg">{variant.price.toFixed(2)}</span>
                    <span className="text-xs font-bold text-neutral-500">EGP</span>
                  </div>
                </div>
              ))}
              {product.variants?.filter(v => v.isAvailable).length === 0 && (
                <div className="text-sm text-semantic-danger font-bold p-3.5 bg-semantic-danger/10 rounded-2xl flex items-center gap-2">
                  No available options currently.
                </div>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">Special Instructions</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. No pickles, extra sauce, well done..."
              rows={2}
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-brand-black font-medium shadow-sm resize-none placeholder:text-neutral-400 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] bg-white shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-neutral-100 relative z-20">
          <div className="flex items-center justify-between gap-3 mb-3.5">
            {/* Quantity stepper */}
            <div className="flex items-center gap-3 sm:gap-4 bg-neutral-100 rounded-2xl p-1 border border-neutral-200/60">
              <button 
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-black hover:bg-neutral-50 hover:text-primary transition-colors active:scale-95"
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <span className="font-black text-lg w-5 text-center select-none">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Increase quantity"
                className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-black hover:bg-neutral-50 hover:text-primary transition-colors active:scale-95"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Price</div>
              <div className="flex items-baseline justify-end gap-1 text-primary">
                <span className="text-2xl sm:text-3xl font-black leading-none">{totalPrice.toFixed(2)}</span>
                <span className="text-xs font-bold text-neutral-500">EGP</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedVariant}
            className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-white bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(255,106,0,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(255,106,0,0.6)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
            <span className="text-base sm:text-lg tracking-wide">ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};
