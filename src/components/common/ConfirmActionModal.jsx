import React from 'react';
import { HelpCircle, Loader2, X } from 'lucide-react';
import { useBodyScrollLock } from './useBodyScrollLock';

export const ConfirmActionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'تأكيد', 
  cancelText = 'إلغاء', 
  isProcessing = false,
  icon: Icon = HelpCircle,
  colorClass = 'text-primary',
  bgClass = 'bg-primary',
  hoverClass = 'hover:bg-primary-dark'
}) => {
  useBodyScrollLock(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-[2px] transition-all overflow-hidden"
    >
      <div className="bg-brand-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90dvh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-neutral-100 my-auto">
        {/* Floating close button */}
        <div className="flex justify-end p-4 pb-0 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Close dialog"
            className="text-neutral-400 hover:text-brand-black p-1.5 rounded-xl transition-colors bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="p-6 sm:p-8 pt-2 overflow-y-auto modal-scroll-area flex-1 overscroll-contain">
          <div 
            style={{ backgroundColor: `color-mix(in srgb, currentColor 10%, transparent)` }} 
            className={`mx-auto mb-5 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full ${colorClass.replace('text-', 'bg-').replace('text-brand-black', 'bg-neutral-100')} bg-opacity-10`}
          >
            <div className={`flex items-center justify-center w-full h-full rounded-full ${colorClass.replace('text-', 'bg-')}/10`}>
              <Icon size={36} className={colorClass} strokeWidth={2.5} />
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-brand-black text-center mb-3 tracking-tight">
            {title}
          </h2>
          
          <p className="text-neutral-500 font-medium text-center text-base sm:text-lg leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full sm:w-1/2 py-3 sm:py-3.5 rounded-xl font-bold text-brand-black bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-50 text-base"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className={`w-full sm:w-1/2 py-3 sm:py-3.5 rounded-xl font-black text-white ${bgClass} ${hoverClass} transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 text-base active:scale-95`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري المعالجة...
                </>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
