const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const BMIAnalysis = require('../../models/BMIAnalysis');
const User = require('../../models/User');

// @route   POST api/bmi
// @desc    Create or update a BMI analysis
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('age', 'Age is required').not().isEmpty(),
      check('height', 'Height is required').not().isEmpty(),
      check('weight', 'Weight is required').not().isEmpty(),
      check('gender', 'Gender is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { age, height, weight, gender } = req.body;
      
      // Calculate BMI
      const heightInMeters = height / 100; // Convert cm to meters
      const bmi = weight / (heightInMeters * heightInMeters);
      const roundedBMI = Math.round(bmi * 10) / 10; // Round to 1 decimal place
      
      // Determine BMI category
      let bmiCategory;
      if (bmi < 18.5) {
        bmiCategory = 'Underweight';
      } else if (bmi >= 18.5 && bmi < 25) {
        bmiCategory = 'Normal weight';
      } else if (bmi >= 25 && bmi < 30) {
        bmiCategory = 'Overweight';
      } else {
        bmiCategory = 'Obesity';
      }
      
      // Create BMI analysis object
      const bmiFields = {
        user: req.user.id,
        age,
        height,
        weight,
        gender,
        bmi: roundedBMI,
        bmiCategory,
        date: Date.now()
      };

      // Create new BMI analysis
      let bmiAnalysis = new BMIAnalysis(bmiFields);
      await bmiAnalysis.save();
      
      res.json(bmiAnalysis);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/bmi
// @desc    Get all BMI analyses for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bmiAnalyses = await BMIAnalysis.find({ user: req.user.id }).sort({ date: -1 });
    res.json(bmiAnalyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bmi/:id
// @desc    Get BMI analysis by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const bmiAnalysis = await BMIAnalysis.findById(req.params.id);
    
    // Check if BMI analysis exists
    if (!bmiAnalysis) {
      return res.status(404).json({ msg: 'BMI analysis not found' });
    }
    
    // Check if user owns the BMI analysis
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
    
    // Check if BMI analysis exists
    if (!bmiAnalysis) {
      return res.status(404).json({ msg: 'BMI analysis not found' });
    }
    
    // Check if user owns the BMI analysis
    if (bmiAnalysis.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await bmiAnalysis.remove();
    res.json({ msg: 'BMI analysis removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'BMI analysis not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;