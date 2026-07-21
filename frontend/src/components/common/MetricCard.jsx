const MetricCard = ({
  icon,
  label,
  value,
  color = 'emerald',
  delay = '',
  trend,
  trendUp = true
}) => {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      valueText: 'text-emerald-700',
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      valueText: 'text-blue-700',
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      valueText: 'text-amber-700',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      valueText: 'text-purple-700',
    },
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <div
      className={`animate-fade-in ${delay} bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`${style.iconBg} ${style.iconText} p-3 rounded-xl`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className={`text-2xl font-bold ${style.valueText} mt-0.5`}>
              {value !== undefined && value !== null ? value : '—'}
            </p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
