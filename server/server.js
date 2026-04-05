// server.js — MedLytics Analysis API (Firebase migration)
// MongoDB/Mongoose removed. This server only provides analysis computation endpoints.
// All auth and data persistence is handled by Firebase on the client side.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Analysis Route Imports (DB-free)
import sleepRoutes from './routes/sleep.js';
import depressionRoutes from './routes/depression.js';
import anxietyRoutes from './routes/anxietyRoutes.js';
import bmiRoutes from './routes/bmi.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: false,
}));

// Gzip compression
app.use(compression());

// CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── Analysis API Routes ────────────────────────────────────────────────────
app.use('/api/sleep', sleepRoutes);
app.use('/api/anxiety', anxietyRoutes);
app.use('/api/depression', depressionRoutes);
app.use('/api/bmi', bmiRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'MedLytics Analysis Server is running',
    database: 'Firebase (client-side)',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('MedLytics Analysis API is running! Auth & storage powered by Firebase.');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MedLytics Analysis Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🔥 Auth & Storage: Firebase`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;