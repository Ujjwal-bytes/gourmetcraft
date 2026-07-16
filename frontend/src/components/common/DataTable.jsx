import { HiSearch } from 'react-icons/hi';

const DataTable = ({ columns, data, searchValue, onSearchChange, searchPlaceholder, actions, ...props }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      {onSearchChange && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || 'Search...'}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <HiSearch className="w-10 h-10 mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">No records found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row._id || rowIdx}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {props.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {props.currentPage} of {props.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={props.currentPage <= 1}
              onClick={() => props.onPageChange(props.currentPage - 1)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={props.currentPage >= props.totalPages}
              onClick={() => props.onPageChange(props.currentPage + 1)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
