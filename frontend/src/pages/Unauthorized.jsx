import { useNavigate } from 'react-router-dom';
import { HiShieldExclamation, HiArrowLeft } from 'react-icons/hi';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center animate-fade-in max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <HiShieldExclamation className="w-16 h-16 text-red-500" />
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-3 mb-8">
          You do not have the required permissions to view this page. If you believe this is an error, please contact support.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <HiArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
