// routes/sleep.js
import express from 'express';
import mongoose from 'mongoose';
import analyzeSleepDisorder from '../utils/analyzeSleepDisorder.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// MongoDB Schema for Sleep Analysis
const sleepSchema = new mongoose.Schema({
  authId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  // Basic Info
  age: Number,
  gender: String,
  // Core Sleep Metrics
  sleepDuration: Number,
  qualityOfSleep: Number,
  // Lifestyle Factors
  physicalActivity: Number,
  stressLevel: Number,
  bmi: Number,
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
  },
  heartRate: Number,
  dailySteps: Number,
  // Enhanced Fields
  sleepEnvironment: { type: Number, default: 5 },
  screenTimeBeforeBed: { type: Number, default: 2 },
  caffeineIntake: { type: Number, default: 2 },
  alcoholIntake: { type: Number, default: 1 },
  shiftWork: { type: Boolean, default: false },
  chronicPain: { type: Boolean, default: false },
  snoring: { type: Boolean, default: false },
  breathingInterruptions: { type: Boolean, default: false },
  restlessLegs: { type: Boolean, default: false },
  nightmares: { type: Boolean, default: false },
  sleepingPills: { type: Boolean, default: false },
  napsDuringDay: { type: Number, default: 1 },
  bedtimeConsistency: { type: Number, default: 5 },
  // Results
  result: {
    sleepScore: Number,
    riskLevel: String,
    riskFactors: [String],
    possibleDisorders: [String],
    recommendations: [String],
    professionalHelpNeeded: Boolean,
    detailedAnalysis: {
      durationScore: String,
      qualityRating: String,
      environmentRating: String,
      lifestyleImpact: String
    }
  },
});

const Sleep = mongoose.model('Sleep', sleepSchema);

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
    // BUG FIX: Changed from await_sleep.findById to await Sleep.findById
    const sleepResult = await Sleep.findById(req.params.id);
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
router.get('/history', async (req, res) => {
  try {
    const authId = req.query.authId; // Get authId from query params

    if (!authId) {
      return res.status(400).json({ message: 'Auth ID required as query parameter' });
    }

    const history = await Sleep.find({ authId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching sleep history:', error);
    res.status(500).json({ message: 'Server error fetching sleep history' });
  }
});

export default router;