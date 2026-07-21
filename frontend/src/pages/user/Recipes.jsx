import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiSearch, 
  HiOutlineBookOpen, 
  HiOutlineUserGroup, 
  HiOutlineX,
  HiOutlineFilter,
  HiOutlineChevronDown,
  HiOutlineRefresh,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineDotsHorizontal
} from 'react-icons/hi';
import API from '../../api/axios';
import Skeleton from '../../components/common/Skeleton';
import { getCategoryDisplay } from '../../utils/recipeHelpers';

const UserRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('all');
  const [selectedSubMenu, setSelectedSubMenu] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const navigate = useNavigate();

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const menus = new Map();
    const subMenus = new Map();
    const groups = new Set();

    recipes.forEach(recipe => {
      if (recipe.menuId?._id) {
        menus.set(recipe.menuId._id, recipe.menuId.name);
      }
      if (recipe.subMenuId?._id) {
        subMenus.set(recipe.subMenuId._id, recipe.subMenuId.name);
      }
      if (recipe.recipeGroup) {
        groups.add(recipe.recipeGroup);
      }
    });

    return {
      menus: Array.from(menus, ([id, name]) => ({ id, name })),
      subMenus: Array.from(subMenus, ([id, name]) => ({ id, name })),
      groups: Array.from(groups)
    };
  }, [recipes]);

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    
    let filtered = recipes.filter((recipe) => {
      if (selectedMenu !== 'all' && recipe.menuId?._id !== selectedMenu) return false;
      if (selectedSubMenu !== 'all' && recipe.subMenuId?._id !== selectedSubMenu) return false;
      if (selectedGroup !== 'all' && recipe.recipeGroup !== selectedGroup) return false;
      if (!q) return true;

      const matchName = recipe.name?.toLowerCase().includes(q);
      const matchMenu = recipe.menuId?.name?.toLowerCase().includes(q);
      const matchSubMenu = recipe.subMenuId?.name?.toLowerCase().includes(q);
      const matchIngredient = recipe.ingredients?.some((ing) =>
        ing.ingredientId?.name?.toLowerCase().includes(q)
      );
      const matchGroup = recipe.recipeGroup?.toLowerCase().includes(q);
      
      return matchName || matchMenu || matchSubMenu || matchIngredient || matchGroup;
    });

    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = a.name || '';
          valueB = b.name || '';
          break;
        case 'portions':
          valueA = a.portions || 0;
          valueB = b.portions || 0;
          break;
        case 'ingredients':
          valueA = a.ingredients?.length || 0;
          valueB = b.ingredients?.length || 0;
          break;
        case 'menu':
          valueA = a.menuId?.name || '';
          valueB = b.menuId?.name || '';
          break;
        default:
          valueA = a.name || '';
          valueB = b.name || '';
      }

      if (typeof valueA === 'string') {
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });

    return filtered;
  }, [recipes, searchQuery, selectedMenu, selectedSubMenu, selectedGroup, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRecipes.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMenu, selectedSubMenu, selectedGroup, sortBy, sortOrder]);

  const fetchRecipes = async () => {
    try {
      const res = await API.get('/api/recipes');
      setRecipes(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Recipes — GourmetCraft';
    fetchRecipes();
  }, []);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMenu('all');
    setSelectedSubMenu('all');
    setSelectedGroup('all');
    setSortBy('name');
    setSortOrder('asc');
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const activeFilterCount = [
    selectedMenu !== 'all',
    selectedSubMenu !== 'all',
    selectedGroup !== 'all',
    sortBy !== 'name',
    searchQuery !== ''
  ].filter(Boolean).length;

  // ==================== SMART BADGE LOGIC ====================
  const getBadge = (recipe) => {
    // Priority 1: Sub-Menu (most specific)
    if (recipe.subMenuId?.name) {
      return recipe.subMenuId.name;
    }
    // Priority 2: Menu (if no sub-menu)
    if (recipe.menuId?.name) {
      return recipe.menuId.name;
    }
    // Priority 3: Recipe Group (fallback)
    if (recipe.recipeGroup) {
      return recipe.recipeGroup;
    }
    return null;
  };

  const getHierarchyText = (recipe) => {
    const badge = getBadge(recipe);
    const parts = [];
    
    // Add Menu if it's different from badge
    if (recipe.menuId?.name && recipe.menuId.name !== badge) {
      parts.push(recipe.menuId.name);
    }
    
    // Add Sub-Menu if it's different from badge
    if (recipe.subMenuId?.name && recipe.subMenuId.name !== badge) {
      parts.push(recipe.subMenuId.name);
    }
    
    return parts.length > 0 ? parts.join(' • ') : null;
  };

  // ==================== PAGINATION ====================
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      const half = Math.floor(maxVisible / 2);
      
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, currentPage + half);

      if (end - start < maxVisible - 1) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisible - 1);
        } else if (end === totalPages) {
          start = Math.max(1, end - maxVisible + 1);
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> 
          {' - '}
          <span className="font-medium text-gray-700">
            {Math.min(endIndex, filteredRecipes.length)}
          </span>
          {' of '}
          <span className="font-medium text-gray-700">{filteredRecipes.length}</span>
          {' recipes'}
        </div>

        <div className="flex items-center gap-1 order-1 sm:order-2">
          <div className="flex items-center gap-2 mr-4 text-sm text-gray-500">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-all ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            aria-label="Previous page"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>

          {getPageNumbers().map((page, index, array) => {
            if (index > 0 && array[index - 1] !== page - 1) {
              return (
                <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                  <HiOutlineDotsHorizontal className="w-4 h-4" />
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-all ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            aria-label="Next page"
          >
            <HiOutlineChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // ==================== SKELETON ====================
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-6 w-2/3 bg-gray-200 rounded-lg" />
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
      <div className="flex gap-4 pt-3 border-t border-gray-100 mb-4">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="h-10 w-full bg-gray-200 rounded-xl" />
    </div>
  );

  // ==================== EMPTY STATE ====================
  const EmptyState = () => (
    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <HiSearch className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {activeFilterCount > 0 ? 'No matching recipes' : 'No recipes available'}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">
        {activeFilterCount > 0 
          ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
          : 'Start building your recipe collection by adding your first recipe.'}
      </p>
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          <HiOutlineRefresh className="w-4 h-4" />
          Clear all filters
        </button>
      )}
    </div>
  );

  // ==================== RECIPE CARD (CLEAN - NO DUPLICATION) ====================
  const RecipeCard = ({ recipe }) => {
    const categoryDisplay = getCategoryDisplay(recipe);

    return (
      <div className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200">
        {/* Header: Recipe Name + Category */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {recipe.name}
          </h3>
          {categoryDisplay && (
            <span className="shrink-0 px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">
              {categoryDisplay}
            </span>
          )}
        </div>

        {/* Recipe Group if available */}
        {recipe.recipeGroup && (
          <div className="text-sm text-gray-500 mb-3">
            {recipe.recipeGroup}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-600 pt-3 border-t border-gray-100 mb-4">
          <span className="flex items-center gap-1.5">
            <HiOutlineUserGroup className="w-4 h-4 text-emerald-500" />
            {recipe.portions || 0} portions
          </span>
          <span className="flex items-center gap-1.5">
            <HiOutlineBookOpen className="w-4 h-4 text-emerald-500" />
            {recipe.ingredients?.length || 0} ingredients
          </span>
        </div>

        <button
          onClick={() => navigate(`/user/recipes/${recipe._id}`)}
          className="w-full py-2.5 px-4 bg-gray-900 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
        >
          View Details
        </button>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>{filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}</span>
            {activeFilterCount > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] md:w-64">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
              isFilterOpen || activeFilterCount > 0
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <HiOutlineFilter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <HiOutlineRefresh className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {isFilterOpen && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Menu</label>
              <select
                value={selectedMenu}
                onChange={(e) => setSelectedMenu(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              >
                <option value="all">All Menus</option>
                {filterOptions.menus.map(menu => (
                  <option key={menu.id} value={menu.id}>{menu.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Sub-Menu</label>
              <select
                value={selectedSubMenu}
                onChange={(e) => setSelectedSubMenu(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                disabled={filterOptions.subMenus.length === 0}
              >
                <option value="all">All Sub-Menus</option>
                {filterOptions.subMenus.map(subMenu => (
                  <option key={subMenu.id} value={subMenu.id}>{subMenu.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                disabled={filterOptions.groups.length === 0}
              >
                <option value="all">All Categories</option>
                {filterOptions.groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                >
                  <option value="name">Name</option>
                  <option value="portions">Portions</option>
                  <option value="ingredients">Ingredients</option>
                  <option value="menu">Menu</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button onClick={clearFilters} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
              Reset All
            </button>
            <button onClick={() => setIsFilterOpen(false)} className="px-6 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Chips */}
      {activeFilterCount > 0 && !isFilterOpen && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedMenu !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-full">
              Menu: {filterOptions.menus.find(m => m.id === selectedMenu)?.name}
              <button onClick={() => setSelectedMenu('all')} className="hover:text-emerald-900">
                <HiOutlineX className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSubMenu !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-full">
              Sub: {filterOptions.subMenus.find(m => m.id === selectedSubMenu)?.name}
              <button onClick={() => setSelectedSubMenu('all')} className="hover:text-blue-900">
                <HiOutlineX className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedGroup !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-full">
              {selectedGroup}
              <button onClick={() => setSelectedGroup('all')} className="hover:text-purple-900">
                <HiOutlineX className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-gray-900">
                <HiOutlineX className="w-3 h-3" />
              </button>
            </span>
          )}
          {sortBy !== 'name' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full">
              Sort: {sortBy} {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredRecipes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Showing {startIndex + 1} - {Math.min(endIndex, filteredRecipes.length)} of {filteredRecipes.length} recipes
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          <Pagination />
        </>
      )}
    </div>
  );
};

export default UserRecipes;