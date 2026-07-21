/**
 * Get smart category display for recipe
 * - If Menu = Sub Menu → Show only Menu
 * - If Menu ≠ Sub Menu → Show Menu • Sub Menu
 * - If no Sub Menu → Show Menu only
 * - If no Menu → Show '—'
 */
export const getCategoryDisplay = (recipe) => {
  const menu = recipe.menuId?.name || null;
  const subMenu = recipe.subMenuId?.name || null;

  if (!menu && !subMenu) return '—';
  if (!menu) return subMenu;
  if (!subMenu) return menu;
  if (menu === subMenu) return menu;
  return `${menu} • ${subMenu}`;
};
