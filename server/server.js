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
import rateLimit from 'express-rate-limit';

// Route Imports
import sleepRoutes from './routes/sleep.js';
import depressionRoutes from './routes/depression.js';
import blogRoutes from './routes/blog.js';
import anxietyRoutes from './routes/anxietyRoutes.js';
import bmiRoutes from './routes/bmi.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/auth.js';
import { cacheMiddleware, getCacheStats, clearCache } from './middleware/cache.js';

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ ERROR: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file and ensure all required variables are set.');
  console.error('See .env.example for reference.\n');
  process.exit(1);
}

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
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// API Routes with caching for read-heavy endpoints
app.use('/api/auth', authRoutes); // Authentication routes (no cache)
app.use('/api/sleep', cacheMiddleware(600), sleepRoutes); // Cache for 10 minutes
app.use('/api/anxiety', cacheMiddleware(600), anxietyRoutes);
app.use('/api/depression', cacheMiddleware(600), depressionRoutes);
app.use('/api/blog', cacheMiddleware(300), blogRoutes); // Cache for 5 minutes
app.use('/api/bmi', cacheMiddleware(600), bmiRoutes);
app.use('/api/contact', contactRoutes);

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
if (process.env.NODE_ENV === 'production') {
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

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
};

// MongoDB connection with improved error handling
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medlytics', mongooseOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`🚀 MedLytics server running on port ${PORT}`);
      console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\n⚠️  Troubleshooting steps:');
    console.error('  1. Verify MONGO_URI in .env file is correct');
    console.error('  2. Check MongoDB Atlas network access settings');
    console.error('  3. Ensure your IP address is whitelisted in MongoDB Atlas');
    console.error('  4. Verify internet connectivity');
    console.error('  5. Check if MongoDB Atlas cluster is running\n');
    console.error('Full error:', err);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('⏹️  MongoDB connection closed through app termination');
  process.exit(0);
});

export default app;