import express from 'express';
import {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  searchMenus,
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

const validateMenu = [
  check('name', 'Menu name is required').notEmpty(),
  validateRequest
];

router.use(protect);

router.get('/search', searchMenus);
router.route('/').get(getMenus).post(authorize('admin'), validateMenu, createMenu);
router
  .route('/:id')
  .put(authorize('admin'), validateMenu, updateMenu)
  .delete(authorize('admin'), deleteMenu);

export default router;
