import React from 'react'
import { formatCurrency } from '../../utils/currency'
import { getCategoryDisplay } from '../../utils/recipeHelpers'

const RecipeCard = ({ recipe, isPrint = false }) => {
  if (!recipe) return null

  return (
    <div className={`bg-white ${isPrint ? 'w-full max-w-full' : 'rounded-lg shadow-md overflow-hidden'}`}>
      <div className={isPrint ? 'p-[8mm]' : 'p-6'}>
        {/* Brand Header for Print */}
        <div className={`text-center ${isPrint ? 'mb-1 pb-1' : 'mb-6 pb-4'} border-b-2 border-gray-800`}>
          <h1 className={`${isPrint ? 'text-xl' : 'text-3xl'} font-extrabold text-gray-900 tracking-tight`}>GOURMET CRAFT</h1>
          <p className={`${isPrint ? 'text-[6pt]' : 'text-sm'} font-semibold text-gray-600 uppercase tracking-widest mt-1`}>Recipe Card</p>
        </div>

        {/* Recipe Metadata */}
        <div className={`text-center ${isPrint ? 'mb-1 pb-1' : 'mb-6 pb-4'} border-b border-gray-200`}>
          <h2 className={`${isPrint ? 'text-base' : 'text-2xl'} font-bold text-gray-800`}>{recipe.name}</h2>
          {getCategoryDisplay(recipe) && (
            <p className={`${isPrint ? 'text-[6pt]' : 'text-sm'} text-gray-600 mt-1`}>
              {getCategoryDisplay(recipe)}
            </p>
          )}
          {recipe.recipeGroup && (
            <p className={`${isPrint ? 'text-[6pt]' : 'text-sm'} text-gray-500 mt-1`}>{recipe.recipeGroup}</p>
          )}
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-4 ${isPrint ? 'gap-1 mb-2' : 'gap-4 mb-6'}`}>
        <div className={`${isPrint ? 'bg-gray-50 p-1' : 'bg-gray-50 rounded-xl p-4'} text-center`}>
          <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
            No of Portions
          </p>
          <p className={`${isPrint ? 'text-[10pt]' : 'text-2xl'} font-bold text-gray-800 mt-1`}>{recipe.portions}</p>
        </div>
        {recipe.batchWeight && (
          <div className={`${isPrint ? 'bg-gray-50 p-1' : 'bg-gray-50 rounded-xl p-4'} text-center`}>
            <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
              Total Batch Weight
            </p>
            <p className={`${isPrint ? 'text-[10pt]' : 'text-2xl'} font-bold text-gray-800 mt-1`}>{recipe.batchWeight}</p>
          </div>
        )}
        {recipe.weightPerPortion && (
          <div className={`${isPrint ? 'bg-gray-50 p-1' : 'bg-gray-50 rounded-xl p-4'} text-center`}>
            <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
              Weight/Portion
            </p>
            <p className={`${isPrint ? 'text-[10pt]' : 'text-2xl'} font-bold text-gray-800 mt-1`}>{recipe.weightPerPortion}</p>
          </div>
        )}
        {recipe.totalNutritionValue && (
          <div className={`${isPrint ? 'bg-gray-50 p-1' : 'bg-gray-50 rounded-xl p-4'} text-center`}>
            <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
              Total Nutrition Value
            </p>
            <p className={`${isPrint ? 'text-[10pt]' : 'text-2xl'} font-bold text-gray-800 mt-1`}>{recipe.totalNutritionValue}</p>
          </div>
        )}
        {recipe.nutritionValuePerBatch && (
          <div className={`${isPrint ? 'bg-gray-50 p-1' : 'bg-gray-50 rounded-xl p-4'} text-center`}>
            <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
              Nutrition Value/Portion
            </p>
            <p className={`${isPrint ? 'text-[10pt]' : 'text-2xl'} font-bold text-gray-800 mt-1`}>{recipe.nutritionValuePerBatch}</p>
          </div>
        )}
      </div>

      <div className={isPrint ? 'mb-2' : 'mb-6'}>
        <h3 className={`${isPrint ? 'text-[8pt] mb-1 border-l-2 pl-1' : 'text-lg font-semibold text-gray-800 mb-3 border-l-4 border-amber-500 pl-3'} text-gray-800`}>
          Ingredients
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className={`${isPrint ? 'px-1 py-1 text-[5pt]' : 'px-4 py-3 text-xs'} font-semibold text-gray-500 uppercase tracking-wider text-left`}
              >
                Ingredient
              </th>
              <th
                scope="col"
                className={`${isPrint ? 'px-1 py-1 text-[5pt]' : 'px-4 py-3 text-xs'} font-semibold text-gray-500 uppercase tracking-wider text-left`}
              >
                Qty
              </th>
              <th
                scope="col"
                className={`${isPrint ? 'px-1 py-1 text-[5pt]' : 'px-4 py-3 text-xs'} font-semibold text-gray-500 uppercase tracking-wider text-left`}
              >
                Unit
              </th>
              <th
                scope="col"
                className={`${isPrint ? 'px-1 py-1 text-[5pt]' : 'px-4 py-3 text-xs'} font-semibold text-gray-500 uppercase tracking-wider text-left`}
              >
                Waste %
              </th>
              <th
                scope="col"
                className={`${isPrint ? 'px-1 py-1 text-[5pt]' : 'px-4 py-3 text-xs'} font-semibold text-gray-500 uppercase tracking-wider text-left`}
              >
                Yield Qty
              </th>
              <th
                scope="col"
                className={`${isPrint ? 'px-1 py-1 text-[5pt]' : 'px-4 py-3 text-xs'} font-semibold text-gray-500 uppercase tracking-wider text-left`}
              >
                Cost
              </th>
              <th
                scope="col"
                className={`${isPrint ? 'px-1 py-1 text-[5pt]' : 'px-4 py-3 text-xs'} font-semibold text-gray-500 uppercase tracking-wider text-left`}
              >
                Nutrition Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
              <tr key={idx} className={isPrint ? '' : 'hover:bg-gray-50'}>
                <td className={`${isPrint ? 'px-1 py-1 text-[6pt]' : 'px-4 py-3 text-sm'} text-gray-800`}>
                  {ing.ingredientId?.name || 'Unknown'}
                </td>
                <td className={`${isPrint ? 'px-1 py-1 text-[6pt]' : 'px-4 py-3 text-sm'} text-gray-600`}>
                  {ing.quantity}
                </td>
                <td className={`${isPrint ? 'px-1 py-1 text-[6pt]' : 'px-4 py-3 text-sm'} text-gray-600`}>
                  {ing.unit}
                </td>
                <td className={`${isPrint ? 'px-1 py-1 text-[6pt]' : 'px-4 py-3 text-sm'} text-gray-600`}>
                  {ing.wastePercent}%
                </td>
                <td className={`${isPrint ? 'px-1 py-1 text-[6pt]' : 'px-4 py-3 text-sm'} text-gray-600`}>
                  {ing.yieldQuantity}
                </td>
                <td className={`${isPrint ? 'px-1 py-1 text-[6pt]' : 'px-4 py-3 text-sm'} text-gray-600`}>
                  {formatCurrency(ing.ingredientCost)}
                </td>
                <td className={`${isPrint ? 'px-1 py-1 text-[6pt]' : 'px-4 py-3 text-sm'} text-gray-600`}>
                  {ing.nutritionValue || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className={`${isPrint ? 'bg-gray-50 p-2 mb-2' : 'bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6'}`}>
        <h3 className={`${isPrint ? 'text-[8pt] mb-1' : 'text-lg font-semibold text-gray-800 mb-4'} text-gray-800`}>
          Costing & Financial Summary
        </h3>
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 ${isPrint ? 'gap-1' : 'gap-4'}`}>
          <div>
            <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
              Total Ingredient Cost
            </p>
            <p className={`${isPrint ? 'text-[8pt]' : 'text-lg'} font-bold text-gray-800 mt-1`}>
              {formatCurrency(recipe.ingredientCostTotal)}
            </p>
          </div>
          <div>
            <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
              Total Recipe Cost
            </p>
            <p className={`${isPrint ? 'text-[8pt]' : 'text-lg'} font-bold text-gray-800 mt-1`}>
              {formatCurrency(recipe.totalRecipeCost)}
            </p>
          </div>
          <div>
            <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
              Cost Per Portion
            </p>
            <p className={`${isPrint ? 'text-[8pt]' : 'text-lg'} font-bold text-gray-800 mt-1`}>
              {formatCurrency(recipe.costPerPortion)}
            </p>
          </div>
          {recipe.salesPricePerPortion > 0 && (
            <div>
              <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
                Sales Price Per Portion
              </p>
              <p className={`${isPrint ? 'text-[8pt]' : 'text-lg'} font-bold text-green-700 mt-1`}>
                {formatCurrency(recipe.salesPricePerPortion)}
              </p>
            </div>
          )}
          <div>
            <p className={`${isPrint ? 'text-[5pt]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider`}>
              Food Cost %
            </p>
            <p className={`${isPrint ? 'text-[8pt]' : 'text-lg'} font-bold text-blue-700 mt-1`}>
              {recipe.calculatedFoodCostPercent || recipe.potentialFoodCost || 0}%
            </p>
          </div>
        </div>
      </div>

      <div className={`${isPrint ? 'border-t border-gray-200 pt-2' : 'border-t border-gray-200 pt-6'}`}>
        <div className={`grid grid-cols-2 ${isPrint ? 'gap-1' : 'gap-4'}`}>
          <div>
            <h3 className={`${isPrint ? 'text-[8pt] mb-1 border-l-2 pl-1' : 'text-lg font-semibold text-gray-800 mb-3 border-l-4 border-green-500 pl-3'} text-gray-800`}>
              Method of Preparation
            </h3>
            <p className={`${isPrint ? 'text-[7pt]' : 'text-sm'} text-gray-600`}>{recipe.methodOfPreparation}</p>
          </div>
          {recipe.specialInstructions && (
            <div>
              <h3 className={`${isPrint ? 'text-[8pt] mb-1 border-l-2 pl-1' : 'text-lg font-semibold text-gray-800 mb-3 border-l-4 border-purple-500 pl-3'} text-gray-800`}>
                Special Instructions
              </h3>
              <p className={`${isPrint ? 'text-[7pt]' : 'text-sm'} text-gray-600`}>{recipe.specialInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer for Print */}
      <div className={`${isPrint ? 'mt-2 pt-2' : 'mt-8 pt-6'} border-t-2 border-gray-800`}>
        <div className={`flex flex-col md:flex-row md:justify-between ${isPrint ? 'text-[5pt] mb-0' : 'text-sm text-gray-600 mb-2'}`}>
          <div>
            <span className="font-semibold">Generated:</span> {new Date().toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">GourmetCraft Recipe Management System</span>
          </div>
        </div>
        <div className={`flex flex-col md:flex-row md:justify-between ${isPrint ? 'text-[5pt] mb-0' : 'text-sm text-gray-500'}`}>
          <div>
            <span className="font-semibold">Created by:</span> {recipe.createdBy?.name || 'Unknown'}
          </div>
          {recipe.updatedBy && (
            <div>
              <span className="font-semibold">Last updated by:</span> {recipe.updatedBy?.name || 'Unknown'}
            </div>
          )}
        </div>
        <div className={`flex flex-col md:flex-row md:justify-between ${isPrint ? 'text-[5pt]' : 'text-sm text-gray-500'}`}>
          <div>
            <span className="font-semibold">Created on:</span> {new Date(recipe.createdAt).toLocaleString()}
          </div>
          {recipe.updatedAt && (
            <div>
              <span className="font-semibold">Last updated on:</span> {new Date(recipe.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default RecipeCard
