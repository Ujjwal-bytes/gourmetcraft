import express from 'express';
import { login, register, getMe } from '../controllers/authController.js';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  login
);

router.post(
  '/register',
  protect,
  authorize('admin'),
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  register
);
router.get('/me', protect, getMe);

export default router;
