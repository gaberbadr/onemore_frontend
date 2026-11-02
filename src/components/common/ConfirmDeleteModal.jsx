import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => {
  const footerActions = (
    <div className="flex flex-col-reverse sm:flex-row gap-2.5 w-full sm:w-auto justify-end">
      <button
        type="button"
        onClick={onClose}
        disabled={isDeleting}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-brand-black bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-50 text-sm sm:text-base text-center"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isDeleting}
        className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-semantic-danger hover:bg-[#B42318] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm text-sm sm:text-base active:scale-95 text-center"
      >
        {isDeleting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Deleting...
          </>
        ) : 'Delete'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirm Deletion'}
      icon={AlertTriangle}
      variant="danger"
      maxWidth="md"
      footer={footerActions}
    >
      <div className="text-neutral-600 text-sm sm:text-base leading-relaxed font-medium">
        {message || 'Are you sure you want to delete this? This action cannot be undone.'}
      </div>
    </Modal>
  );
};
