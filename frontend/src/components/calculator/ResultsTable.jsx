import React from 'react';
import { formatCurrency } from '../../utils/currency';

const ResultsTable = ({ ingredients, summary }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Ingredient
            </th>
            <th
              scope="col"
              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Original Qty
            </th>
            <th
              scope="col"
              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Scaled Qty
            </th>
            <th
              scope="col"
              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Unit
            </th>
            <th
              scope="col"
              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Yield Qty
            </th>
            <th
              scope="col"
              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Cost
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ingredients.map((ing, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{ing.ingredientId?.name || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{ing.originalQuantity}</td>
              <td className="px-4 py-3 text-sm font-semibold text-emerald-700">{ing.scaledQuantity.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{ing.unit}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{ing.yieldQuantity.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">{formatCurrency(ing.ingredientCost)}</td></tr>
          ))}
          <tr className="bg-gray-100 font-semibold">
            <td className="px-4 py-3 text-sm text-gray-800" colSpan={5}>TOTAL COST</td>
            <td className="px-4 py-3 text-sm text-gray-800">{formatCurrency(summary?.totalCost)}</td></tr>
          <tr className="bg-gray-200 font-semibold">
            <td className="px-4 py-3 text-sm text-gray-800" colSpan={5}>TOTAL BATCH WEIGHT</td>
            <td className="px-4 py-3 text-sm text-gray-800">{summary?.totalBatchWeight}</td></tr>
          </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
