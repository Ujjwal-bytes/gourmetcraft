
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { HiTrash, HiPlus } from 'react-icons/hi';

const CreateRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menus, setMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    recipeGroup: '',
    menuId: '',
    subMenuId: '',
    portions: '',
    batchWeight: '',
    ingredients: [],
    methodOfPreparation: '',
    specialInstructions: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, subMenuRes, ingredientRes] = await Promise.all([
        API.get('/api/menus'),
        API.get('/api/submenus'),
        API.get('/api/ingredients'),
      ]);

      setMenus(menuRes.data.data);
      setSubMenus(subMenuRes.data.data);
      setIngredients(ingredientRes.data.data);

      if (isEdit) {
        const recipeRes = await API.get(`/api/recipes/${id}`);
        const recipe = recipeRes.data.data;
        setForm({
          name: recipe.name,
          recipeGroup: recipe.recipeGroup || '',
          menuId: recipe.menuId?._id || '',
          subMenuId: recipe.subMenuId?._id || '',
          portions: recipe.portions.toString(),
          batchWeight: recipe.batchWeight || '',
          ingredients: recipe.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId?._id || ing.ingredientId,
            quantity: ing.quantity.toString(),
            unit: ing.unit,
            unitPrice: ing.unitPrice,
            wastePercent: ing.wastePercent,
            nutritionValue: ing.nutritionValue,
          })),
          methodOfPreparation: recipe.methodOfPreparation,
          specialInstructions: recipe.specialInstructions || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateIngredient = (ing) => {
    const ingredientData = ingredients.find((i) => i._id === ing.ingredientId);
    const quantity = parseFloat(ing.quantity) || 0;
    const unitPrice = ingredientData?.unitPrice || 0;
    const wastePercent = ingredientData?.wastePercent || 0;

    return {
      ...ing,
      unitPrice: unitPrice,
      wastePercent: wastePercent,
      nutritionValue: ingredientData?.nutritionValue || '',
      yieldQuantity: quantity * (1 - wastePercent / 100),
      ingredientCost: quantity * unitPrice,
    };
  };

  const addIngredient = () => {
    setForm({
      ...form,
      ingredients: [
        ...form.ingredients,
        {
          ingredientId: '',
          quantity: '',
          unit: '',
        },
      ],
    });
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...form.ingredients];
    const updatedIng = { ...updatedIngredients[index], [field]: value };
    if (field === 'ingredientId' && value) {
      const ingData = ingredients.find((i) => i._id === value);
      if (ingData) {
        updatedIng.unit = ingData.quantityUnit;
      }
    }
    const calculated = calculateIngredient({ ...updatedIng, [field]: value });
    updatedIngredients[index] = calculated;
    setForm({ ...form, ingredients: updatedIngredients });
  };

  const removeIngredient = (index) => {
    setForm({
      ...form,
      ingredients: form.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.menuId || !form.portions || !form.methodOfPreparation) {
      setError('Please fill all required fields');
      return;
    }

    if (form.ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    const ingredientsPayload = form.ingredients.map((ing) => {
      const calculated = calculateIngredient(ing);
      return {
        ingredientId: calculated.ingredientId,
        quantity: parseFloat(calculated.quantity),
        unit: calculated.unit,
        unitPrice: calculated.unitPrice,
        wastePercent: calculated.wastePercent,
        yieldQuantity: parseFloat(calculated.yieldQuantity),
        ingredientCost: parseFloat(calculated.ingredientCost),
        nutritionValue: calculated.nutritionValue,
      };
    });

    const payload = {
      ...form,
      portions: parseInt(form.portions),
      ingredients: ingredientsPayload,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await API.put(`/api/recipes/${id}`, payload);
      } else {
        await API.post('/api/recipes', payload);
      }
      navigate('/admin/recipes');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  const filteredSubMenus = subMenus.filter((sm) => sm.menuId?._id === form.menuId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/recipes')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {isEdit ? 'Edit Recipe' : 'Create Recipe'}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recipe Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Recipe Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter recipe name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Recipe Group
              </label>
              <input
                type="text"
                value={form.recipeGroup}
                onChange={(e) => setForm({ ...form, recipeGroup: e.target.value })}
                placeholder="e.g., Breakfast Specials"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Menu <span className="text-red-500">*</span>
              </label>
              <select
                value={form.menuId}
                onChange={(e) => setForm({ ...form, menuId: e.target.value, subMenuId: '' })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">Select a menu</option>
                {menus.map((menu) => (
                  <option key={menu._id} value={menu._id}>{menu.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sub Menu
              </label>
              <select
                value={form.subMenuId}
                onChange={(e) => setForm({ ...form, subMenuId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">Select a sub menu</option>
                {filteredSubMenus.map((sm) => (
                  <option key={sm._id} value={sm._id}>{sm.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Number of Portions <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.portions}
                onChange={(e) => setForm({ ...form, portions: e.target.value })}
                placeholder="4"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Batch Weight
              </label>
              <input
                type="text"
                value={form.batchWeight}
                onChange={(e) => setForm({ ...form, batchWeight: e.target.value })}
                placeholder="e.g., 500g"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Ingredients</h3>
            <button
              type="button"
              onClick={addIngredient}
              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-all"
            >
              <HiPlus className="w-4 h-4" />
              Add Ingredient
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingredient Name</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waste %</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Yield Quantity</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingredient Cost</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nutrition Value</th>
                  <th className="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {form.ingredients.map((ing, index) => {
                  const calculated = calculateIngredient(ing);
                  return (
                    <tr key={index}>
                      <td className="px-4 py-3.5">
                        <select
                          value={ing.ingredientId}
                          onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="">Select an ingredient</option>
                          {ingredients.map((i) => (
                            <option key={i._id} value={i._id}>{i.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          type="number"
                          step="0.01"
                          value={ing.quantity}
                          onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          type="text"
                          value={ing.unit}
                          onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                          placeholder="unit"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">${calculated.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{calculated.wastePercent}%</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{calculated.yieldQuantity.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">${calculated.ingredientCost.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500 text-xs">{calculated.nutritionValue || '—'}</td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Method of Preparation <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={8}
              value={form.methodOfPreparation}
              onChange={(e) => setForm({ ...form, methodOfPreparation: e.target.value })}
              placeholder="Enter preparation steps"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Special Instructions
            </label>
            <textarea
              rows={4}
              value={form.specialInstructions}
              onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
              placeholder="Any special instructions"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/recipes')}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all disabled:opacity-60"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Recipe' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;

