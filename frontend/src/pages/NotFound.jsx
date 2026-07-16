import { useNavigate } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center animate-fade-in">
        <h1 className="text-9xl font-extrabold text-emerald-500 drop-shadow-sm">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-3 mb-8 max-w-md mx-auto">
          We looked everywhere, but the page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <HiHome className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
