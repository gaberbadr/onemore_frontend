import { useEffect } from 'react';

// Global counter so nested or sequential modals don't prematurely restore body scroll
let openModalsCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

export const useBodyScrollLock = (isOpen = false, onClose = null) => {
  useEffect(() => {
    if (!isOpen) return;

    if (openModalsCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      // Prevent content shift from scrollbar disappearing on desktop
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
    }

    openModalsCount += 1;

    // Handle ESC key to close modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      openModalsCount = Math.max(0, openModalsCount - 1);

      if (openModalsCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [isOpen, onClose]);
};
