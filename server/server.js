// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import authRoutes from './routes/auth.js';
import sleepRoutes from './routes/sleep.js'; // Ensure this matches sleep.js export
import depressionRoutes from './routes/depression.js';
import blogRoutes from './routes/blog.js';
import userRoutes from './routes/userRoutes.js';
import anxietyRoutes from './routes/anxietyRoutes.js';
import bmiRoutes from './routes/bmi.js';
import contactRoutes from './routes/contactRoutes.js'; // Added contact routes import


// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/anxiety', anxietyRoutes);
app.use('/api/depression', depressionRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/bmi', bmiRoutes);
app.use('/api/contact', contactRoutes); // Added contact routes


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