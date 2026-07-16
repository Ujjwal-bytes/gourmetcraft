import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const SubMenuManagement = () => {
  const [subMenus, setSubMenus] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubMenu, setEditingSubMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [form, setForm] = useState({ name: '', menuId: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Sub Menu Management — GourmetCraft Admin';
  }, []);

  const fetchData = async () => {
    try {
      const [subMenuRes, menuRes] = await Promise.all([
        API.get(`/api/submenus?page=${page}&limit=10&search=${searchQuery}`),
        API.get('/api/menus'),
      ]);
      setSubMenus(subMenuRes.data.data);
      if (subMenuRes.data.total) setTotalPages(Math.ceil(subMenuRes.data.total / 10));
      setMenus(menuRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const openCreateModal = () => {
    setForm({ name: '', menuId: '', description: '' });
    setEditingSubMenu(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (subMenu) => {
    setForm({
      name: subMenu.name,
      menuId: subMenu.menuId?._id || '',
      description: subMenu.description || '',
    });
    setEditingSubMenu(subMenu);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.menuId) {
      setError('Sub-menu name and menu are required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editingSubMenu) {
        await API.put(`/api/submenus/${editingSubMenu._id}`, form);
        toast.success('Sub-menu updated successfully');
      } else {
        await API.post('/api/submenus', form);
        toast.success('Sub-menu created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/submenus/${id}`);
      toast.success('Sub-menu deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete sub-menu');
    }
  };

  const columns = [
    { header: 'Sub Menu Name', render: (row) => (
      <span className="font-medium text-gray-900">{row.name}</span>
    )},
    { header: 'Menu', render: (row) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700">
        {row.menuId?.name || '—'}
      </span>
    )},
    { header: 'Description', render: (row) => (
      <span className="text-gray-500">{row.description || '—'}</span>
    )},
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading sub-menus..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Sub Menu Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{subMenus.length} sub-menus total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <HiPlus className="w-4 h-4" />
          Add Sub Menu
        </button>
      </div>

      <DataTable
        columns={columns}
        data={subMenus}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search sub-menus..."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        actions={(row) => (
          <>
            <button
              onClick={() => openEditModal(row)}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <HiPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirm({ isOpen: true, id: row._id })}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubMenu ? 'Edit Sub Menu' : 'Create Sub Menu'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Sub Menu Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter sub-menu name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Menu <span className="text-red-500">*</span>
            </label>
            <select
              value={form.menuId}
              onChange={(e) => setForm({ ...form, menuId: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="">Select a menu</option>
              {menus.map((menu) => (
                <option key={menu._id} value={menu._id}>{menu.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
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
              {saving ? 'Saving...' : editingSubMenu ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="Delete Sub Menu"
        message="Are you sure you want to delete this sub-menu? This action cannot be undone."
      />
    </div>
  );
};

export default SubMenuManagement;
