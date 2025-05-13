// routes/depression.js
import express from 'express';
import { check, validationResult } from 'express-validator';

// Import models
import DepressionPrediction from '../models/DepressionPrediction.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST api/depression/predict
// @desc    Submit depression prediction data
// @access  Public (authId required)
router.post(
  '/predict',
  [
    check('authId', 'Auth ID is required').notEmpty(),
    check('age', 'Age is required').isNumeric(),
    check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
    check('maritalStatus', 'Marital status is required').isIn(['single', 'married', 'divorced', 'widowed']),
    check('employmentStatus', 'Employment status is required').isIn(['employed', 'unemployed', 'student', 'retired']),
    check('stressLevel', 'Stress level is required').isNumeric().isInt({ min: 1, max: 10 }),
    check('sleepQuality', 'Sleep quality is required').isNumeric().isInt({ min: 1, max: 10 }),
    check('socialSupport', 'Social support is required').isNumeric().isInt({ min: 1, max: 10 }),
    check('physicalActivity', 'Physical activity is required').isNumeric().isInt({ min: 0, max: 100 }),
    check('dietQuality', 'Diet quality is required').isNumeric().isInt({ min: 1, max: 10 }),
    check('geneticHistory', 'Genetic history is required').isBoolean(),
    check('medicalConditions', 'Medical conditions must be an array').optional().isArray()
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

      const result = analyzeDepressionRisk({
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

      const depressionPrediction = new DepressionPrediction({
        user: user._id,
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

      await depressionPrediction.save();
      res.json(depressionPrediction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/depression/results/:id
// @desc    Get depression prediction result by ID
// @access  Public (can add authentication later)
router.get('/results/:id', async (req, res) => {
  try {
    const analysis = await DepressionPrediction.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Depression prediction result not found' });
    }
    
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Depression prediction result not found' });
    }
    res.status(500).send('Server error');
  }
});

function analyzeDepressionRisk(data) {
  let riskLevel = 'low';
  const possibleDepressionTypes = [];
  const recommendations = [];

  // Risk calculation based on multiple factors
  const riskFactors = [
    data.stressLevel > 7 ? 1 : 0,
    data.sleepQuality < 5 ? 1 : 0,
    data.socialSupport < 5 ? 1 : 0,
    data.physicalActivity < 30 ? 1 : 0,
    data.dietQuality < 5 ? 1 : 0,
    data.geneticHistory ? 1 : 0
  ];

  const riskScore = riskFactors.reduce((a, b) => a + b, 0);

  // Determine risk level
  if (riskScore >= 4) {
    riskLevel = 'high';
  } else if (riskScore >= 2) {
    riskLevel = 'moderate';
  }

  // Specific risk factor assessments
  if (data.stressLevel > 7) {
    possibleDepressionTypes.push('Stress-Induced Depression');
    recommendations.push('Implement stress management techniques');
  }

  if (data.sleepQuality < 5) {
    possibleDepressionTypes.push('Sleep-Related Depression');
    recommendations.push('Establish a consistent sleep routine');
  }

  if (data.socialSupport < 5) {
    possibleDepressionTypes.push('Isolation-Related Depression');
    recommendations.push('Seek support from friends, family, or support groups');
  }

  if (data.physicalActivity < 30) {
    recommendations.push('Increase physical activity to improve mood');
  }

  if (data.dietQuality < 5) {
    recommendations.push('Improve diet with nutrient-rich foods');
  }

  // Employment and life situation considerations
  switch(data.employmentStatus) {
    case 'unemployed':
      possibleDepressionTypes.push('Situational Depression');
      recommendations.push('Seek career counseling or job support services');
      break;
    case 'student':
      recommendations.push('Utilize campus mental health resources');
      break;
    case 'retired':
      recommendations.push('Engage in social and meaningful activities');
      break;
  }

  // Marital status considerations
  if (['divorced', 'widowed'].includes(data.maritalStatus)) {
    recommendations.push('Consider grief counseling or support groups');
  }

  // Genetic and medical history
  if (data.geneticHistory) {
    recommendations.push('Consider professional mental health consultation');
  }

  if (data.medicalConditions && data.medicalConditions.length > 0) {
    recommendations.push('Consult healthcare provider about potential depression triggers');
  }

  // Final recommendations based on risk level
  if (riskLevel === 'high') {
    recommendations.push('Strongly recommend consulting a mental health professional');
  } else if (riskLevel === 'moderate') {
    recommendations.push('Consider professional mental health support');
  }

  return {
    riskLevel,
    possibleDepressionTypes: [...new Set(possibleDepressionTypes)],
    recommendations: [...new Set(recommendations)]
  };
}

export default router;