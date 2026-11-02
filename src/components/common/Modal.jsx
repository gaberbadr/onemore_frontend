import React, { useRef, useId } from 'react';
import { X } from 'lucide-react';
import { useBodyScrollLock } from './useBodyScrollLock';

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  maxWidth = 'md',
  asForm = false,
  onSubmit,
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  variant = 'default', // 'default' | 'danger'
  customHeader = null,
}) => {
  useBodyScrollLock(isOpen, closeOnEsc ? onClose : null);

  const titleId = useId();
  const backdropMouseDownRef = useRef(false);

  if (!isOpen) return null;

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      backdropMouseDownRef.current = true;
    } else {
      backdropMouseDownRef.current = false;
    }
  };

  const handleBackdropMouseUp = (e) => {
    if (closeOnBackdrop && backdropMouseDownRef.current && e.target === e.currentTarget) {
      onClose();
    }
    backdropMouseDownRef.current = false;
  };

  const maxWidthClass = maxWidthMap[maxWidth] || 'max-w-md';

  const isDanger = variant === 'danger';

  const defaultHeader = (
    <div
      className={`flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b shrink-0 ${
        isDanger
          ? 'border-semantic-danger/15 bg-semantic-danger/5 text-semantic-danger'
          : 'border-neutral-100 bg-neutral-50/70 text-brand-black'
      } ${headerClassName}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-3">
        {Icon && (
          <div
            className={`p-2 rounded-xl shrink-0 ${
              isDanger
                ? 'bg-semantic-danger/10 text-semantic-danger'
                : 'bg-primary/10 text-primary'
            }`}
          >
            <Icon size={20} />
          </div>
        )}
        <div className="min-w-0">
          {title && (
            <h2
              id={titleId}
              className={`text-lg sm:text-xl font-black tracking-tight truncate ${
                isDanger ? 'text-semantic-danger' : 'text-brand-black'
              }`}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xs font-medium text-neutral-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="text-neutral-400 hover:text-brand-black hover:bg-neutral-200/60 p-2 rounded-xl transition-colors shrink-0 bg-white border border-neutral-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );

  const contentElement = (
    <>
      {customHeader !== undefined && customHeader !== null ? customHeader : (title || showCloseButton ? defaultHeader : null)}

      {/* Scrollable content area */}
      <div
        className={`flex-1 overflow-y-auto overscroll-contain modal-scroll-area p-5 sm:p-6 space-y-5 [-webkit-overflow-scrolling:touch] ${bodyClassName}`}
      >
        {children}
      </div>

      {/* Sticky footer area if provided */}
      {footer && (
        <div
          className={`px-5 py-4 sm:px-6 sm:py-4 border-t border-neutral-100 bg-neutral-50/70 shrink-0 flex items-center justify-end gap-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      onMouseDown={handleBackdropMouseDown}
      onMouseUp={handleBackdropMouseUp}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-[2px] transition-all overflow-hidden"
    >
      <div
        className={`w-full ${maxWidthClass} max-h-[90dvh] flex flex-col bg-brand-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 ${className}`}
      >
        {asForm ? (
          <form
            onSubmit={onSubmit}
            className="flex flex-col h-full max-h-[90dvh] overflow-hidden"
          >
            {contentElement}
          </form>
        ) : (
          contentElement
        )}
      </div>
    </div>
  );
};
