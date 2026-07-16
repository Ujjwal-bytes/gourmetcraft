import express from 'express';
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../controllers/ingredientController.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

const validateIngredient = [
  check('name', 'Name is required').notEmpty(),
  check('quantityUnit', 'Quantity Unit is required').notEmpty(),
  check('unitPrice', 'Unit Price must be a positive number').isFloat({ min: 0 }),
  check('wastePercent', 'Waste Percent must be a number between 0 and 100').optional().isFloat({ min: 0, max: 100 }),
  validateRequest
];

router.use(protect);

router.route('/').get(getIngredients).post(authorize('admin'), validateIngredient, createIngredient);
router
  .route('/:id')
  .put(authorize('admin'), validateIngredient, updateIngredient)
  .delete(authorize('admin'), deleteIngredient);

export default router;
