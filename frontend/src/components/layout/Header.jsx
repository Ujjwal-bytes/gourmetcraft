import { HiMenuAlt2 } from 'react-icons/hi';
import { FaUtensils } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onToggleSidebar, pageTitle }) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const panelLabel = user?.role === 'admin' ? 'ADMIN PANEL' : 'USER PANEL';
  const routeTitles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/menus': 'Menu Management',
    '/admin/submenus': 'Sub Menu Management',
    '/admin/ingredients': 'Ingredient Master',
    '/admin/recipes': 'Recipe Management',
    '/admin/recipes/create': 'Create Recipe',
    '/user/dashboard': 'Dashboard',
    '/user/recipes': 'Recipe List',
    '/user/calculator': 'Quantity Calculator',
  };
  const resolvedTitle =
    pageTitle ||
    routeTitles[pathname] ||
    (pathname.startsWith('/admin/recipes/edit/') ? 'Edit Recipe' : null) ||
    (pathname.startsWith('/admin/recipes/') ? 'Recipe Details' : null) ||
    (pathname.startsWith('/user/recipes/') ? 'Recipe Details' : null) ||
    'Dashboard';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 no-print">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <HiMenuAlt2 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              {panelLabel}
            </span>
            <span className="sm:hidden inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-700">
              {user?.role === 'admin' ? 'ADMIN' : 'USER'}
            </span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {resolvedTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <FaUtensils className="w-5 h-5 text-emerald-500" />
            <span className="font-medium text-emerald-600">GourmetCraft</span>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
