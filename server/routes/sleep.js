// Fixed sleep.js backend route with proper JWT imports
import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js'; // Import the auth middleware

// Import models
import SleepAnalysis from '../models/SleepAnalysis.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST api/sleep/analyze
// @desc    Submit sleep data for analysis
// @access  Public (authId required)
router.post(
  '/analyze',
  [
    check('authId', 'Auth ID is required').notEmpty(),
    check('age', 'Age is required').isNumeric(),
    check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
    check('sleepDuration', 'Sleep duration is required').isNumeric(),
    check('qualityOfSleep', 'Quality of sleep is required').isNumeric(),
    check('physicalActivity', 'Physical activity level is required').isNumeric(),
    check('stressLevel', 'Stress level is required').isNumeric(),
    check('bmi', 'BMI is required').isNumeric(),
    check('bloodPressure.systolic', 'Systolic blood pressure is required').isNumeric(),
    check('bloodPressure.diastolic', 'Diastolic blood pressure is required').isNumeric(),
    check('heartRate', 'Heart rate is required').isNumeric(),
    check('dailySteps', 'Daily steps is required').isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { authId, age, gender, sleepDuration, qualityOfSleep, physicalActivity, stressLevel, bmi, bloodPressure, heartRate, dailySteps } = req.body;

      // Try to find existing user
      let user = await User.findOne({ authId });

      // If not found, create a new user
      if (!user) {
        user = new User({
          authId,
          name: 'Anonymous', // Optional: replace with name from Auth0 if passed later
          email: `${authId}@auth0.com`, // Fake/placeholder email
          password: 'Auth0User' // Dummy, since Auth0 manages auth
        });

        await user.save();
      }

      const result = analyzeSleepDisorder({
        age,
        gender,
        sleepDuration,
        qualityOfSleep,
        physicalActivity,
        stressLevel,
        bmi,
        bloodPressure,
        heartRate,
        dailySteps
      });

      const sleepAnalysis = new SleepAnalysis({
        user: user._id,
        age,
        gender,
        sleepDuration,
        qualityOfSleep,
        physicalActivity,
        stressLevel,
        bmi,
        bloodPressure,
        heartRate,
        dailySteps,
        result
      });

      await sleepAnalysis.save();
      res.json(sleepAnalysis);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/sleep/results/:id
// @desc    Get sleep analysis result by ID
// @access  Public (no auth required for now, but you can add authentication later)
router.get('/results/:id', async (req, res) => {
  try {
    const analysis = await SleepAnalysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Sleep analysis result not found' });
    }
    
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Sleep analysis result not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/sleep/history
// @desc    Get sleep analysis history for a user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const analyses = await SleepAnalysis.find({ user: userId }).sort({ date: -1 });
    res.json(analyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});