import Ingredient from '../models/Ingredient.js';
import Recipe from '../models/Recipe.js';

// @desc    Get all ingredients
// @route   GET /api/ingredients
// @access  Private
export const getIngredients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || req.query.q || '';

    const query = { isActive: true };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const ingredients = await Ingredient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ingredient.countDocuments(query);

    res.status(200).json({ success: true, data: ingredients, total, page, limit });
  } catch (error) {
    next(error);
  }
};

// @desc    Create ingredient
// @route   POST /api/ingredients
// @access  Private/Admin
export const createIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json({ success: true, data: ingredient });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ingredient
// @route   PUT /api/ingredients/:id
// @access  Private/Admin
export const updateIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ingredient) {
      return res
        .status(404)
        .json({ success: false, message: 'Ingredient not found' });
    }

    res.status(200).json({ success: true, data: ingredient });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ingredient
// @route   DELETE /api/ingredients/:id
// @access  Private/Admin
export const deleteIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res
        .status(404)
        .json({ success: false, message: 'Ingredient not found' });
    }

    // Check if ingredient is used in any recipe
    const recipeCount = await Recipe.countDocuments({
      'ingredients.ingredientId': req.params.id,
    });

    if (recipeCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete ingredient that is used in recipes',
      });
    }

    await Ingredient.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
