import SubMenu from '../models/SubMenu.js';
import Recipe from '../models/Recipe.js';

// @desc    Get all submenus
// @route   GET /api/submenus
// @access  Private
export const getSubMenus = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || req.query.q || '';

    const query = { isActive: true };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const subMenus = await SubMenu.find(query)
      .populate('menuId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SubMenu.countDocuments(query);

    res.status(200).json({ success: true, data: subMenus, total, page, limit });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submenus by menu
// @route   GET /api/submenus/by-menu/:menuId
// @access  Private
export const getSubMenusByMenu = async (req, res, next) => {
  try {
    const subMenus = await SubMenu.find({ menuId: req.params.menuId, isActive: true })
      .populate('menuId', 'name')
      .sort({ name: 1 });
    res.status(200).json({ success: true, data: subMenus });
  } catch (error) {
    next(error);
  }
};

// @desc    Create submenu
// @route   POST /api/submenus
// @access  Private/Admin
export const createSubMenu = async (req, res, next) => {
  try {
    const subMenu = await SubMenu.create(req.body);
    const populated = await subMenu.populate('menuId', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submenu
// @route   PUT /api/submenus/:id
// @access  Private/Admin
export const updateSubMenu = async (req, res, next) => {
  try {
    const subMenu = await SubMenu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('menuId', 'name');

    if (!subMenu) {
      return res
        .status(404)
        .json({ success: false, message: 'Sub-menu not found' });
    }

    res.status(200).json({ success: true, data: subMenu });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete submenu
// @route   DELETE /api/submenus/:id
// @access  Private/Admin
export const deleteSubMenu = async (req, res, next) => {
  try {
    const subMenu = await SubMenu.findById(req.params.id);

    if (!subMenu) {
      return res
        .status(404)
        .json({ success: false, message: 'Sub-menu not found' });
    }

    // Check for associated recipes
    const recipeCount = await Recipe.countDocuments({ subMenuId: req.params.id });
    if (recipeCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete sub-menu with associated recipes',
      });
    }

    await SubMenu.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
