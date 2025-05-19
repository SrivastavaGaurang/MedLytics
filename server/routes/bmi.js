import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import BMIAnalysis from '../models/BMIAnalysis.js';

const router = express.Router();

// @route   POST api/bmi/analyze
// @desc    Create a BMI analysis
// @access  Private
router.post(
  '/analyze',
  [
    auth,
    [
      check('age', 'Age is required').isInt({ min: 18, max: 100 }),
      check('gender', 'Gender is required').isIn(['Male', 'Female', 'Other']),
      check('height', 'Height is required').isFloat({ min: 100, max: 250 }),
      check('weight', 'Weight is required').isFloat({ min: 30, max: 300 }),
      check('sleepDuration', 'Sleep duration is required').isFloat({ min: 1, max: 12 }),
      check('qualityOfSleep', 'Quality of sleep is required').isInt({ min: 1, max: 10 }),
      check('physicalActivityLevel', 'Physical activity level is required').isInt({ min: 0, max: 100 }),
      check('stressLevel', 'Stress level is required').isInt({ min: 1, max: 10 }),
      check('bloodPressure.systolic', 'Systolic blood pressure is required').isInt({ min: 70, max: 200 }),
      check('bloodPressure.diastolic', 'Diastolic blood pressure is required').isInt({ min: 40, max: 120 }),
      check('heartRate', 'Heart rate is required').isInt({ min: 40, max: 200 }),
      check('dailySteps', 'Daily steps is required').isInt({ min: 100, max: 50000 }),
      check('result.predictedCategory', 'Predicted category is required').isIn(['Underweight', 'Normal', 'Overweight', 'Obesity'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const bmiAnalysis = new BMIAnalysis({
        user: req.user.id,
        ...req.body
      });
      await bmiAnalysis.save();
      res.json(bmiAnalysis);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/bmi/history
// @desc    Get all BMI analyses for a user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const bmiAnalyses = await BMIAnalysis.find({ user: req.user.id }).sort({ date: -1 });
    res.json(bmiAnalyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bmi/results/:id
// @desc    Get BMI analysis by ID
// @access  Private
router.get('/results/:id', auth, async (req, res) => {
  try {
    const bmiAnalysis = await BMIAnalysis.findById(req.params.id);
    if (!bmiAnalysis) {
      return res.status(404).json({ msg: 'BMI analysis not found' });
    }
    if (bmiAnalysis.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(bmiAnalysis);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'BMI analysis not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/bmi/:id
// @desc    Delete a BMI analysis
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const bmiAnalysis = await BMIAnalysis.findById(req.params.id);
    if (!bmiAnalysis) {
      return res.status(404).json({ msg: 'BMI analysis not found' });
    }
    if (bmiAnalysis.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await bmiAnalysis.deleteOne();
    res.json({ msg: 'BMI analysis removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'BMI analysis not found' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;