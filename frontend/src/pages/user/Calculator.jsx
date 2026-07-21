
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Skeleton from '../../components/common/Skeleton';
import SummaryCard from '../../components/calculator/SummaryCard';
import ResultsTable from '../../components/calculator/ResultsTable';
import { formatCurrency } from '../../utils/currency';

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

  const selectedRecipeData = recipes.find((item) => item._id === selectedRecipe);

  // Determine food cost color based on percentage
  const getFoodCostColor = (percentage) => {
    if (percentage <= 30) return 'green';
    if (percentage <= 40) return 'amber';
    return 'red';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800">Quantity Calculator</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Skeleton className="h-12 flex-1 rounded-xl" />
                  <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
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
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{calculated.recipe.name}</h3>
                    <p className="text-sm text-gray-600">
                      Original: {calculated.recipe.originalPortions} portions → Required: {calculated.recipe.requiredQuantity} portions
                    </p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <SummaryCard
                    title="Scale Factor"
                    value={`${calculated.recipe.scaleFactor.toFixed(2)}x`}
                    icon="scale"
                    color="emerald"
                  />
                  <SummaryCard
                    title="Total Cost"
                    value={formatCurrency(calculated.summary?.totalCost)}
                    icon="dollar"
                    color="blue"
                  />
                  <SummaryCard
                    title="Cost / Portion"
                    value={formatCurrency(calculated.summary?.costPerPortion)}
                    icon="receipt"
                    color="purple"
                  />
                  <SummaryCard
                    title="Batch Weight"
                    value={calculated.summary?.totalBatchWeight}
                    icon="clipboard"
                    color="amber"
                  />
                  <SummaryCard
                    title="Food Cost %"
                    value={`${calculated.summary?.potentialFoodCost.toFixed(2)}%`}
                    icon="chart"
                    color={getFoodCostColor(calculated.summary?.potentialFoodCost)}
                    subtitle={`Sales price: ${formatCurrency(calculated.summary?.salesPricePerPortion)}`}
                  />
                </div>

                {/* Results Table */}
                <ResultsTable ingredients={calculated.scaledIngredients} summary={calculated.summary} />

                {/* Nutrition Info */}
                {calculated.summary?.totalNutrition && calculated.summary?.totalNutrition !== "N/A" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Nutritional Information</h4>
                    <p className="text-sm text-blue-800">{calculated.summary?.totalNutrition}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuantityCalculator;
