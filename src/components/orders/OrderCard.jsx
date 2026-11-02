import { useState } from 'react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Phone, MapPin, Tag, MessageSquare, PackageOpen, Play, Truck, Ban, MessageCircle, Receipt, CheckCircle2, AlertTriangle, MoreVertical, Trash2 } from 'lucide-react';
import { ordersApi } from '../../api/orders.api';
import { deliveriesApi } from '../../api/deliveries.api';

export const OrderCard = ({ order, onPrepare, onOnWay, onCancel, disableActions, onOpenInvoice, onDelete }) => {
  const [waSent, setWaSent] = useState(order.whatsAppSent || false);
  const [waLoading, setWaLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleWaSent = async () => {
    let phone = order.customerPhoneNumber || '';
    if (phone.startsWith('01')) {
      phone = '2' + phone;
    }
    
    const separator = '━━━━━━━━━━━━━━';
    
    let itemsText = order.items?.map(i => `- ${i.quantity}x ${i.productName || 'منتج'} (${i.variantName || 'عادي'})\n   السعر: ${(i.totalPrice || (i.unitPrice * i.quantity) || 0).toFixed(2)} ج.م`).join('\n') || '';
    
    let subtotal = order.subtotal || order.items?.reduce((sum, item) => sum + (item.totalPrice || (item.unitPrice * item.quantity) || 0), 0) || 0;
    let total = (order.total || order.finalAmount || 0).toFixed(2);
    let subtotalFixed = subtotal.toFixed(2);
    let deliveryFee = order.deliveryFee || (order.total - subtotal).toFixed(2);
    
    let priceText = `إجمالي المنتجات: ${subtotalFixed} ج.م\nالتوصيل: ${deliveryFee} ج.م\nالإجمالي النهائي: *${total} ج.م*`;
    
    let message = `أهلاً بيك في ONE MORE!\n${separator}\nاستلمنا طلبك رقم #${order.invoiceNumber || order.id} بنجاح.\n${separator}\n*تفاصيل الطلب:*\n${itemsText}\n${separator}\n*الحساب:*\n${priceText}\n${separator}\nطلبك دلوقتي قيد التجهيز وهنتواصل معاك أول ما يخرج للتوصيل!`;
    
    if (order.status === 3 && order.deliveryId) {
      try {
        setWaLoading(true);
        const res = await deliveriesApi.getDeliveries(1, 100);
        const deliveries = res.data?.data?.data || res.data?.data || [];
        const deliveryBoy = deliveries.find(d => d.id === order.deliveryId);
        
        if (deliveryBoy) {
          message = `أهلاً بيك في ONE MORE!\n${separator}\nطلبك رقم #${order.invoiceNumber || order.id} في الطريق ليك دلوقتي!\n${separator}\n*تفاصيل الطلب:*\n${itemsText}\n${separator}\n*الحساب:*\n${priceText}\n${separator}\n*بيانات المندوب:*\nالاسم: ${deliveryBoy.name}\nرقم الموبايل: ${deliveryBoy.phoneNumber}\n${separator}\nبالهنا والشفا!`;
        }
      } catch (err) {
        console.error("Could not fetch delivery details", err);
      } finally {
        setWaLoading(false);
      }
    }

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    if (!waSent) {
      setWaLoading(true);
      try {
        await ordersApi.markWhatsAppSent(order.id);
        setWaSent(true);
      } catch (err) {
        console.error(err);
      } finally {
        setWaLoading(false);
      }
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'دلوقتي';
    return new Date(dateString).toLocaleString('ar-EG', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="bg-brand-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-50/50 rounded-t-2xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-black text-xl text-brand-black tracking-tight">#{order.invoiceNumber || order.id}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <span className="text-sm font-bold text-neutral-400">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="text-right flex-shrink-0 flex items-start gap-4">
          <div>
            <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">الإجمالي</div>
            <div className="text-2xl font-black text-primary leading-none">
              {(order.total || order.finalAmount || 0).toFixed(2)} <span className="text-sm">ج.م</span>
            </div>
          </div>
          
          {onDelete && (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-black hover:bg-neutral-200 transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(order.id);
                      }}
                      className="w-full text-right sm:text-left px-4 py-2.5 text-sm font-bold text-semantic-danger hover:bg-semantic-danger/10 flex items-center justify-between transition-colors"
                    >
                      <span>امسح الأوردر</span>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-neutral-600">
              <Phone size={18} className="mt-0.5 text-neutral-400 shrink-0" />
              <div className="font-bold">{order.customerPhoneNumber}</div>
            </div>
            <div className="flex items-start gap-3 text-neutral-600">
              <MapPin size={18} className="mt-0.5 text-neutral-400 shrink-0" />
              <div>
                <div className="font-bold">{order.deliveryAreaName || `Area ID: ${order.deliveryAreaId}`}</div>
                <div className="text-sm text-neutral-500 mt-1">{order.address}</div>
              </div>
            </div>
            {order.couponCode && (
              <div className="flex items-start gap-3 text-primary font-bold">
                <Tag size={18} className="mt-0.5 shrink-0" />
                <div>{order.couponCode}</div>
              </div>
            )}
            {order.comment && (
              <div className="flex items-start gap-3 text-neutral-600 p-3 bg-neutral-100 rounded-xl">
                <MessageSquare size={18} className="mt-0.5 text-neutral-400 shrink-0" />
                <div className="text-sm font-medium italic">"{order.comment}"</div>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-bold text-brand-black flex items-center gap-2 mb-3">
              <PackageOpen size={18} className="text-neutral-400" /> الأصناف المطلوبة
            </h4>
            <ul className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              {order.items?.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <div>
                    <span className="font-black text-brand-black">{item.quantity}x</span>{' '}
                    <span className="font-bold text-neutral-600">{item.productName || 'منتج'} ({item.variantName || 'عادي'})</span>
                    {item.comment && (
                      <p className="text-xs text-neutral-500 italic mt-1 ml-5">ملاحظة: {item.comment}</p>
                    )}
                  </div>
                </li>
              ))}
              {(!order.items || order.items.length === 0) && (
                <li className="text-sm text-neutral-400 italic">الأصناف مش باينة</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 flex flex-wrap justify-end gap-3 rounded-b-2xl">
        <div className="flex items-center gap-3 mr-auto flex-wrap">
          {!disableActions && [1, 2, 3].includes(order.status) && (
            <button 
              onClick={() => onCancel(order)}
              className="px-4 py-2 rounded-xl font-bold text-semantic-danger border border-semantic-danger/20 hover:bg-semantic-danger hover:text-white transition-all flex items-center gap-2"
            >
              <Ban size={16} /> إلغاء
            </button>
          )}
          
          <button 
            onClick={() => onOpenInvoice(order.id)}
            className="px-4 py-2 rounded-xl font-bold text-brand-black bg-white border border-neutral-200 hover:bg-neutral-100 transition-all flex items-center gap-2 shadow-sm"
          >
            <Receipt size={16} /> الفاتورة
          </button>

          {order.status !== 1 && (
            <button 
              onClick={handleWaSent}
              disabled={waLoading}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm border ${
                waSent 
                  ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/20' 
                  : 'bg-semantic-danger/10 text-semantic-danger border-semantic-danger/20 hover:bg-semantic-danger/20'
              }`}
            >
              {waSent ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {waLoading ? 'جاري الإرسال...' : waSent ? 'الواتساب اتبعت (ابعت تاني)' : 'ابعت واتساب (متبعتش)'}
            </button>
          )}
        </div>

        {!disableActions && [1, 2].includes(order.status) && (
          <div className="flex gap-3">
            {order.status === 1 && (
              <button 
                onClick={() => onPrepare(order.id)}
                className="px-6 py-2 rounded-xl font-bold text-white bg-[#61AFFE] hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm"
              >
                <Play size={16} className="fill-white" /> ابدأ تجهيز الطلب
              </button>
            )}
            
            {order.status === 2 && (
              <button 
                onClick={() => onOnWay(order.id)}
                className="px-6 py-2 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center gap-2 shadow-sm"
              >
                <Truck size={16} /> الأوردر طلع (في الطريق)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
