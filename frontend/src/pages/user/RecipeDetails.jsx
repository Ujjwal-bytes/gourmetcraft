
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdminView = pathname.startsWith('/admin');
  const backPath = isAdminView ? '/admin/recipes' : '/user/recipes';




  const fetchRecipe = async () => {
    try {
      const res = await API.get(`/api/recipes/${id}`);
      setRecipe(res.data.data);
      document.title = `${res.data.data.name} — GourmetCraft`;
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading recipe..." />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-gray-800">Recipe not found</h2>
        <button
          onClick={() => navigate(backPath)}
          className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Back to recipes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(backPath)}
        className="text-gray-500 hover:text-gray-700"
      >
        ← Back to recipes
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
          {recipe.recipeGroup && (
            <span className="inline-block px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg">
              {recipe.recipeGroup}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase">Menu</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{recipe.menuId?.name || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase">Sub Menu</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{recipe.subMenuId?.name || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase">Portions</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{recipe.portions}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase">Batch Weight</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{recipe.batchWeight || '—'}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingredient Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waste %</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Yield Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nutrition Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recipe.ingredients.map((ing, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{ing.ingredientId?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ing.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ing.unit}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">${ing.unitPrice?.toFixed(2) || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ing.wastePercent ?? 0}%</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ing.yieldQuantity?.toFixed(2) || '—'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">${ing.ingredientCost?.toFixed(2) || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{ing.nutritionValue || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Method of Preparation</h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {recipe.methodOfPreparation}
          </div>
        </div>

        {recipe.specialInstructions && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Instructions</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800">
              {recipe.specialInstructions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
