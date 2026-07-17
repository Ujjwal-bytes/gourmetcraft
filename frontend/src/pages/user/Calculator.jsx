
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const QuantityCalculator = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [requiredQuantity, setRequiredQuantity] = useState('');
  const [calculated, setCalculated] = useState(null);

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
    document.title = 'Quantity Calculator — GourmetCraft';
    fetchRecipes();
  }, []);


  const handleCalculate = async () => {
    if (!selectedRecipe || !requiredQuantity) {
      toast.error('Please select a recipe and enter required quantity');
      return;
    }

    try {
      const selected = recipes.find((item) => item._id === selectedRecipe);
      const res = await API.post('/api/recipes/calculate', {
        recipeId: selectedRecipe,
        requiredQuantity: parseInt(requiredQuantity),
        standardQuantity: selected?.portions,
      });

      setCalculated(res.data.data);
      toast.success('Calculation completed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Calculation failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  const selectedRecipeData = recipes.find((item) => item._id === selectedRecipe);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800">Quantity Calculator</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Recipe <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Choose a recipe</option>
              {recipes.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Required Portions <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                min="1"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleCalculate}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all"
              >
                Calculate
              </button>
            </div>
          </div> */}



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Required Portions <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min="1"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="w-full px-4 py-3 sm:py-2.5 border border-gray-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleCalculate}
                className="w-full sm:w-auto min-w-[120px] px-6 py-3 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all active:scale-95"
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {selectedRecipeData && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">Recipe</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{selectedRecipeData.name}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">Menu</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{selectedRecipeData.menuId?.name || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">Sub Menu</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{selectedRecipeData.subMenuId?.name || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">Standard Portions</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{selectedRecipeData.portions}</p>
            </div>
          </div>
        )}

        {calculated && (
          <div>
            <div className="flex items-center gap-4 mb-6 p-4 bg-emerald-50 rounded-xl">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{calculated.recipe.name}</h3>
                <p className="text-sm text-gray-600">
                  Original: {calculated.recipe.originalPortions} portions → Required: {calculated.recipe.requiredQuantity} portions
                </p>
              </div>
              <div className="ml-auto">
                <span className="text-sm font-semibold text-emerald-700">Scale factor: {calculated.recipe.scaleFactor.toFixed(2)}x</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingredient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Original Qty</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Scaled Qty</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Yield Qty</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {calculated.scaledIngredients.map((ing, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{ing.ingredientId?.name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ing.originalQuantity}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-emerald-700">{ing.scaledQuantity.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ing.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ing.yieldQuantity.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-700">${ing.ingredientCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantityCalculator;
