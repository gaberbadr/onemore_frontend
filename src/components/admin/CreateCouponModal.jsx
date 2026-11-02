import React, { useState, useEffect } from 'react';
import { Loader2, Tag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { couponsApi } from '../../api/coupons.api';

export const CreateCouponModal = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setDiscountPercentage('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const parsedDiscount = parseFloat(discountPercentage);
    if (isNaN(parsedDiscount) || parsedDiscount < 0.1 || parsedDiscount > 100) {
      setError('Discount percentage must be between 0.1 and 100.');
      setLoading(false);
      return;
    }

    try {
      await couponsApi.createCoupon({
        code: code.trim(),
        discountPercentage: parsedDiscount
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase().replace(/\s/g, ''));
  };

  const footerActions = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] text-sm sm:text-base active:scale-95"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : 'Create Coupon'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Coupon"
      subtitle="Add a promo code with a custom percentage discount"
      icon={Tag}
      maxWidth="md"
      asForm
      onSubmit={handleSubmit}
      footer={footerActions}
    >
      {error && (
        <div className="p-4 rounded-xl bg-semantic-danger/10 text-semantic-danger text-sm font-bold border border-semantic-danger/20 flex items-center">
          {error}
        </div>
      )}
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            Coupon Code <span className="text-semantic-danger">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={20}
            value={code}
            onChange={handleCodeChange}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-black placeholder:text-neutral-300 shadow-sm uppercase tracking-widest text-base"
            placeholder="e.g. SUMMER20"
          />
          <p className="text-xs text-neutral-400 mt-1.5 font-medium">Use alphanumeric characters only. Auto-uppercased.</p>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            Discount Percentage (%) <span className="text-semantic-danger">*</span>
          </label>
          <input
            type="number"
            required
            min="0.1"
            max="100"
            step="0.5"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-300 shadow-sm text-base"
            placeholder="e.g. 10.5"
          />
        </div>
      </div>
    </Modal>
  );
};
