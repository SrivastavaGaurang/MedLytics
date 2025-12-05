// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

// Route Imports
import authRoutes from './routes/auth.js';
import sleepRoutes from './routes/sleep.js';
import depressionRoutes from './routes/depression.js';
import blogRoutes from './routes/blog.js';
import userRoutes from './routes/userRoutes.js';
import anxietyRoutes from './routes/anxietyRoutes.js';
import bmiRoutes from './routes/bmi.js';
import contactRoutes from './routes/contactRoutes.js';
import oauthRoutes from './routes/oauth.js';
import { cacheMiddleware, getCacheStats, clearCache } from './middleware/cache.js';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Security Middleware - Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: false
}));

// Compression Middleware - Compress responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Balanced compression level
}));

// CORS Middleware - Optimized configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate Limiting Middleware - Prevent API abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // API Routes with caching for read-heavy endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/sleep', cacheMiddleware(600), sleepRoutes); // Cache for 10 minutes
  app.use('/api/anxiety', cacheMiddleware(600), anxietyRoutes);
  app.use('/api/depression', cacheMiddleware(600), depressionRoutes);
  app.use('/api/blogs', cacheMiddleware(300), blogRoutes); // Cache for 5 minutes
  app.use('/api/bmi', cacheMiddleware(600), bmiRoutes);
  app.use('/api/contact', contactRoutes);
app.use('/api/oauth', oauthRoutes);

  // Cache management endpoints
  app.get('/api/cache/stats', (req, res) => {
    res.json(getCacheStats());
  });

  app.post('/api/cache/clear', (req, res) => {
    clearCache();
    res.json({ message: 'Cache cleared successfully' });
  });

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
  });

  // Basic route
  app.get('/', (req, res) => {
    res.send('MedLytics API is running!');
  });

  // Serve static assets in production
  if(process.env.NODE_ENV === 'production') {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medlytics')
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`MedLytics server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

export default app;