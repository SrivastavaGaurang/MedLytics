// routes/depression.js
import express from 'express';
import { check, validationResult } from 'express-validator';

// Import models
import DepressionAnalysis from '../models/DepressionAnalysis.js';

const router = express.Router();

// @route   POST api/depression/predict
// @desc    Submit depression data for analysis
// @access  Public
router.post(
  '/predict',
  [
    check('age', 'Age is required').isNumeric(),
    check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
    check('maritalStatus', 'Marital status is required').isIn(['single', 'married', 'divorced', 'widowed']),
    check('employmentStatus', 'Employment status is required').isIn(['employed', 'unemployed', 'student', 'retired']),
    check('stressLevel', 'Stress level is required').isNumeric(),
    check('sleepQuality', 'Sleep quality is required').isNumeric(),
    check('socialSupport', 'Social support is required').isNumeric(),
    check('physicalActivity', 'Physical activity is required').isNumeric(),
    check('dietQuality', 'Diet quality is required').isNumeric(),
    check('geneticHistory', 'Genetic history is required').isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        authId,
        age,
        gender,
        maritalStatus,
        employmentStatus,
        stressLevel,
        sleepQuality,
        socialSupport,
        physicalActivity,
        dietQuality,
        geneticHistory,
        medicalConditions
      } = req.body;

      // Analyze depression based on provided data
      const result = analyzeDepression({
        age,
        gender,
        maritalStatus,
        employmentStatus,
        stressLevel,
        sleepQuality,
        socialSupport,
        physicalActivity,
        dietQuality,
        geneticHistory,
        medicalConditions
      });

      const depressionAnalysis = new DepressionAnalysis({
        age,
        gender,
        maritalStatus,
        employmentStatus,
        stressLevel,
        sleepQuality,
        socialSupport,
        physicalActivity,
        dietQuality,
        geneticHistory,
        medicalConditions,
        result
      });

      await depressionAnalysis.save();
      res.json(depressionAnalysis);
    } catch (err) {
      console.error('Error in depression prediction:', err.message);
      res.status(500).json({
        message: 'Server error during depression analysis',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }
);

// @route   GET api/depression/results/:id
// @desc    Get depression analysis result by ID
// @access  Public
router.get('/results/:id', async (req, res) => {
  try {
    const analysis = await DepressionAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Depression analysis result not found' });
    }

    res.json(analysis);
  } catch (err) {
    console.error('Error fetching depression result:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid analysis ID format' });
    }
    res.status(500).json({
      message: 'Server error fetching results',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// @route   GET api/depression/history
// @desc    Get depression analysis history for a user
// @access  Public
router.get('/history', async (req, res) => {
  try {
    const authId = req.query.authId; // Get authId from query params

    if (!authId) {
      return res.status(400).json({ message: 'Auth ID required as query parameter' });
    }

    const analyses = await DepressionAnalysis.find({ authId }).sort({ date: -1 });
    res.json(analyses);
  } catch (err) {
    console.error('Error fetching depression history:', err.message);
    res.status(500).json({
      message: 'Server error fetching history',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Enhanced Depression analysis algorithm with weighted scoring and contradiction checks
function analyzeDepression(data) {
  let totalScore = 0;
  // Adjusted weights for better accuracy
  const W_STRESS = 30;
  const W_SLEEP = 25;
  const W_SOCIAL = 15;
  const W_PHYSICAL = 10;
  const W_DIET = 10;

  const keyFactors = [];
  const recommendations = [];

  // 1. Stress Level (Weight: 30%)
  const stressScore = (data.stressLevel / 10) * W_STRESS;
  totalScore += stressScore;

  if (data.stressLevel >= 8) {
    keyFactors.push({ name: 'Severe Chronic Stress', impact: 'High' });
  } else if (data.stressLevel >= 6) {
    keyFactors.push({ name: 'Elevated Stress Levels', impact: 'Moderate' });
  }

  // 2. Sleep Quality (Weight: 25%) - Critical factor
  const sleepScore = ((11 - data.sleepQuality) / 10) * W_SLEEP;
  totalScore += sleepScore;

  if (data.sleepQuality <= 3) {
    keyFactors.push({ name: 'Severe Sleep Disturbance', impact: 'High' });
  } else if (data.sleepQuality <= 5) {
    keyFactors.push({ name: 'Poor Sleep Quality', impact: 'Moderate' });
  }

  // 3. Social Support (Weight: 15%)
  const supportScore = ((11 - data.socialSupport) / 10) * W_SOCIAL;
  totalScore += supportScore;

  if (data.socialSupport <= 3) {
    keyFactors.push({ name: 'Social Isolation', impact: 'High' });
  }

  // 4. Physical Activity & Diet (Weight: 10% each)
  const activityScore = ((100 - data.physicalActivity) / 100) * W_PHYSICAL;
  totalScore += activityScore;

  const dietScore = ((11 - data.dietQuality) / 10) * W_DIET;
  totalScore += dietScore;

  // 5. Risk Multipliers
  let riskMultiplier = 0;

  if (data.geneticHistory) {
    riskMultiplier += 15; // Increased impact of genetics
    keyFactors.push({ name: 'Family History', impact: 'High' });
  }

  if (data.medicalConditions && data.medicalConditions.length > 0) {
    riskMultiplier += 10;
  }

  // Contradiction Check / False Positive Mitigation
  // If Stress is LOW and Sleep is GOOD, but total score is artificially dragged up by minor factors
  let falsePositiveFlag = false;
  if (data.stressLevel < 4 && data.sleepQuality > 7 && riskMultiplier === 0) {
    if (totalScore > 40) { // If it somehow reached moderate risk
      totalScore *= 0.6; // reduce score significantly
      falsePositiveFlag = true;
    }
  }

  totalScore += Math.min(25, riskMultiplier);

  // Determine Risk Level
  let riskLevel = 'low';
  let depressionType = 'Low Probability';
  let depressionTypeDescription = 'Your profile suggests a low risk of depression. Maintain your healthy habits.';

  if (totalScore >= 75) {
    riskLevel = 'high';
    depressionType = 'High Risk Profile';
    depressionTypeDescription = 'Strong indicators of depressive risk detected. Immediate professional consultation is recommended.';
  } else if (totalScore >= 45) {
    riskLevel = 'moderate';
    depressionType = 'Moderate Risk Profile';
    depressionTypeDescription = 'You show several risk factors. Early intervention and lifestyle adjustments are highly advisable.';
  } else if (falsePositiveFlag) {
    depressionTypeDescription += ' (Note: Some isolated factors were noted, but your core mental health indicators remain strong).';
  }

  // Infer Specific Type/Pattern
  if (riskLevel !== 'low') {
    if (data.stressLevel >= 8 && data.sleepQuality <= 4) {
      depressionType = 'Burnout / Stress-Induced';
      depressionTypeDescription = 'Symptoms appear driven by exhaustion and chronic stress.';
    } else if (data.socialSupport <= 3) {
      depressionType = 'Loneliness / Socially-Driven';
      depressionTypeDescription = 'Lack of social connection appears to be a primary driver.';
    }
  }

  // Generate Recommendations
  if (riskLevel === 'high') {
    recommendations.push('Consult a mental health professional immediately.');
    recommendations.push('Reach out to a trusted person to share your feelings.');
  } else if (riskLevel === 'moderate') {
    recommendations.push('Consider talking to a counselor to prevent symptoms from worsening.');
    recommendations.push('Review your work-life balance and prioritize rest.');
  }

  return {
    riskLevel,
    depressionType,
    depressionTypeDescription,
    keyFactors,
    recommendations
  };
}

export default router;