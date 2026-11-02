import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings.api';
import { adminApi } from '../../api/admin.api';
import { Loader2, Settings as SettingsIcon, Image as ImageIcon, Save, Clock, Phone, MapPin, Store } from 'lucide-react';
import logoImgFallback from '../../assets/logo.jpeg';

export const SettingsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    restaurantName: '',
    phoneNumber: '',
    whatsAppNumber: '',
    address: '',
    restaurantOpen: true,
    openAt: '',
    closeAt: '',
    notificationEmail: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getSettings();
      const data = res.data?.data || {};
      setFormData({
        restaurantName: data.restaurantName || '',
        phoneNumber: data.phoneNumber || '',
        whatsAppNumber: data.whatsAppNumber || '',
        address: data.address || '',
        restaurantOpen: data.restaurantOpen !== false,
        openAt: data.openAt || '',
        closeAt: data.closeAt || '',
        notificationEmail: data.notificationEmail || ''
      });
      setImagePreview(data.logo || null);
    } catch (err) {
      if (err.response?.status === 404) {
        // No settings configured yet, totally fine. Just use the default empty state.
        console.log('No settings found. Starting with default empty state.');
      } else {
        console.error(err);
        setError('Failed to load settings.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('RestaurantName', formData.restaurantName);
      if (formData.phoneNumber) submitData.append('PhoneNumber', formData.phoneNumber);
      if (formData.whatsAppNumber) submitData.append('WhatsAppNumber', formData.whatsAppNumber);
      if (formData.address) submitData.append('Address', formData.address);
      submitData.append('RestaurantOpen', formData.restaurantOpen);
      if (formData.openAt) submitData.append('OpenAt', formData.openAt);
      if (formData.closeAt) submitData.append('CloseAt', formData.closeAt);
      
      if (imageFile) {
        submitData.append('Logo', imageFile);
      }

      await settingsApi.updateSettings(submitData);
      setSuccess('Settings updated successfully!');
      
      // Auto-hide success after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNotificationEmail = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (formData.notificationEmail) {
        await adminApi.setNotificationRecipient(formData.notificationEmail);
        setSuccess('Notification email updated successfully!');
      } else {
        await adminApi.deleteNotificationRecipient();
        setSuccess('Notification email removed successfully!');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update notification email.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50dvh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-black flex items-center gap-3 tracking-tight">
          <div className="p-2.5 bg-brand-black text-white rounded-xl shadow-md">
            <SettingsIcon size={24} />
          </div>
          System Settings
        </h1>
        <p className="text-neutral-500 mt-2 font-medium">Manage global restaurant configurations, branding, and operations.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        {error && (
          <div className="m-6 p-4 rounded-xl bg-semantic-danger/10 text-semantic-danger font-bold border border-semantic-danger/20">
            {error}
          </div>
        )}
        {success && (
          <div className="m-6 p-4 rounded-xl bg-semantic-success/10 text-semantic-success font-bold border border-semantic-success/20">
            {success}
          </div>
        )}

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Logo Upload */}
          <div className="md:col-span-2 flex flex-col items-center sm:flex-row sm:items-start gap-8 pb-8 border-b border-neutral-100">
            <div className="w-40 h-40 relative group rounded-2xl overflow-hidden border-2 border-dashed border-neutral-300 bg-neutral-50 hover:border-primary transition-colors cursor-pointer shrink-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <img 
                src={imagePreview || logoImgFallback} 
                alt="Restaurant Logo" 
                decoding="async"
                width={160}
                height={160}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = logoImgFallback; }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <ImageIcon size={28} className="mb-2" />
                <span className="font-bold text-sm tracking-wider">CHANGE LOGO</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-brand-black tracking-tight mb-2">Restaurant Logo</h3>
              <p className="text-neutral-500 font-medium mb-4 max-w-sm">
                This logo will appear in the customer menu, checkout, and printed invoices.
              </p>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.restaurantOpen} onChange={(e) => setFormData({...formData, restaurantOpen: e.target.checked})} />
                  <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-semantic-success"></div>
                </label>
                <div>
                  <div className="font-bold text-brand-black flex items-center gap-2">
                    {formData.restaurantOpen ? 'Restaurant is Open' : 'Restaurant is Closed'}
                    <span className={`w-2.5 h-2.5 rounded-full ${formData.restaurantOpen ? 'bg-semantic-success animate-pulse' : 'bg-semantic-danger'}`}></span>
                  </div>
                  <div className="text-xs text-neutral-400 font-medium mt-0.5">Toggle to instantly disable ordering.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="font-black text-brand-black text-lg border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <Store size={20} className="text-neutral-400" /> Basic Info
            </h3>
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Restaurant Name <span className="text-semantic-danger">*</span></label>
              <input
                required
                type="text"
                value={formData.restaurantName}
                onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Address</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-6 md:col-span-2 border-t border-neutral-100 pt-8">
            <h3 className="font-black text-brand-black text-lg border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> 
              Order Notifications
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Notification Email</label>
                <input
                  type="email"
                  value={formData.notificationEmail}
                  onChange={(e) => setFormData({...formData, notificationEmail: e.target.value})}
                  placeholder="Enter email to receive new order alerts"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium"
                />
                <p className="text-xs text-neutral-500 mt-2 font-medium">Leave empty and click update to remove the notification recipient.</p>
              </div>
              <button
                type="button"
                onClick={handleUpdateNotificationEmail}
                disabled={saving}
                className="px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-sm disabled:opacity-50 h-[50px] shrink-0 mb-6 sm:mb-0"
              >
                {saving ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-6">
            <h3 className="font-black text-brand-black text-lg border-b border-neutral-100 pb-2 mb-4 flex items-center gap-2">
              <Phone size={20} className="text-neutral-400" /> Contact & Hours
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">WhatsApp</label>
                <input
                  type="tel"
                  value={formData.whatsAppNumber}
                  onChange={(e) => setFormData({...formData, whatsAppNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:border-[#25D366] transition-all text-brand-black font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide flex items-center gap-2">
                  <Clock size={16} /> Open At
                </label>
                <input
                  type="time"
                  step="1"
                  value={formData.openAt}
                  onChange={(e) => setFormData({...formData, openAt: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide flex items-center gap-2">
                  <Clock size={16} /> Close At
                </label>
                <input
                  type="time"
                  step="1"
                  value={formData.closeAt}
                  onChange={(e) => setFormData({...formData, closeAt: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-neutral-50/80 border-t border-neutral-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl font-black text-white bg-brand-black hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
