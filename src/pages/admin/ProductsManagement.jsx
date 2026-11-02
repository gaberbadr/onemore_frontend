import React, { useState, useEffect } from 'react';
import { productsApi } from '../../api/products.api';
import { ProductModal } from '../../components/admin/ProductModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { Loader2, PackageSearch, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

export const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getProducts(pageIndex, pageSize);
      const paginationObj = res.data?.data;
      if (paginationObj) {
        setProducts(paginationObj.data || []);
        setTotalCount(paginationObj.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageIndex, pageSize]);

  const handleDelete = async () => {
    try {
      await productsApi.deleteProduct(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product.");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-black flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-brand-black text-white rounded-xl shadow-md">
              <PackageSearch size={24} />
            </div>
            Products
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">Manage your menu items and variants.</p>
        </div>
        <button
          onClick={() => setModalState({ isOpen: true, data: null })}
          className="px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs uppercase tracking-wider text-neutral-500 font-black">
                <th className="p-5">Product</th>
                <th className="p-5">Variants</th>
                <th className="p-5 text-center">Order</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-neutral-500">
                    <div className="flex flex-col items-center">
                      <PackageSearch size={48} className="text-neutral-300 mb-4" />
                      <p className="font-bold text-lg text-brand-black">No products found</p>
                      <p className="text-sm">Click "New Product" to add your first menu item.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          <img 
                            src={p.image || logoImg} 
                            alt={p.name} 
                            loading="lazy"
                            decoding="async"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }} 
                          />
                        </div>
                        <div>
                          <div className="font-black text-brand-black text-lg">{p.name}</div>
                          <div className="text-xs font-bold text-neutral-400 max-w-[200px] truncate">{p.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-black text-sm">{p.variants?.length || 0} Variants</span>
                        <span className="text-xs text-neutral-400 font-bold">
                          Starts at {Math.min(...(p.variants?.map(v => v.price) || [0])).toFixed(2)} EGP
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center font-bold text-neutral-600">
                      <span className="bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200">{p.displayOrder}</span>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                        p.isAvailable 
                          ? 'bg-semantic-success/10 text-semantic-success border border-semantic-success/20' 
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}>
                        {p.isAvailable ? 'Available' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setModalState({ isOpen: true, data: p })}
                          className="p-2 rounded-xl text-neutral-400 hover:text-brand-black hover:bg-neutral-100 transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: p.id })}
                          className="p-2 rounded-xl text-neutral-400 hover:text-semantic-danger hover:bg-semantic-danger/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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
          <div className="p-5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/30">
            <span className="text-sm text-neutral-500 font-bold">
              Showing {(pageIndex - 1) * pageSize + 1} to {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                disabled={pageIndex === 1}
                className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 transition-colors shadow-sm text-brand-black"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <span className="text-sm font-black px-4 text-brand-black">
                {pageIndex} / {totalPages}
              </span>
              <button
                onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                disabled={pageIndex === totalPages}
                className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 transition-colors shadow-sm text-brand-black"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, data: null })}
        onSuccess={fetchProducts}
        initialData={modalState.data}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};
