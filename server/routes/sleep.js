// routes/sleep.js
import express from 'express';
import mongoose from 'mongoose';
import analyzeSleepDisorder from '../utils/analyzeSleepDisorder.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// MongoDB Schema for Sleep Analysis
const sleepSchema = new mongoose.Schema({
  authId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  age: Number,
  gender: String,
  sleepDuration: Number,
  qualityOfSleep: Number,
  physicalActivity: Number,
  stressLevel: Number,
  bmi: Number,
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
  },
  heartRate: Number,
  dailySteps: Number,
  result: {
    riskLevel: String,
    possibleDisorders: [String],
    recommendations: [String],
  },
});

const Sleep = mongoose.model('Sleep', sleepSchema);

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH0_SECRET || 'your-auth0-secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// POST /api/sleep/analyze
router.post('/analyze', async (req, res) => {
  try {
    const formData = req.body;
    const { authId } = formData;

    if (!authId) {
      return res.status(400).json({ message: 'authId is required' });
    }

    // Analyze sleep disorder
    const analysisResult = analyzeSleepDisorder(formData);

    // Save to database
    const sleepAnalysis = new Sleep({
      ...formData,
      result: analysisResult,
    });

    await sleepAnalysis.save();

    res.status(201).json({
      _id: sleepAnalysis._id,
      ...formData,
      result: analysisResult,
    });
  } catch (error) {
    console.error('Error analyzing sleep:', error);
    res.status(500).json({ message: 'Server error during sleep analysis' });
  }
});

// GET /api/sleep/results/:id
router.get('/results/:id', async (req, res) => {
  try {
    const sleepResult = await_sleep.findById(req.params.id);
    if (!sleepResult) {
      return res.status(404).json({ message: 'Sleep result not found' });
    }
    res.json(sleepResult);
  } catch (error) {
    console.error('Error fetching sleep result:', error);
    res.status(500).json({ message: 'Server error fetching sleep result' });
  }
});

// GET /api/sleep/history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const authId = req.user.sub; // Auth0 user ID
    const history = await Sleep.find({ authId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching sleep history:', error);
    res.status(500).json({ message: 'Server error fetching sleep history' });
  }
});

export default router;