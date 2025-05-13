// server.js - Main entry point for the MedLytics application
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Route Imports
import authRoutes from './routes/auth.js';
import sleepRoutes from './routes/sleep.js';
import blogRoutes from './routes/blogs.js';
import userRoutes from './routes/userRoutes.js';
import anxietyRoutes from './routes/anxietyRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/anxiety', anxietyRoutes);
app.use('/api/blogs', blogRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Basic route
app.get('/', (req, res) => {
  res.send('MedLytics API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlytics')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`MedLytics server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
