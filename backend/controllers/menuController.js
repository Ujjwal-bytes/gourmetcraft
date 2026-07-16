import Menu from '../models/Menu.js';
import SubMenu from '../models/SubMenu.js';
import Recipe from '../models/Recipe.js';

// @desc    Get all menus
// @route   GET /api/menus
// @access  Private
export const getMenus = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || req.query.q || '';

    const query = { isActive: true };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const menus = await Menu.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Menu.countDocuments(query);

    res.status(200).json({ success: true, data: menus, total, page, limit });
  } catch (error) {
    next(error);
  }
};

// @desc    Create menu
// @route   POST /api/menus
// @access  Private/Admin
export const createMenu = async (req, res, next) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu
// @route   PUT /api/menus/:id
// @access  Private/Admin
export const updateMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu
// @route   DELETE /api/menus/:id
// @access  Private/Admin
export const deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    // Check for associated submenus and recipes
    const subMenuCount = await SubMenu.countDocuments({ menuId: req.params.id });
    const recipeCount = await Recipe.countDocuments({ menuId: req.params.id });

    if (subMenuCount > 0 || recipeCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete menu with associated sub-menus or recipes',
      });
    }

    await Menu.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Search menus by name
// @route   GET /api/menus/search?q=
// @access  Private
export const searchMenus = async (req, res, next) => {
  try {
    const { q } = req.query;
    const menus = await Menu.find({
      name: { $regex: q || '', $options: 'i' },
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: menus });
  } catch (error) {
    next(error);
  }
};
