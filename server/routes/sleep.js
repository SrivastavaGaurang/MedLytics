// routes/sleep.js
import express from 'express';
import { validationResult } from 'express-validator';
import { jwtAuth0Check } from '../middleware/auth.js';
import User from '../models/User.js';
import SleepAnalysis from '../models/SleepAnalysis.js';
import analyzeSleepDisorder from '../utils/analyzeSleepDisorder.js';

const router = express.Router();

// Public route
router.get('/', (req, res) => {
  res.json({ message: 'Sleep API endpoint' });
});

// Protected route (Auth0)
router.get('/protected', jwtAuth0Check, (req, res) => {
  res.json({ message: 'Protected sleep data', user: req.user });
});

// Get a specific sleep analysis result by ID
router.get('/results/:id', async (req, res) => {
  try {
    const sleepAnalysis = await SleepAnalysis.findById(req.params.id);
    
    if (!sleepAnalysis) {
      return res.status(404).json({ message: 'Sleep analysis not found' });
    }
    
    res.json(sleepAnalysis);
  } catch (err) {
    console.error('Error fetching sleep analysis:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's sleep history (protected)
router.get('/history', jwtAuth0Check, async (req, res) => {
  try {
    const user = await User.findOne({ authId: req.user.sub });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const sleepHistory = await SleepAnalysis.find({ user: user._id })
                                          .sort({ date: -1 })
                                          .select('-__v');
    
    res.json(sleepHistory);
  } catch (err) {
    console.error('Error fetching sleep history:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Analyze sleep data
router.post(
  '/analyze',
  [
    // Add validation checks as needed, e.g.:
    // check('sleepDuration', 'Sleep duration is required').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { authId, age, gender, sleepDuration, qualityOfSleep, physicalActivity, stressLevel, bmi, bloodPressure, heartRate, dailySteps } = req.body;

      let user = await User.findOne({ authId });
      if (!user) {
        user = new User({
          authId,
          name: 'Anonymous',
          email: `${authId}@auth0.com`,
          password: 'Auth0User',
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
        dailySteps,
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
        result,
      });

      await sleepAnalysis.save();
      console.log('Sleep analysis saved:', sleepAnalysis._id);
      res.json(sleepAnalysis);
    } catch (err) {
      console.error('Error saving sleep analysis:', err.message, err.stack);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

export default router;