import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
  ></div>
);

export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${className}`}>
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ columns = 5, rows = 5 }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-100">
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="p-4">
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className={`h-4 flex-1 ${colIdx === columns - 1 ? 'w-32' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
