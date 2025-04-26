// routes/sleepAnalysis.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const SleepAnalysis = require('../models/SleepAnalysis');
const User = require('../models/User');
const tf = require('@tensorflow/tfjs-node');

// Load the trained model (in a real app, this would be loaded from a file)
// For now, we'll use a simple placeholder model
let sleepModel;

// Initialize a simple model for demonstration
async function initModel() {
  // This is a very simplified model for demonstration purposes
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 10, activation: 'relu', inputShape: [8]}));
  model.add(tf.layers.dense({units: 5, activation: 'relu'}));
  model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
  
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  return model;
}

// Initialize model when server starts
(async () => {
  try {
    sleepModel = await initModel();
    console.log('Sleep disorder prediction model loaded');
  } catch (error) {
    console.error('Error loading model:', error);
  }
})();

// Validation rules
const sleepAnalysisValidation = [
  check('age', 'Age is required').isNumeric(),
  check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
  check('sleepDuration', 'Sleep duration is required').isNumeric(),
  check('qualityOfSleep', 'Quality of sleep is required').isNumeric(),
  check('physicalActivity', 'Physical activity is required').isNumeric(),
  check('stressLevel', 'Stress level is required').isNumeric(),
  check('bmi', 'BMI is required').isNumeric(),
  check('bloodPressure.systolic', 'Systolic blood pressure is required').isNumeric(),
  check('bloodPressure.diastolic', 'Diastolic blood pressure is required').isNumeric(),
  check('heartRate', 'Heart rate is required').isNumeric(),
  check('dailySteps', 'Daily steps is required').isNumeric()
];

// @route   POST api/sleep/analyze
// @desc    Analyze sleep data and predict disorders
// @access  Private
router.post('/analyze', [auth, sleepAnalysisValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
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
    } = req.body;

    // Prepare data for prediction
    const inputData = tf.tensor2d([[
      age / 100, // Normalize age
      gender === 'male' ? 1 : 0, // Convert gender to numeric
      sleepDuration / 12, // Normalize sleep duration
      qualityOfSleep / 10, // Already normalized
      physicalActivity / 100, // Already normalized
      stressLevel / 10, // Already normalized
      bmi / 50, // Normalize BMI
      heartRate / 200 // Normalize heart rate
    ]]);

    // Make prediction using the model
    const prediction = sleepModel.predict(inputData);
    const predictionValue = prediction.dataSync()[0];
    const hasDisorder = predictionValue > 0.5;

    // Determine disorder type based on input features (simplified logic)
    let disorderType = 'none';
    if (hasDisorder) {
      if (sleepDuration < 5 && stressLevel > 7) {
        disorderType = 'insomnia';
      } else if (bmi > 30 && age > 40) {
        disorderType = 'sleep_apnea';
      } else if (physicalActivity < 30 && age > 50) {
        disorderType = 'restless_leg_syndrome';
      } else if (qualityOfSleep < 4 && sleepDuration > 9) {
        disorderType = 'narcolepsy';
      } else {
        disorderType = 'other';
      }
    }

    // Generate recommendations based on disorder type
    const recommendations = [];
    if (disorderType === 'insomnia') {
      recommendations.push(
        'Establish a regular sleep schedule',
        'Create a relaxing bedtime routine',
        'Avoid caffeine and electronics before bed',
        'Consider cognitive behavioral therapy for insomnia (CBT-I)'
      );
    } else if (disorderType === 'sleep_apnea') {
      recommendations.push(
        'Consult with a sleep specialist for proper diagnosis',
        'Consider weight loss if overweight',
        'Sleep on your side instead of your back',
        'Discuss CPAP therapy options with your doctor'
      );
    } else if (disorderType === 'restless_leg_syndrome') {
      recommendations.push(
        'Increase physical activity during the day',
        'Avoid caffeine and alcohol',
        'Apply warm or cool packs to your legs',
        'Consider supplements if you have iron deficiency'
      );
    } else if (disorderType === 'narcolepsy') {
      recommendations.push(
        'Consult with a neurologist for diagnosis and treatment',
        'Maintain a strict sleep schedule',
        'Take short planned naps during the day',
        'Avoid alcohol and caffeine'
      );
    } else if (disorderType === 'other') {
      recommendations.push(
        'Maintain a regular sleep schedule',
        'Create a comfortable sleep environment',
        'Limit screen time before bed',
        'Consider consulting with a sleep specialist'
      );
    } else {
      recommendations.push(
        'Continue with your healthy sleep habits',
        'Aim for 7-9 hours of sleep per night',
        'Keep a consistent sleep schedule',
        'Exercise regularly but not too close to bedtime'
      );
    }

    // Create new sleep analysis record
    const sleepAnalysis = new SleepAnalysis({
      user: req.user.id,
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
      hasDisorder,
      disorderType,
      predictionConfidence: predictionValue * 100, // Convert to percentage
      recommendations
    });

    await sleepAnalysis.save();
    res.json(sleepAnalysis);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/sleep/history
// @desc    Get user's sleep analysis history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const sleepHistory = await SleepAnalysis.find({ user: req.user.id })
      .sort({ createdAt: -1 });
      
    res.json(sleepHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/sleep/:id
// @desc    Get specific sleep analysis by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const sleepAnalysis = await SleepAnalysis.findById(req.params.id);
    
    // Check if sleep analysis exists
    if (!sleepAnalysis) {
      return res.status(404).json({ message: 'Sleep analysis not found' });
    }
    
    // Check if user owns this analysis
    if (sleepAnalysis.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(sleepAnalysis);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Sleep analysis not found' });
    }
    
    res.status(500).send('Server error');
  }
});

module.exports = router;