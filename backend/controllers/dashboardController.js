import Recipe from '../models/Recipe.js';
import Ingredient from '../models/Ingredient.js';
import Menu from '../models/Menu.js';
import User from '../models/User.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const [totalRecipes, totalIngredients, totalMenus, activeUsers] =
      await Promise.all([
        Recipe.countDocuments(),
        Ingredient.countDocuments(),
        Menu.countDocuments(),
        User.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalRecipes,
        totalIngredients,
        totalMenus,
        activeUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};
