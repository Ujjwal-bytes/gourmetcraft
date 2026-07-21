import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Menu Management — GourmetCraft Admin';
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await API.get(`/api/menus?page=${page}&limit=10&search=${searchQuery}`);
      setMenus(res.data.data);
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / 10));
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [page, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const openCreateModal = () => {
    setForm({ name: '' });
    setEditingMenu(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (menu) => {
    setForm({ name: menu.name });
    setEditingMenu(menu);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Menu name is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editingMenu) {
        await API.put(`/api/menus/${editingMenu._id}`, form);
        toast.success('Menu updated successfully');
      } else {
        await API.post('/api/menus', form);
        toast.success('Menu created successfully');
      }
      setIsModalOpen(false);
      fetchMenus();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/menus/${id}`);
      toast.success('Menu deleted successfully');
      fetchMenus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete menu');
    }
  };

  const columns = [
    { header: 'Menu Name', accessor: 'name', render: (row) => (
      <span className="font-medium text-gray-900">{row.name}</span>
    )},
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading menus..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Menu Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{menus.length} menus total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <HiPlus className="w-4 h-4" />
          Add Menu
        </button>
      </div>

      <DataTable
        columns={columns}
        data={menus}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search menus..."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        emptyTitle="No menus found"
        emptyDescription="Get started by creating your first menu!"
        actions={(row) => (
          <>
            <button
              onClick={() => openEditModal(row)}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Edit"
            >
              <HiPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirm({ isOpen: true, id: row._id })}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </>
        )}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMenu ? 'Edit Menu' : 'Create Menu'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Menu Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter menu name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingMenu ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="Delete Menu"
        message="Are you sure you want to delete this menu? This action cannot be undone."
      />
    </div>
  );
};

export default MenuManagement;
