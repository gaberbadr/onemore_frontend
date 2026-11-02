import React, { useState } from 'react';
import { Mail, Trash2, CheckCircle } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const NotificationRecipientCard = ({ initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      await adminApi.setNotificationRecipient(email);
      setSuccessMsg('Notification recipient updated successfully.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update recipient.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg('');
    try {
      await adminApi.deleteNotificationRecipient();
      setEmail('');
      setSuccessMsg('Notification recipient removed.');
      setIsDeleteModalOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to remove recipient.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-brand-white rounded-xl shadow-sm border border-neutral-100 p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-4 text-brand-black">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Mail size={20} />
          </div>
          <h3 className="text-lg font-bold">System Notifications</h3>
        </div>
        
        <p className="text-sm text-neutral-500 mb-6">
          Set the email address that will receive system alerts and important order notifications.
        </p>

        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@onemore.com"
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black placeholder:text-neutral-400 text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || !email}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-brand-black text-white rounded-xl font-bold hover:bg-brand-softBlack transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px] text-sm sm:text-base active:scale-95"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Save'}
            </button>
            
            {email && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2.5 text-semantic-danger bg-semantic-danger/5 hover:bg-semantic-danger/10 rounded-xl transition-colors border border-semantic-danger/20 shrink-0"
                title="Remove recipient"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </form>

        {successMsg && (
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-semantic-success animate-in slide-in-from-top-1">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}
        
        {errorMsg && (
          <div className="mt-4 text-sm font-medium text-semantic-danger animate-in slide-in-from-top-1">
            {errorMsg}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Remove Recipient"
        message="Are you sure you want to remove the notification recipient? System alerts will no longer be sent via email."
        isDeleting={isDeleting}
      />
    </>
  );
};
