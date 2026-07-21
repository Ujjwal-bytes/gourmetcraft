import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import rateLimit from 'express-rate-limit';

import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Route imports
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import subMenuRoutes from './routes/subMenuRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import dns from 'dns';

// Load env vars - MUST be before any other imports that use env vars
dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 5000 requests per `window` (here, per 15 minutes)
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Set security headers
app.use(helmet());

// Sanitize data (prevent NoSQL injection)
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/submenus', subMenuRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'GourmetCraft API is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GourmetCraft Server running on port ${PORT}`);
});