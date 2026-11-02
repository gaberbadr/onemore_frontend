import React, { useState, useEffect } from 'react';
import { Loader2, Truck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { deliveriesApi } from '../../api/deliveries.api';

export const DeliveryModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEdit = !!initialData;
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setPhoneNumber(initialData.phoneNumber || '');
      } else {
        setName('');
        setPhoneNumber('');
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (phoneNumber.trim().length < 8) {
      setError('Please enter a valid phone number.');
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await deliveriesApi.updateDelivery(initialData.id, {
          name: name.trim(),
          phoneNumber: phoneNumber.trim()
        });
      } else {
        await deliveriesApi.createDelivery({
          name: name.trim(),
          phoneNumber: phoneNumber.trim()
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save delivery personnel');
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] text-sm sm:text-base active:scale-95"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : isEdit ? 'Save Changes' : 'Add Courier'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Delivery Person' : 'Add Delivery Person'}
      subtitle="Courier contact information for order dispatching"
      icon={Truck}
      maxWidth="md"
      asForm
      onSubmit={handleSubmit}
      footer={footerActions}
    >
      {error && (
        <div className="p-4 rounded-xl bg-semantic-danger/10 text-semantic-danger text-sm font-bold border border-semantic-danger/20 flex items-center">
          {error}
        </div>
      )}
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            Full Name <span className="text-semantic-danger">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm text-base"
            placeholder="e.g. Alice Courier"
          />
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            Phone Number <span className="text-semantic-danger">*</span>
          </label>
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm text-base"
            placeholder="e.g. 01033334444"
          />
        </div>
      </div>
    </Modal>
  );
};
