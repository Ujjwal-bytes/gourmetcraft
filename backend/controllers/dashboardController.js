import Recipe from '../models/Recipe.js';
import Ingredient from '../models/Ingredient.js';
import Menu from '../models/Menu.js';
import User from '../models/User.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const [totalRecipes, totalIngredients, totalMenus, activeUsers, recentRecipes, topIngredients] =
      await Promise.all([
        Recipe.countDocuments({ isActive: true }),
        Ingredient.countDocuments({ isActive: true }),
        Menu.countDocuments({ isActive: true }),
        User.countDocuments(),
        Recipe.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).populate('menuId', 'name').populate('subMenuId', 'name'),
        Recipe.aggregate([
          { $match: { isActive: true } },
          { $unwind: '$ingredients' },
          { $group: { _id: '$ingredients.ingredientId', usageCount: { $sum: 1 } } },
          { $sort: { usageCount: -1 } },
          { $limit: 5 },
          { $lookup: { from: 'ingredients', localField: '_id', foreignField: '_id', as: 'ingredientDetails' } },
          { $unwind: '$ingredientDetails' },
          { $project: { _id: 1, name: '$ingredientDetails.name', unit: '$ingredientDetails.quantityUnit', usageCount: 1 } }
        ])
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalRecipes,
        totalIngredients,
        totalMenus,
        activeUsers,
        recentRecipes,
        topIngredients,
      },
    });
  } catch (error) {
    next(error);
  }
};
