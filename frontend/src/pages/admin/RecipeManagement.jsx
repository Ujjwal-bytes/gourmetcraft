
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { HiEye, HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Recipe Management — GourmetCraft Admin';
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await API.get(`/api/recipes?page=${page}&limit=10&search=${searchQuery}`);
      setRecipes(res.data.data);
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / 10));
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/recipes/${id}`);
      toast.success('Recipe deleted successfully');
      fetchRecipes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete recipe');
    }
  };

  const columns = [
    { header: 'Recipe Name', render: (row) => <span className="font-medium text-gray-900">{row.name}</span> },
    { header: 'Recipe Group', render: (row) => <span className="text-gray-500">{row.recipeGroup || '—'}</span> },
    { header: 'Menu', render: (row) => <span className="text-emerald-700">{row.menuId?.name || '—'}</span> },
    { header: 'Sub Menu', render: (row) => <span className="text-gray-600">{row.subMenuId?.name || '—'}</span> },
    { header: 'Portions', render: (row) => <span className="text-gray-700">{row.portions}</span> },
    { header: 'Batch Weight', render: (row) => <span className="text-gray-600">{row.batchWeight || '—'}</span> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading recipes..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Recipe Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{recipes.length} recipes total</p>
        </div>
        <button
          onClick={() => navigate('/admin/recipes/create')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <HiPlus className="w-4 h-4" />
          Create Recipe
        </button>
      </div>

      <DataTable
        columns={columns}
        data={recipes}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search recipes..."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        actions={(row) => (
          <>
            <button
              onClick={() => navigate(`/admin/recipes/${row._id}`)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View"
            >
              <HiEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/admin/recipes/edit/${row._id}`)}
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

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
      />
    </div>
  );
};

export default RecipeManagement;
