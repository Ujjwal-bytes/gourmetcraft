import express from 'express';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  calculateRecipe,
} from '../controllers/recipeController.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

const validateRecipe = [
  check('name', 'Recipe name is required').notEmpty(),
  check('portions', 'Portions must be a positive number').isNumeric({ min: 1 }),
  check('menuId', 'Menu ID is required').isMongoId(),
  validateRequest
];

router.use(protect);

router.get('/search', searchRecipes);
router.post('/calculate', calculateRecipe);
router.route('/').get(getRecipes).post(authorize('admin'), validateRecipe, createRecipe);
router
  .route('/:id')
  .get(getRecipe)
  .put(authorize('admin'), validateRecipe, updateRecipe)
  .delete(authorize('admin'), deleteRecipe);

export default router;
