
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const res = await API.get('/api/recipes');
      setRecipes(res.data.data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Recipes — GourmetCraft';
    fetchRecipes();
  }, []);


  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const res = await API.get(`/api/recipes/search?q=${query}`);
      setRecipes(res.data.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h2 className="text-xl font-bold text-gray-800">Recipes</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{recipe.name}</h3>
              {recipe.recipeGroup && (
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg mb-3">
                  {recipe.recipeGroup}
                </span>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <span>{recipe.menuId?.name || '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{recipe.subMenuId?.name || '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{recipe.portions} portions</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/user/recipes/${recipe._id}`)}
                className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-all"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecipes;
