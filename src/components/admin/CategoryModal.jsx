import React, { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, LayoutGrid } from 'lucide-react';
import { Modal } from '../common/Modal';
import { categoriesApi } from '../../api/categories.api';
import logoImg from '../../assets/logo.jpeg';

export const CategoryModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEdit = !!initialData;
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setDisplayOrder(initialData.displayOrder !== undefined ? String(initialData.displayOrder) : '');
        setImagePreview(initialData.image ? initialData.image.replace(/\[|\]|\(|\)/g, '') : null);
      } else {
        setName('');
        setDisplayOrder('');
        setImagePreview(null);
      }
      setImageFile(null);
      setError('');
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('Name', name.trim());
      formData.append('DisplayOrder', displayOrder);
      
      if (isEdit) {
        formData.append('Id', initialData.id);
      }
      
      if (imageFile) {
        formData.append('Image', imageFile);
      }

      if (isEdit) {
        await categoriesApi.updateCategory(initialData.id, formData);
      } else {
        await categoriesApi.createCategory(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save category');
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
        ) : isEdit ? 'Save Changes' : 'Create Category'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Add New Category'}
      subtitle="Manage menu category name, image, and order"
      icon={LayoutGrid}
      maxWidth="lg"
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
          <label className="block text-xs sm:text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">
            Category Image
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-36 sm:h-44 border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden group relative bg-neutral-50"
          >
            {imagePreview ? (
              <>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  decoding="async" 
                  width={400} 
                  height={176} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = logoImg; e.target.onerror = null; }} 
                />
                <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold flex items-center gap-2 bg-primary/90 px-4 py-2 rounded-full text-xs sm:text-sm shadow-md">
                    <Upload size={16} /> Change Image
                  </span>
                </div>
              </>
            ) : (
              <>
                <img 
                  src={logoImg} 
                  alt="Default" 
                  decoding="async" 
                  width={400} 
                  height={176} 
                  className="w-full h-full object-cover opacity-20 grayscale" 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-black group-hover:text-primary transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mb-2">
                    <Upload size={20} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold bg-white/90 px-3 py-1 rounded-full shadow-sm">
                    Click to upload image
                  </span>
                </div>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/png, image/jpeg, image/webp"
              className="hidden" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
              Category Name <span className="text-semantic-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm text-base"
              placeholder="e.g. Signature Burgers"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
              Display Order <span className="text-semantic-danger">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm text-base"
              placeholder="e.g. 1"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
