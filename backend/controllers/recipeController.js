import Recipe from '../models/Recipe.js';

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Private
export const getRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || req.query.q || '';

    const query = { isActive: true };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const recipes = await Recipe.find(query)
      .populate('menuId', 'name')
      .populate('subMenuId', 'name')
      .populate('ingredients.ingredientId', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(query);

    res.status(200).json({ success: true, data: recipes, total, page, limit });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Private
export const getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('menuId', 'name')
      .populate('subMenuId', 'name')
      .populate('ingredients.ingredientId', 'name quantityUnit unitPrice wastePercent nutritionValue')
      .populate('createdBy', 'name');

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: 'Recipe not found' });
    }

    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

// @desc    Create recipe
// @route   POST /api/recipes
// @access  Private/Admin
export const createRecipe = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const recipe = await Recipe.create(req.body);
    const populated = await recipe.populate([
      { path: 'menuId', select: 'name' },
      { path: 'subMenuId', select: 'name' },
      { path: 'ingredients.ingredientId', select: 'name' },
    ]);
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private/Admin
export const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('menuId', 'name')
      .populate('subMenuId', 'name')
      .populate('ingredients.ingredientId', 'name');

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: 'Recipe not found' });
    }

    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private/Admin
export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: 'Recipe not found' });
    }

    await Recipe.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Search recipes by name
// @route   GET /api/recipes/search?q=
// @access  Private
export const searchRecipes = async (req, res, next) => {
  try {
    const { q } = req.query;
    const recipes = await Recipe.find({
      name: { $regex: q || '', $options: 'i' },
      isActive: true
    })
      .populate('menuId', 'name')
      .populate('subMenuId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate scaled ingredient quantities
// @route   POST /api/recipes/calculate
// @access  Private
export const calculateRecipe = async (req, res, next) => {
  try {
    const { recipeId, requiredQuantity, standardQuantity } = req.body;

    if (!recipeId || !requiredQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipeId and requiredQuantity',
      });
    }

    const recipe = await Recipe.findById(recipeId)
      .populate('menuId', 'name')
      .populate('subMenuId', 'name')
      .populate('ingredients.ingredientId', 'name quantityUnit unitPrice wastePercent nutritionValue');

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: 'Recipe not found' });
    }

    const baseQuantity = Number(standardQuantity) || recipe.portions;
    const scaleFactor = requiredQuantity / baseQuantity;

    const scaledIngredients = recipe.ingredients.map((ing) => ({
      ingredientId: ing.ingredientId,
      originalQuantity: ing.quantity,
      scaledQuantity: parseFloat((ing.quantity * scaleFactor).toFixed(2)),
      unit: ing.unit,
      unitPrice: ing.unitPrice,
      wastePercent: ing.wastePercent,
      yieldQuantity: parseFloat(
        ((ing.quantity * scaleFactor) * (1 - (ing.wastePercent || 0) / 100)).toFixed(2)
      ),
      ingredientCost: parseFloat(((ing.quantity * scaleFactor) * ing.unitPrice).toFixed(2)),
      nutritionValue: ing.nutritionValue,
    }));

    res.status(200).json({
      success: true,
      data: {
        recipe: {
          name: recipe.name,
          recipeGroup: recipe.recipeGroup,
          menu: recipe.menuId,
          subMenu: recipe.subMenuId,
          originalPortions: baseQuantity,
          requiredQuantity,
          scaleFactor: parseFloat(scaleFactor.toFixed(2)),
        },
        scaledIngredients,
      },
    });
  } catch (error) {
    next(error);
  }
};
