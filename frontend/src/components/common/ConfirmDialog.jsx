import { HiExclamation } from 'react-icons/hi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 bg-white rounded-2xl shadow-xl max-w-sm w-full animate-scale-in p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 text-red-600 p-2.5 rounded-xl">
            <HiExclamation className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {title || 'Confirm Delete'}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
