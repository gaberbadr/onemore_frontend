import React, { useState, useEffect } from 'react';
import { couponsApi } from '../../api/coupons.api';
import { CreateCouponModal } from '../../components/admin/CreateCouponModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { Plus, Trash2, Tag, Loader2, Percent } from 'lucide-react';

export const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponsApi.getCoupons();
      // Expecting a flat array in data per specification
      const data = response.data?.data || response.data || [];
      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteData.id) return;
    setIsDeleting(true);
    try {
      await couponsApi.deleteCoupon(deleteData.id);
      setDeleteData({ isOpen: false, id: null });
      fetchCoupons();
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-black flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-brand-black text-white rounded-xl shadow-md">
              <Tag size={24} />
            </div>
            Coupons
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">Manage promotional codes and discounts.</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.23)] flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          Create Coupon
        </button>
      </div>

      <div className="bg-brand-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100/50 border-b border-neutral-200 text-xs text-neutral-500 font-bold uppercase tracking-widest">
                <th className="py-5 px-6">Coupon Code</th>
                <th className="py-5 px-6">Discount</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                      <Tag size={32} />
                    </div>
                    <p className="text-neutral-500 font-bold text-lg">No coupons available.</p>
                    <p className="text-neutral-400 text-sm mt-1">Create one to reward customers.</p>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="py-5 px-6">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 font-mono font-bold text-brand-black tracking-widest text-lg shadow-sm">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2 font-black text-brand-black text-xl">
                        <div className="p-1.5 bg-semantic-success/10 text-semantic-success rounded-lg">
                          <Percent size={18} strokeWidth={3} />
                        </div>
                        {coupon.discountPercentage}%
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button
                        onClick={() => setDeleteData({ isOpen: true, id: coupon.id })}
                        className="p-2.5 text-neutral-400 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-xl transition-all border border-transparent hover:border-semantic-danger/20 opacity-0 group-hover:opacity-100"
                        title="Delete Coupon"
                      >
                        <Trash2 size={20} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateCouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCoupons}
      />

      <ConfirmDeleteModal
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ isOpen: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon code? Customers will no longer be able to use it. This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
};
