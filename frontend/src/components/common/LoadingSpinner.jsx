const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-sm text-gray-500 font-medium">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
