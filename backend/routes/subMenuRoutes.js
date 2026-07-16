import express from 'express';
import {
  getSubMenus,
  getSubMenusByMenu,
  createSubMenu,
  updateSubMenu,
  deleteSubMenu,
} from '../controllers/subMenuController.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

const validateSubMenu = [
  check('name', 'Sub-menu name is required').notEmpty(),
  check('menuId', 'Valid Menu ID is required').isMongoId(),
  validateRequest
];

router.use(protect);

router.get('/by-menu/:menuId', getSubMenusByMenu);
router.route('/').get(getSubMenus).post(authorize('admin'), validateSubMenu, createSubMenu);
router
  .route('/:id')
  .put(authorize('admin'), validateSubMenu, updateSubMenu)
  .delete(authorize('admin'), deleteSubMenu);

export default router;
