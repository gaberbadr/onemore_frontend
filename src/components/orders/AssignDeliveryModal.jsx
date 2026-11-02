import React, { useState, useEffect } from 'react';
import { Loader2, Truck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { deliveriesApi } from '../../api/deliveries.api';
import { ordersApi } from '../../api/orders.api';

export const AssignDeliveryModal = ({ isOpen, onClose, onSuccess, orderId }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSelectedDeliveryId('');
      const fetchDeliveries = async () => {
        setFetchLoading(true);
        try {
          const res = await deliveriesApi.getDeliveries(1, 100);
          const data = res.data?.data?.data || res.data?.data || [];
          setDeliveries(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
          setError('فشل تحميل بيانات الطيارين.');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchDeliveries();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDeliveryId) {
      setError('لازم تختار طيار الأول.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ordersApi.moveOrderToOnWay(orderId, selectedDeliveryId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل في تعيين الطيار.');
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex flex-col-reverse sm:flex-row gap-2.5 w-full sm:w-auto justify-end">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50 text-sm sm:text-base text-center"
      >
        رجوع
      </button>
      <button
        type="submit"
        disabled={loading || !selectedDeliveryId}
        className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] text-sm sm:text-base active:scale-95 text-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري التعيين...
          </>
        ) : 'تأكيد الإخراج'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعيين الطيار وإخراج الطلب"
      subtitle={`طلب رقم #${orderId}`}
      icon={Truck}
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
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            اختار الطيار <span className="text-semantic-danger">*</span>
          </label>
          {fetchLoading ? (
            <div className="flex items-center gap-2 text-neutral-500 font-bold p-3 border border-neutral-200 rounded-xl bg-neutral-50 text-sm sm:text-base">
              <Loader2 className="w-5 h-5 animate-spin text-primary" /> جاري تحميل الطيارين...
            </div>
          ) : (
            <select
              required
              value={selectedDeliveryId}
              onChange={(e) => setSelectedDeliveryId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm text-base"
            >
              <option value="" disabled>اختار الطيار...</option>
              {deliveries.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.phoneNumber})</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </Modal>
  );
};
