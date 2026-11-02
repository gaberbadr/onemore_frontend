import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../api/categories.api';
import { CategoryModal } from '../../components/admin/CategoryModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { Plus, Trash2, Edit2, LayoutGrid, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteData, setDeleteData] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.getCategories(pageIndex, pageSize);
      const data = response.data?.data || response.data;
      setCategories(data.data || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pageIndex]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteData.id) return;
    setIsDeleting(true);
    try {
      await categoriesApi.deleteCategory(deleteData.id);
      setDeleteData({ isOpen: false, id: null });
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const getImageSrc = (imageString) => {
    if (!imageString) return null;
    return imageString.replace(/\[|\]|\(|\)/g, '');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-black flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-brand-black text-white rounded-xl shadow-md">
              <LayoutGrid size={24} />
            </div>
            Categories
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">Manage your menu categories and display order.</p>
        </div>
        
        <button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.23)] flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          New Category
        </button>
      </div>

      <div className="bg-brand-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100/50 border-b border-neutral-200 text-xs text-neutral-500 font-bold uppercase tracking-widest">
                <th className="py-5 px-6 w-28 text-center">Image</th>
                <th className="py-5 px-6">Category Name</th>
                <th className="py-5 px-6 text-center w-32">Display Order</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                      <LayoutGrid size={32} />
                    </div>
                    <p className="text-neutral-500 font-bold text-lg">No categories found.</p>
                    <p className="text-neutral-400 text-sm mt-1">Start by adding a new category to your menu.</p>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="py-4 px-6 text-center">
                      <div className="w-16 h-16 rounded-xl bg-white shadow-sm overflow-hidden border border-neutral-200 mx-auto">
                        {category.image ? (
                          <img 
                            src={getImageSrc(category.image)} 
                            alt={category.name} 
                            loading="lazy" 
                            decoding="async" 
                            width={64} 
                            height={64} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.src = logoImg; e.target.onerror = null; }} 
                          />
                        ) : (
                          <img 
                            src={logoImg} 
                            alt="Default Logo" 
                            loading="lazy" 
                            decoding="async" 
                            width={64} 
                            height={64} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-black text-brand-black text-lg">
                        {category.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 text-brand-black font-black border border-neutral-200 shadow-inner">
                        {category.displayOrder}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2.5 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20"
                          title="Edit Category"
                        >
                          <Edit2 size={18} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => setDeleteData({ isOpen: true, id: category.id })}
                          className="p-2.5 text-neutral-500 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-xl transition-all border border-transparent hover:border-semantic-danger/20"
                          title="Delete Category"
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
            <span className="text-sm text-neutral-500 font-bold">
              Showing {(pageIndex - 1) * pageSize + 1} to {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                disabled={pageIndex === 1}
                className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 disabled:opacity-50 disabled:bg-transparent text-brand-black transition-all shadow-sm"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <span className="text-sm font-black px-4 py-2 text-brand-black">
                {pageIndex} / {totalPages}
              </span>
              <button
                onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                disabled={pageIndex === totalPages}
                className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 disabled:opacity-50 disabled:bg-transparent text-brand-black transition-all shadow-sm"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCategories}
        initialData={selectedCategory}
      />

      <ConfirmDeleteModal
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ isOpen: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? This will not delete the products inside it, but they will lose this categorization. This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
};
