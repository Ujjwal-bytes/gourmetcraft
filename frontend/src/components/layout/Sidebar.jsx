import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HiViewGrid,
  HiCollection,
  HiClipboardList,
  HiCube,
  HiBookOpen,
  HiCalculator,
  HiLogout,
  HiX,
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose, role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', icon: <HiViewGrid className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/admin/menus', icon: <HiCollection className="w-5 h-5" />, label: 'Menu' },
    { to: '/admin/submenus', icon: <HiClipboardList className="w-5 h-5" />, label: 'Sub Menu' },
    { to: '/admin/ingredients', icon: <HiCube className="w-5 h-5" />, label: 'Ingredients' },
    { to: '/admin/recipes', icon: <HiBookOpen className="w-5 h-5" />, label: 'Recipes' },
  ];

  const userLinks = [
    { to: '/user/dashboard', icon: <HiViewGrid className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/user/recipes', icon: <HiBookOpen className="w-5 h-5" />, label: 'Recipes' },
    { to: '/user/calculator', icon: <HiCalculator className="w-5 h-5" />, label: 'Quantity Calculator' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden no-print"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
          w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          no-print
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍳</span>
              <span className="text-xl font-bold text-emerald-600 tracking-tight">
                GourmetCraft
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <HiLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
