// Updated sleep.js backend route 
import express from 'express';
import { check, validationResult } from 'express-validator';

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
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.id;
    const analyses = await SleepAnalysis.find({ user: userId }).sort({ date: -1 });
    res.json(analyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

function analyzeSleepDisorder(data) {
  let riskLevel = 'low';
  const possibleDisorders = [];
  const recommendations = [];

  if (data.sleepDuration < 6) {
    riskLevel = data.sleepDuration < 5 ? 'high' : 'moderate';
    possibleDisorders.push('Insomnia');
    recommendations.push('Aim for 7-9 hours of sleep per night');
    recommendations.push('Establish a regular sleep schedule');
  } else if (data.sleepDuration > 9) {
    riskLevel = data.sleepDuration > 10 ? 'high' : 'moderate';
    possibleDisorders.push('Hypersomnia');
    recommendations.push('Consult with a sleep specialist');
  }

  if (data.qualityOfSleep < 5) {
    if (riskLevel !== 'high') riskLevel = 'moderate';
    possibleDisorders.push('Sleep Fragmentation');
    recommendations.push('Create a comfortable sleep environment');
    recommendations.push('Reduce screen time before bed');
  }

  if (data.bmi > 30) {
    riskLevel = 'high';
    possibleDisorders.push('Sleep Apnea');
    recommendations.push('Consider weight management strategies');
    recommendations.push('Sleep on your side instead of your back');
  }

  if (data.stressLevel > 7 && data.physicalActivity < 30) {
    if (riskLevel !== 'high') riskLevel = 'moderate';
    possibleDisorders.push('Stress-Induced Sleep Disorder');
    recommendations.push('Incorporate regular physical activity into your routine');
    recommendations.push('Practice relaxation techniques before bedtime');
  }

  if (data.heartRate > 80 || 
      data.bloodPressure.systolic > 140 || 
      data.bloodPressure.diastolic > 90) {
    if (riskLevel !== 'high') riskLevel = 'moderate';
    possibleDisorders.push('Sleep-Related Breathing Disorder');
    recommendations.push('Monitor your blood pressure regularly');
    recommendations.push('Consider a sleep study for proper diagnosis');
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain your healthy sleep habits');
    recommendations.push('Stay physically active');
  }

  if (riskLevel === 'high') {
    recommendations.push('Consult with a healthcare provider as soon as possible');
  }

  return {
    riskLevel,
    possibleDisorders: [...new Set(possibleDisorders)],
    recommendations: [...new Set(recommendations)]
  };
}

export default router;