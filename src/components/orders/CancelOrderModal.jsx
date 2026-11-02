import React, { useState, useEffect } from 'react';
import { Loader2, AlertOctagon } from 'lucide-react';
import { Modal } from '../common/Modal';
import { ordersApi } from '../../api/orders.api';

export const CancelOrderModal = ({ isOpen, onClose, onSuccess, order }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('لازم تكتب سبب الإلغاء.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ordersApi.cancelOrder(order.id, reason.trim());
      
      // WhatsApp message for cancellation
      let phone = order?.customerPhoneNumber || '';
      if (phone.startsWith('01')) {
        phone = '2' + phone;
      }
      
      const separator = '━━━━━━━━━━━━━━';
      const message = `أهلاً بيك في ONE MORE!\n${separator}\nنعتذر لإبلاغك بأنه تم إلغاء طلبك رقم #${order?.invoiceNumber || order?.id}.\n${separator}\n*سبب الإلغاء:*\n${reason.trim()}\n${separator}\nنتمنى خدمتك في أقرب وقت!`;
      
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل في إلغاء الطلب.');
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
        disabled={loading || !reason.trim()}
        className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-semantic-danger hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(217,45,32,0.39)] text-sm sm:text-base active:scale-95 text-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري الإلغاء...
          </>
        ) : 'تأكيد الإلغاء'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إلغاء الطلب"
      subtitle={`طلب رقم #${order?.invoiceNumber || order?.id}`}
      icon={AlertOctagon}
      variant="danger"
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
            سبب الإلغاء <span className="text-semantic-danger">*</span>
          </label>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-semantic-danger/50 focus:border-semantic-danger transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm resize-none text-base"
            placeholder="مثال: العميل طلب الإلغاء، العنوان خارج نطاق التوصيل..."
          />
        </div>
      </div>
    </Modal>
  );
};
