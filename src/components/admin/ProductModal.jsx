import React, { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon, Plus, Trash2, Package } from 'lucide-react';
import { Modal } from '../common/Modal';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';
import logoImg from '../../assets/logo.jpeg';

export const ProductModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    displayOrder: 1,
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [variants, setVariants] = useState([{ name: 'Standard', price: 0, displayOrder: 1, isAvailable: true }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        setFormData({
          categoryId: initialData.categoryId || '',
          name: initialData.name || '',
          description: initialData.description || '',
          displayOrder: initialData.displayOrder || 1,
          isAvailable: initialData.isAvailable !== false,
        });
        setImagePreview(initialData.image || null);
        setImageFile(null);
        setVariants(initialData.variants?.length ? initialData.variants : [{ name: 'Standard', price: 0, displayOrder: 1, isAvailable: true }]);
      } else {
        setFormData({ categoryId: '', name: '', description: '', displayOrder: 1, isAvailable: true });
        setImagePreview(null);
        setImageFile(null);
        setVariants([{ name: 'Standard', price: 0, displayOrder: 1, isAvailable: true }]);
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getCategories(1, 100);
      const data = res.data?.data?.data || res.data?.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: 0, displayOrder: variants.length + 1, isAvailable: true }]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.name || variants.length === 0) {
      setError('Category, Name, and at least one Variant are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      if (initialData) submitData.append('Id', initialData.id);
      submitData.append('CategoryId', formData.categoryId);
      submitData.append('Name', formData.name);
      if (formData.description) submitData.append('Description', formData.description);
      submitData.append('DisplayOrder', formData.displayOrder);
      submitData.append('IsAvailable', formData.isAvailable);
      
      if (imageFile) {
        submitData.append('Image', imageFile);
      }

      variants.forEach((v, index) => {
        if (v.id) submitData.append(`Variants[${index}].Id`, v.id);
        submitData.append(`Variants[${index}].Name`, v.name);
        submitData.append(`Variants[${index}].Price`, v.price);
        submitData.append(`Variants[${index}].DisplayOrder`, v.displayOrder);
        submitData.append(`Variants[${index}].IsAvailable`, v.isAvailable);
      });

      if (initialData) {
        await productsApi.updateProduct(initialData.id, submitData);
      } else {
        await productsApi.createProduct(submitData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product.');
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
        ) : (
          initialData ? 'Save Changes' : 'Save Product'
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Product' : 'Add New Product'}
      subtitle="Fill in the menu item details, image, and price variants"
      icon={Package}
      maxWidth="2xl"
      asForm
      onSubmit={handleSubmit}
      footer={footerActions}
    >
      {error && (
        <div className="p-4 rounded-xl bg-semantic-danger/10 text-semantic-danger text-sm font-bold border border-semantic-danger/20 flex items-center">
          {error}
        </div>
      )}

      {/* Main product fields & image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
              Category <span className="text-semantic-danger">*</span>
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm text-base"
            >
              <option value="" disabled>Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
              Product Name <span className="text-semantic-danger">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Double Beef Burger"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Brief description of ingredients or taste"
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm resize-none text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
                Display Order
              </label>
              <input
                required
                type="number"
                min="0"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm text-base"
              />
            </div>
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer bg-neutral-50 px-3 py-3 rounded-xl border border-neutral-200 select-none h-[46px]">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-5 h-5 rounded text-primary focus:ring-primary border-neutral-300 bg-white"
                />
                <span className="font-bold text-sm text-brand-black">Available</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product image uploader */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            Product Image
          </label>
          <div className="relative group w-full h-48 sm:h-56 md:h-[calc(100%-2rem)] min-h-[190px] rounded-2xl overflow-hidden border-2 border-dashed border-neutral-300 bg-white hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <img 
              src={imagePreview || logoImg} 
              alt="Preview" 
              decoding="async"
              width={256}
              height={256}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }}
            />
            {!imagePreview && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 text-brand-black group-hover:text-primary transition-colors pointer-events-none">
                <ImageIcon size={32} className="mb-2 opacity-80" />
                <span className="font-bold text-sm drop-shadow-md">Click to Upload Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-white font-bold tracking-wider text-xs sm:text-sm bg-brand-black/60 px-3 py-1.5 rounded-full">CHANGE IMAGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Variants section */}
      <div className="border-t border-neutral-200 pt-5 sm:pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-brand-black uppercase tracking-wide">
              Variants & Pricing <span className="text-semantic-danger">*</span>
            </h3>
            <p className="text-xs text-neutral-400 font-medium">Add at least one size, option, or price tier.</p>
          </div>
          <button 
            type="button" 
            onClick={addVariant}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs sm:text-sm hover:bg-primary hover:text-white transition-all border border-primary/20 shrink-0"
          >
            <Plus size={16} /> Add Variant
          </button>
        </div>
        
        {/* Variants list without nested scroll traps */}
        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 sm:bg-white p-3.5 sm:p-3 rounded-xl border border-neutral-200 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-end sm:gap-3 transition-colors"
            >
              {/* Variant Name */}
              <div className="w-full sm:flex-1 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                  Variant Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Standard, Large"
                  value={v.name}
                  onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-white sm:bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-brand-black"
                />
              </div>

              {/* Price & Order in a 2-col row on mobile */}
              <div className="grid grid-cols-2 sm:flex sm:items-end gap-2.5">
                <div className="w-full sm:w-28 flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                    Price (EGP)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                    className="w-full px-3 py-2 bg-white sm:bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-brand-black"
                  />
                </div>

                <div className="w-full sm:w-20 flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                    Order
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="1"
                    value={v.displayOrder}
                    onChange={(e) => handleVariantChange(idx, 'displayOrder', e.target.value)}
                    className="w-full px-3 py-2 bg-white sm:bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-brand-black"
                  />
                </div>
              </div>

              {/* Status & Delete */}
              <div className="flex items-center justify-between sm:justify-start gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                <label className="flex items-center gap-1.5 cursor-pointer bg-white sm:bg-neutral-50 px-2.5 py-2 rounded-lg border border-neutral-200 h-[38px] select-none">
                  <input
                    type="checkbox"
                    checked={v.isAvailable}
                    onChange={(e) => handleVariantChange(idx, 'isAvailable', e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-neutral-300"
                  />
                  <span className="text-xs font-bold uppercase text-brand-black">Available</span>
                </label>

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    aria-label="Delete variant"
                    className="p-2 text-neutral-400 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-colors h-[38px] flex items-center justify-center border border-transparent hover:border-semantic-danger/20"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
