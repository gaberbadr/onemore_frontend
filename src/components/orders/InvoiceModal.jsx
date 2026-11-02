import React, { useState, useEffect } from 'react';
import { X, Loader2, Printer, Receipt } from 'lucide-react';
import { ordersApi } from '../../api/orders.api';
import { useBodyScrollLock } from '../common/useBodyScrollLock';

export const InvoiceModal = ({ isOpen, onClose, orderId }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useBodyScrollLock(isOpen, onClose);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchInvoice = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await ordersApi.getOrderInvoice(orderId);
          setInvoice(res.data?.data || res.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load invoice');
        } finally {
          setLoading(false);
        }
      };
      fetchInvoice();
    } else {
      setInvoice(null);
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-[2px] transition-all overflow-hidden print:p-0 print:bg-white print:static print:z-auto"
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90dvh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-200/80 my-auto print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Header - Sticky, Hidden in Print */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-neutral-100 bg-neutral-50/70 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <div className="p-2 rounded-xl bg-brand-black text-white shrink-0">
              <Receipt size={18} />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-brand-black tracking-tight truncate">
              Invoice #{orderId}
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            aria-label="Close dialog"
            className="text-neutral-400 hover:text-brand-black hover:bg-neutral-200/60 p-2 rounded-xl transition-colors shrink-0 bg-white border border-neutral-200 active:scale-95"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Scrollable Receipt Content */}
        <div className="flex-1 overflow-y-auto modal-scroll-area overscroll-contain p-5 sm:p-8 print:p-0 print:overflow-visible font-mono text-brand-black">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-4 bg-semantic-danger/10 text-semantic-danger rounded-xl text-center font-bold">
              {error}
            </div>
          ) : invoice ? (
            <div id="printable-invoice">
              <div className="text-center border-b-2 border-dashed border-neutral-300 pb-6 mb-6">
                <h1 className="text-2xl font-black uppercase tracking-widest">{invoice.restaurantName || 'ONE MORE'}</h1>
                <p className="text-sm text-neutral-500 mt-2 font-bold">INVOICE #{invoice.invoiceNumber}</p>
                <p className="text-xs sm:text-sm text-neutral-500 font-bold mt-1">
                  {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleString() : new Date().toLocaleString()}
                </p>
              </div>

              <div className="mb-6 border-b-2 border-dashed border-neutral-300 pb-6 overflow-x-auto">
                <table className="w-full text-xs sm:text-sm font-bold min-w-[280px]">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left">
                      <th className="pb-2">ITEM</th>
                      <th className="pb-2 text-center w-12">QTY</th>
                      <th className="pb-2 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, idx) => (
                      <tr key={idx} className="border-b border-neutral-100 last:border-b-0">
                        <td className="py-2.5 pr-2">
                          <span className="font-black">{item.productName}</span> 
                          <div className="text-[11px] text-neutral-500">@{item.unitPrice?.toFixed(2)}</div>
                        </td>
                        <td className="py-2.5 text-center">{item.quantity}</td>
                        <td className="py-2.5 text-right whitespace-nowrap">{(item.lineTotal || (item.quantity * item.unitPrice))?.toFixed(2)}</td>
                      </tr>
                    ))}
                    {(!invoice.items || invoice.items.length === 0) && (
                      <tr><td colSpan={3} className="py-3 text-center italic text-neutral-400">No items</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-bold mb-8">
                <div className="flex justify-between">
                  <span className="text-neutral-500">SUBTOTAL</span>
                  <span>{invoice.subtotal?.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">DELIVERY FEE</span>
                  <span>{invoice.deliveryFee?.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black border-t-2 border-brand-black pt-3 mt-3">
                  <span>TOTAL</span>
                  <span>{invoice.total?.toFixed(2)} EGP</span>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-neutral-400 italic">
                Thank you for choosing {invoice.restaurantName || 'ONE MORE'}!
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer - Sticky, Hidden in Print */}
        {!loading && !error && (
          <div className="px-5 py-4 sm:px-6 sm:py-4 border-t border-neutral-100 bg-neutral-50/70 print:hidden flex items-center justify-end gap-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm sm:text-base"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl font-black text-white bg-brand-black hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-md text-sm sm:text-base active:scale-95"
            >
              <Printer size={18} /> Print Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
