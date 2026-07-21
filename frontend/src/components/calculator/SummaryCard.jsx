import React from 'react';
import { HiOutlineScale, HiOutlineCurrencyDollar, HiOutlineClipboard, HiOutlineDocumentText, HiOutlineChartBar } from 'react-icons/hi';

const iconMap = {
  scale: HiOutlineScale,
  dollar: HiOutlineCurrencyDollar,
  receipt: HiOutlineDocumentText,
  clipboard: HiOutlineClipboard,
  chart: HiOutlineChartBar,
};

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-700',
};

const SummaryCard = ({ title, value, icon, color, subtitle }) => {
  const Icon = iconMap[icon] || HiOutlineScale;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
