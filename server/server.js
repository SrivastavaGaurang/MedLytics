// server.js - Main entry point for the MedLytics application
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Import route files
import authRoutes from './routes/auth.js';
import sleepRoutes from './routes/sleep.js';
// Import other medical analysis routes here as needed
// import diabetesRoutes from './routes/diabetes.js';
// import heartRoutes from './routes/heart.js';
// import mentalHealthRoutes from './routes/mentalHealth.js';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/sleep', sleepRoutes);
// Use other routes
// app.use('/api/diabetes', diabetesRoutes);
// app.use('/api/heart', heartRoutes);
// app.use('/api/mental-health', mentalHealthRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('MedLytics API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MedLytics server running on port ${PORT}`));