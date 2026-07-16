import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const IngredientMaster = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    quantityUnit: '',
    unitPrice: '',
    wastePercent: '',
    nutritionValue: '',
    status: 'Active',
  });

  useEffect(() => {
    document.title = 'Ingredient Master — GourmetCraft Admin';
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await API.get(`/api/ingredients?page=${page}&limit=10&search=${searchQuery}`);
      setIngredients(res.data.data);
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / 10));
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [page, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const openCreateModal = () => {
    setForm({ name: '', quantityUnit: '', unitPrice: '', wastePercent: '', nutritionValue: '', status: 'Active' });
    setEditingItem(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setForm({
      name: item.name,
      quantityUnit: item.quantityUnit,
      unitPrice: item.unitPrice.toString(),
      wastePercent: item.wastePercent.toString(),
      nutritionValue: item.nutritionValue || '',
      status: item.status,
    });
    setEditingItem(item);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quantityUnit.trim() || form.unitPrice === '') {
      setError('Name, unit, and price are required');
      return;
    }

    const payload = {
      ...form,
      unitPrice: parseFloat(form.unitPrice),
      wastePercent: parseFloat(form.wastePercent) || 0,
    };

    setSaving(true);
    setError('');
    try {
      if (editingItem) {
        await API.put(`/api/ingredients/${editingItem._id}`, payload);
        toast.success('Ingredient updated successfully');
      } else {
        await API.post('/api/ingredients', payload);
        toast.success('Ingredient created successfully');
      }
      setIsModalOpen(false);
      fetchIngredients();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/ingredients/${id}`);
      toast.success('Ingredient deleted successfully');
      fetchIngredients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete ingredient');
    }
  };

  const columns = [
    { header: 'Ingredient Name', render: (row) => (
      <span className="font-medium text-gray-900">{row.name}</span>
    )},
    { header: 'Quantity Unit', render: (row) => (
      <span className="text-gray-600">{row.quantityUnit}</span>
    )},
    { header: 'Unit Price', render: (row) => (
      <span className="font-medium text-gray-700">${row.unitPrice.toFixed(2)}</span>
    )},
    { header: 'Waste %', render: (row) => (
      <span className="text-gray-600">{row.wastePercent}%</span>
    )},
    { header: 'Nutrition Value', render: (row) => (
      <span className="text-gray-500 text-xs">{row.nutritionValue || '—'}</span>
    )},
    { header: 'Status', render: (row) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${
        row.status === 'Active'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-gray-100 text-gray-500'
      }`}>
        {row.status}
      </span>
    )},
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading ingredients..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Ingredient Master</h2>
          <p className="text-sm text-gray-500 mt-0.5">{ingredients.length} ingredients total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <HiPlus className="w-4 h-4" />
          Add Ingredient
        </button>
      </div>

      <DataTable
        columns={columns}
        data={ingredients}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search ingredients..."
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
        title={editingItem ? 'Edit Ingredient' : 'Create Ingredient'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ingredient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Flour"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantity Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.quantityUnit}
                onChange={(e) => setForm({ ...form, quantityUnit: e.target.value })}
                placeholder="e.g., grams, ml, pieces"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Unit Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Waste %
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={form.wastePercent}
                onChange={(e) => setForm({ ...form, wastePercent: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nutrition Value
              </label>
              <input
                type="text"
                value={form.nutritionValue}
                onChange={(e) => setForm({ ...form, nutritionValue: e.target.value })}
                placeholder="e.g., 364 kcal/100g"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
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
              {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="Delete Ingredient"
        message="Are you sure you want to delete this ingredient? This action cannot be undone."
      />
    </div>
  );
};

export default IngredientMaster;
