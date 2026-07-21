
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RecipeCard from '../../components/recipe/RecipeCard';
import { HiOutlineArrowLeft, HiOutlinePrinter } from 'react-icons/hi';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
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

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 500);
    }, 200);
  };

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
      <div className="flex flex-wrap justify-between items-center gap-4 no-print">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:shadow-sm"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back to Recipes
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all duration-200 hover:shadow-md"
        >
          <HiOutlinePrinter className="w-4 h-4" />
          Print Recipe
        </button>
      </div>

      <div className="print-content">
        <RecipeCard recipe={recipe} isPrint={isPrinting} />
      </div>
    </div>
  );
};

export default RecipeDetails;
