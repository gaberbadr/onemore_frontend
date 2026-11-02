import React, { useState, useEffect } from 'react';
import { ordersApi } from '../../api/orders.api';
import { adminApi } from '../../api/admin.api';
import { OrderCard } from '../../components/orders/OrderCard';
import { AssignDeliveryModal } from '../../components/orders/AssignDeliveryModal';
import { CancelOrderModal } from '../../components/orders/CancelOrderModal';
import { InvoiceModal } from '../../components/orders/InvoiceModal';
import { ConfirmActionModal } from '../../components/common/ConfirmActionModal';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Calendar, ClipboardList, ChevronLeft, ChevronRight, Play, Trash2, Bell, X } from 'lucide-react';

export const OrdersManagement = () => {
  const { role } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [activeTab, setActiveTab] = useState('All'); // All, Pending, Preparing, OnWay, Cancelled
  const [dateMode, setDateMode] = useState('today'); // today, history
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [assignDeliveryModal, setAssignDeliveryModal] = useState({ isOpen: false, orderId: null });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, order: null });
  const [invoiceModal, setInvoiceModal] = useState({ isOpen: false, orderId: null });
  const [prepareModal, setPrepareModal] = useState({ isOpen: false, orderId: null });
  const [deleteOrderModal, setDeleteOrderModal] = useState({ isOpen: false, orderId: null });
  const [isMutating, setIsMutating] = useState(false);

  const getStatusEnum = (tab) => {
    switch (tab) {
      case 'Pending': return 1;
      case 'Preparing': return 2;
      case 'OnWay': return 3;
      case 'Cancelled': return 5;
      default: return null;
    }
  };

  // --- Real-time Polling Logic ---
  const [pendingCount, setPendingCount] = useState(0);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  const playNotificationSound = () => {
    try {
      // A gentle, premium notification chime
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play blocked by browser', e));
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-dismiss alert after 5 seconds
  useEffect(() => {
    let timeoutId;
    if (newOrderAlert) {
      timeoutId = setTimeout(() => {
        setNewOrderAlert(false);
      }, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [newOrderAlert]);

  useEffect(() => {
    // Only poll if we are viewing 'today' orders
    if (dateMode !== 'today') return;

    const checkPendingOrders = async () => {
      try {
        const res = await ordersApi.getTodayOrders({ pageIndex: 1, pageSize: 1, status: 1 });
        const count = res.data?.data?.count ?? res.data?.count ?? 0;
        
        setPendingCount(prev => {
          if (prev !== 0 && count > prev) {
            // New order arrived!
            setNewOrderAlert(true);
            playNotificationSound();
            
            // Auto-refresh the current list if they are on 'All' or 'Pending'
            if (activeTab === 'All' || activeTab === 'Pending') {
              fetchOrders();
            }
          }
          return count;
        });
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    // Initial check
    checkPendingOrders();

    // Poll every 1 minute (60000 ms)
    const interval = setInterval(checkPendingOrders, 60000);
    return () => clearInterval(interval);
  }, [dateMode, activeTab]);
  // ------------------------------

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusParam = getStatusEnum(activeTab);
      let response;
      if (dateMode === 'today') {
        response = await ordersApi.getTodayOrders({ pageIndex, pageSize, status: statusParam });
      } else {
        response = await ordersApi.getHistoricalOrders({ date: selectedDate, pageIndex, pageSize, status: statusParam });
      }
      
      const paginationObj = response.data?.data || response.data;
      setOrders(Array.isArray(paginationObj?.data) ? paginationObj.data : Array.isArray(paginationObj) ? paginationObj : []);
      setTotalCount(paginationObj?.count || 0);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pageIndex, activeTab, dateMode, selectedDate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPageIndex(1);
  };

  const handleDateModeChange = (mode) => {
    setDateMode(mode);
    setPageIndex(1);
  };

  const handlePrepare = async (orderId) => {
    setIsMutating(true);
    try {
      await ordersApi.moveOrderToPrepare(orderId);
      setPrepareModal({ isOpen: false, orderId: null });
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to prepare order.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setIsMutating(true);
    try {
      await adminApi.deleteOrder(orderId);
      setDeleteOrderModal({ isOpen: false, orderId: null });
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete order.');
    } finally {
      setIsMutating(false);
    }
  };

  const tabs = ['All', 'Pending', 'Preparing', 'OnWay', 'Cancelled'];
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-black flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-brand-black text-white rounded-xl shadow-md">
              <ClipboardList size={24} />
            </div>
            الطلبات
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">تابع وأدير طلبات العملاء.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-neutral-200">
          <button 
            onClick={() => handleDateModeChange('today')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${dateMode === 'today' ? 'bg-primary text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100'}`}
          >
            طلبات النهاردة
          </button>
          <div className="w-px h-8 bg-neutral-200 mx-1"></div>
          <div className="flex items-center relative">
            <button 
              onClick={() => handleDateModeChange('history')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${dateMode === 'history' ? 'bg-brand-black text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100'}`}
            >
              <Calendar size={18} />
              سجل الطلبات
            </button>
            {dateMode === 'history' && (
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ml-3 px-3 py-2 bg-neutral-100 border-none rounded-lg text-sm font-bold text-brand-black focus:ring-2 focus:ring-brand-black"
              />
            )}
          </div>
        </div>
      </div>

      {/* New Order Alert Toast */}
      {newOrderAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-brand-black text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(255,106,0,0.3)] flex items-center gap-5 animate-in slide-in-from-top-10 fade-in zoom-in-95 duration-500 border border-primary/30">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary relative">
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
            <Bell size={24} className="animate-bounce" />
          </div>
          <div>
            <h3 className="font-black text-xl text-primary">أوردر جديد وصل! 🚀</h3>
            <p className="text-sm text-neutral-300 font-medium mt-1">في عميل لسه طالب أوردر دلوقتي، ادخل جهزه.</p>
          </div>
          <div className="mr-6 flex items-center gap-3">
            <button 
              onClick={() => {
                setNewOrderAlert(false);
                handleTabChange('Pending');
              }}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg"
            >
              شوفه دلوقتي
            </button>
            <button 
              onClick={() => setNewOrderAlert(false)} 
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral-200/50 p-1 rounded-2xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white text-brand-black shadow-sm'
                : 'text-neutral-500 hover:text-brand-black hover:bg-white/50'
            }`}
          >
            {tab === 'All' ? 'الكل' : tab === 'Pending' ? 'قيد الانتظار' : tab === 'Preparing' ? 'جاري التجهيز' : tab === 'OnWay' ? 'في الطريق' : tab === 'Cancelled' ? 'ملغية' : tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6 relative">
        {isMutating && (
          <div className="absolute inset-0 bg-white/50 ] z-10 flex items-center justify-center rounded-2xl">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <ClipboardList size={32} />
            </div>
            <p className="text-neutral-500 font-bold text-lg">مفيش طلبات.</p>
            <p className="text-neutral-400 text-sm mt-1">جرب تغير الفلاتر أو التاريخ.</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onPrepare={() => setPrepareModal({ isOpen: true, orderId: order.id })}
              onOnWay={() => setAssignDeliveryModal({ isOpen: true, orderId: order.id })}
              onCancel={(orderObj) => setCancelModal({ isOpen: true, order: orderObj })}
              onOpenInvoice={(id) => setInvoiceModal({ isOpen: true, orderId: id })}
              disableActions={dateMode === 'history'}
              onDelete={role === 'Admin' ? () => setDeleteOrderModal({ isOpen: true, orderId: order.id }) : undefined}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-neutral-500 font-bold">
            عرض {(pageIndex - 1) * pageSize + 1} لـ {Math.min(pageIndex * pageSize, totalCount)} من {totalCount}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageIndex(p => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
              className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 text-brand-black shadow-sm"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <span className="text-sm font-black px-4 text-brand-black">
              {pageIndex} / {totalPages}
            </span>
            <button
              onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
              disabled={pageIndex === totalPages}
              className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 text-brand-black shadow-sm"
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AssignDeliveryModal 
        isOpen={assignDeliveryModal.isOpen} 
        onClose={() => setAssignDeliveryModal({ isOpen: false, orderId: null })}
        onSuccess={fetchOrders}
        orderId={assignDeliveryModal.orderId}
      />
      <CancelOrderModal 
        isOpen={cancelModal.isOpen} 
        onClose={() => setCancelModal({ isOpen: false, order: null })}
        onSuccess={fetchOrders}
        order={cancelModal.order}
      />
      <InvoiceModal 
        isOpen={invoiceModal.isOpen}
        onClose={() => setInvoiceModal({ isOpen: false, orderId: null })}
        orderId={invoiceModal.orderId}
      />
      <ConfirmActionModal 
        isOpen={prepareModal.isOpen}
        onClose={() => setPrepareModal({ isOpen: false, orderId: null })}
        onConfirm={() => handlePrepare(prepareModal.orderId)}
        title="تجهيز الطلب؟"
        message={`متأكد إنك عايز تبدأ في تجهيز الأوردر رقم #${prepareModal.orderId}؟ المطبخ هيبدأ يشتغله.`}
        confirmText="أيوة، ابدأ التجهيز"
        isProcessing={isMutating}
        icon={Play}
        colorClass="text-[#61AFFE]"
        bgClass="bg-[#61AFFE]"
        hoverClass="hover:bg-blue-600"
      />
      <ConfirmActionModal 
        isOpen={deleteOrderModal.isOpen}
        onClose={() => setDeleteOrderModal({ isOpen: false, orderId: null })}
        onConfirm={() => handleDeleteOrder(deleteOrderModal.orderId)}
        title="مسح الطلب نهائياً؟"
        message={`متأكد جداً إنك عايز تمسح الأوردر رقم #${deleteOrderModal.orderId}؟ الخطوة دي مش هينفع ترجع فيها والأوردر هيتمسح خالص من السيستم.`}
        confirmText="أيوة، امسحه"
        isProcessing={isMutating}
        icon={Trash2}
        colorClass="text-semantic-danger"
        bgClass="bg-semantic-danger"
        hoverClass="hover:bg-[#B42318]"
      />
    </div>
  );
};
