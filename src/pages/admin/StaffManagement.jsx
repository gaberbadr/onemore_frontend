import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { CreateStaffModal } from '../../components/admin/CreateStaffModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { Plus, Trash2, Shield, User, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ isOpen: false, userId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getStaff(pageIndex, pageSize);
      const paginationObj = response.data?.data || response.data;
      setStaffList(Array.isArray(paginationObj?.data) ? paginationObj.data : Array.isArray(paginationObj) ? paginationObj : []);
      setTotalCount(paginationObj?.count || 0);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [pageIndex]);

  const handleDeleteConfirm = async () => {
    if (!deleteData.userId) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteUser(deleteData.userId);
      setDeleteData({ isOpen: false, userId: null });
      fetchStaff();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-black flex items-center gap-3">
            <Shield className="text-primary" size={32} />
            Staff Management
          </h1>
          <p className="text-neutral-500 mt-2">Manage staff accounts and permissions</p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Add Staff
        </button>
      </div>

      <div className="bg-brand-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100 text-sm text-neutral-500 font-medium">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Phone</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-neutral-500">
                    No staff members found.
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-brand-black">
                            {staff.fullName || staff.email.split('@')[0]}
                          </div>
                          <div className="text-sm text-neutral-500">{staff.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-500">
                      {staff.phoneNumber || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        staff.isActive 
                          ? 'bg-semantic-success/10 text-semantic-success' 
                          : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${staff.isActive ? 'bg-semantic-success' : 'bg-neutral-400'}`}></span>
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-500 text-sm">
                      {new Date(staff.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setDeleteData({ isOpen: true, userId: staff.id })}
                        className="p-2 text-neutral-400 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              Showing {(pageIndex - 1) * pageSize + 1} to {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                disabled={pageIndex === 1}
                className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-50 text-brand-black transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium px-2">
                Page {pageIndex} of {totalPages}
              </span>
              <button
                onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                disabled={pageIndex === totalPages}
                className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-50 text-brand-black transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateStaffModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchStaff} 
      />

      <ConfirmDeleteModal
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ isOpen: false, userId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Staff Member"
        message="Are you sure you want to remove this staff account? They will lose access to the platform immediately."
        isDeleting={isDeleting}
      />
    </div>
  );
};
