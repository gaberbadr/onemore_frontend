import React, { useState } from 'react';
import { ordersApi } from '../../api/orders.api';
import { Loader2, Search, History, Phone, MapPin, ReceiptText } from 'lucide-react';

export const CustomerHistory = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  // Pagination (simplified for this view)
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!phoneNumber.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);
    
    try {
      const res = await ordersApi.getCustomerHistory({ phoneNumber: phoneNumber.trim(), pageIndex, pageSize });
      const paginationObj = res.data?.data || res.data;
      setOrders(Array.isArray(paginationObj?.data) ? paginationObj.data : Array.isArray(paginationObj) ? paginationObj : []);
      setTotalCount(paginationObj?.count || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customer history.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-black flex items-center gap-3 tracking-tight">
          <div className="p-2.5 bg-brand-black text-white rounded-xl shadow-md">
            <History size={24} />
          </div>
          Customer History
        </h1>
        <p className="text-neutral-500 mt-2 font-medium">Search past orders by customer phone number.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-8 flex gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
            <Phone size={20} />
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter customer phone number (e.g. 010...)"
            className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-bold text-brand-black text-lg"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !phoneNumber.trim()}
          className="px-8 py-4 rounded-xl font-black text-white bg-primary hover:bg-primary-dark transition-all flex items-center gap-2 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          Search
        </button>
      </div>

      {error && (
        <div className="p-4 bg-semantic-danger/10 text-semantic-danger rounded-xl font-bold border border-semantic-danger/20 mb-6 text-center">
          {error}
        </div>
      )}

      {hasSearched && !loading && !error && orders.length === 0 && (
        <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <ReceiptText size={32} />
          </div>
          <p className="text-neutral-500 font-bold text-lg">No previous orders found.</p>
          <p className="text-neutral-400 text-sm mt-1">This phone number has no order history.</p>
        </div>
      )}

      {loading && orders.length === 0 && (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.invoiceNumber || order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-black text-xl text-brand-black tracking-tight">Invoice #{order.invoiceNumber}</h3>
                  <span className="text-sm font-bold text-neutral-400">{formatDate(order.orderedAt || order.createdAt)}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-primary leading-none">
                    {order.total?.toFixed(2) || order.finalAmount?.toFixed(2)} <span className="text-sm font-bold text-neutral-500">EGP</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-neutral-600 font-medium">
                <MapPin size={18} className="mt-0.5 text-neutral-400 shrink-0" />
                <div>
                  <span className="font-bold text-brand-black">{order.deliveryAreaName}</span>
                  <p className="text-sm text-neutral-500 mt-1">{order.address}</p>
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                <ul className="space-y-2 text-sm font-bold text-brand-black">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary">{item.quantity}x</span> {item.productName || `Variant ${item.productVariantId}`}
                    </li>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <li className="text-neutral-400 italic">No items details</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
