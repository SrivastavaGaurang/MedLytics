// routes/depressionRoutes.js
import express from 'express';
import { check, validationResult } from 'express-validator';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

// Import models
import DepressionAnalysis from '../models/DepressionAnalysis.js';
import User from '../models/User.js';

const router = express.Router();

// Setup Auth0 authentication middleware (optional, can be used for protected routes)
const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN'}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE || 'YOUR_API_IDENTIFIER',
  issuer: `https://${process.env.AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN'}/`,
  algorithms: ['RS256']
});

// @route   POST api/depression/predict
// @desc    Submit depression data for analysis
// @access  Public (authId required)
router.post(
  '/predict',
  [
    check('authId', 'Auth ID is required').notEmpty(),
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

      await depressionAnalysis.save();
      res.json(depressionAnalysis);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/depression/results/:id
// @desc    Get depression analysis result by ID
// @access  Public (no auth required for now, but you can add authentication later)
router.get('/results/:id', async (req, res) => {
  try {
    const analysis = await DepressionAnalysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Depression analysis result not found' });
    }
    
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Depression analysis result not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/depression/history
// @desc    Get depression analysis history for a user
// @access  Private (requires JWT auth)
router.get('/history', checkJwt, async (req, res) => {
  try {
    const authId = req.user.sub; // Get Auth0 ID from JWT
    
    // Find user first
    const user = await User.findOne({ authId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const analyses = await DepressionAnalysis.find({ user: user._id }).sort({ date: -1 });
    res.json(analyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Depression analysis algorithm
function analyzeDepression(data) {
  // Calculate risk level based on parameters
  let riskPoints = 0;
  let possibleDepressionTypes = [];
  let recommendations = [];

  // Risk factors analysis
  if (data.stressLevel > 7) riskPoints += 2;
  if (data.sleepQuality < 4) riskPoints += 2;
  if (data.socialSupport < 4) riskPoints += 2;
  if (data.physicalActivity < 30) riskPoints += 1;
  if (data.dietQuality < 4) riskPoints += 1;
  if (data.geneticHistory) riskPoints += 2;
  
  // Age and gender factors
  if (data.age < 25 || data.age > 65) riskPoints += 1;
  if (data.gender === 'female') riskPoints += 1; // Statistically higher rates
  
  // Marital and employment status
  if (data.maritalStatus === 'divorced' || data.maritalStatus === 'widowed') riskPoints += 1;
  if (data.employmentStatus === 'unemployed') riskPoints += 2;
  
  // Medical conditions impact
  if (data.medicalConditions && data.medicalConditions.length > 0) {
    const highRiskConditions = [
      'hypothyroidism', 'chronic pain', 'fibromyalgia', 'chronic fatigue', 
      'autoimmune', 'cancer', 'heart disease', 'diabetes', 'parkinsons', 'alzheimers'
    ];
    
    const hasHighRiskCondition = data.medicalConditions.some(condition => 
      highRiskConditions.some(highRisk => 
        condition.toLowerCase().includes(highRisk.toLowerCase())
      )
    );
    
    if (hasHighRiskCondition) riskPoints += 2;
    if (data.medicalConditions.length >= 2) riskPoints += 1;
  }

  // Determine risk level
  let riskLevel = 'low';
  if (riskPoints >= 8) {
    riskLevel = 'high';
  } else if (riskPoints >= 4) {
    riskLevel = 'moderate';
  }

  // Determine depression types
  if (riskPoints >= 8) {
    possibleDepressionTypes.push('Major Depressive Disorder');
    if (data.stressLevel > 7) {
      possibleDepressionTypes.push('Stress-Induced Depression');
    }
  } else if (riskPoints >= 4) {
    possibleDepressionTypes.push('Mild to Moderate Depression');
    if (data.socialSupport < 4) {
      possibleDepressionTypes.push('Social Isolation-Related Depression');
    }
  } else {
    possibleDepressionTypes.push('Minimal Depression Risk');
  }

  // Add specific recommendations
  recommendations.push('Practice regular self-care activities that bring you joy and relaxation');
  recommendations.push('Maintain a consistent sleep schedule with 7-9 hours of sleep each night');
  
  if (data.stressLevel > 6) {
    recommendations.push('Incorporate stress management techniques such as meditation, deep breathing, or yoga');
  }
  
  if (data.sleepQuality < 6) {
    recommendations.push('Improve sleep hygiene by limiting screen time before bed and creating a restful environment');
  }
  
  if (data.socialSupport < 6) {
    recommendations.push('Connect regularly with supportive friends and family, or consider joining support groups');
  }
  
  if (data.physicalActivity < 50) {
    recommendations.push('Gradually increase physical activity - aim for at least 150 minutes of moderate exercise per week');
  }
  
  if (data.dietQuality < 6) {
    recommendations.push('Focus on a balanced diet rich in vegetables, fruits, whole grains, and omega-3 fatty acids');
  }
  
  if (riskLevel === 'high') {
    recommendations.push('Consider seeking professional help from a mental health specialist');
    recommendations.push('Explore therapy options such as cognitive behavioral therapy (CBT) which is effective for depression');
  } else if (riskLevel === 'moderate') {
    recommendations.push('Consider talking to a healthcare provider about your mental health concerns');
  }

  return {
    riskLevel,
    possibleDepressionTypes,
    recommendations
  };
}

export default router;