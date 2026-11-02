import React, { useState, useEffect } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Modal } from '../common/Modal';
import { deliveryAreasApi } from '../../api/deliveryAreas.api';

export const DeliveryAreaModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEdit = !!initialData;
  const [cityName, setCityName] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCityName(initialData.cityName || '');
        setDeliveryFee(initialData.deliveryFee !== undefined ? String(initialData.deliveryFee) : '');
      } else {
        setCityName('');
        setDeliveryFee('');
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const parsedFee = parseFloat(deliveryFee);
    if (isNaN(parsedFee) || parsedFee < 0) {
      setError('Please enter a valid delivery fee.');
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await deliveryAreasApi.updateDeliveryArea(initialData.id, {
          cityName: cityName.trim(),
          deliveryFee: parsedFee
        });
      } else {
        await deliveryAreasApi.createDeliveryArea({
          cityName: cityName.trim(),
          deliveryFee: parsedFee
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save delivery area');
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
        ) : isEdit ? 'Save Changes' : 'Add Area'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Delivery Area' : 'Add Delivery Area'}
      subtitle="Define zone coverage and associated delivery fees"
      icon={MapPin}
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
            Area / City Name <span className="text-semantic-danger">*</span>
          </label>
          <input
            type="text"
            required
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm text-base"
            placeholder="e.g. Downtown"
          />
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            Delivery Fee (EGP) <span className="text-semantic-danger">*</span>
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.5"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm text-base"
            placeholder="e.g. 15.00"
          />
        </div>
      </div>
    </Modal>
  );
};
