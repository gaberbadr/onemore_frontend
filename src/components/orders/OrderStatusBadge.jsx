import React from 'react';
import { Clock, ChefHat, Truck, XCircle } from 'lucide-react';

export const OrderStatusBadge = ({ status }) => {
  switch (status) {
    case 1:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/20">
          <Clock size={14} /> قيد الانتظار
        </span>
      );
    case 2:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#61AFFE]/10 text-[#61AFFE] border border-[#61AFFE]/20">
          <ChefHat size={14} /> جاري التجهيز
        </span>
      );
    case 3:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          <Truck size={14} /> في الطريق
        </span>
      );
    case 5:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-semantic-danger/10 text-semantic-danger border border-semantic-danger/20">
          <XCircle size={14} /> ملغي
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-500 border border-neutral-200">
          غير معروف
        </span>
      );
  }
};
