// routes/depression.js
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
          name: 'Anonymous',
          email: `${authId}@auth0.com`,
          password: 'Auth0User'
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
// @access  Private (requires JWT auth)
router.get('/history', checkJwt, async (req, res) => {
  try {
    const authId = req.user.sub;
    
    const user = await User.findOne({ authId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const analyses = await DepressionAnalysis.find({ user: user._id }).sort({ date: -1 });
    res.json(analyses);
  } catch (err) {
    console.error('Error fetching depression history:', err.message);
    res.status(500).json({ 
      message: 'Server error fetching history',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Enhanced Depression analysis algorithm
function analyzeDepression(data) {
  let riskPoints = 0;
  let keyFactors = [];
  let recommendations = [];
  let depressionType = '';
  let depressionTypeDescription = '';

  // Risk factors analysis with detailed tracking
  if (data.stressLevel > 7) {
    riskPoints += 2;
    keyFactors.push({ name: 'High Stress Level', impact: 'High' });
  }
  
  if (data.sleepQuality < 4) {
    riskPoints += 2;
    keyFactors.push({ name: 'Poor Sleep Quality', impact: 'High' });
  }
  
  if (data.socialSupport < 4) {
    riskPoints += 2;
    keyFactors.push({ name: 'Limited Social Support', impact: 'High' });
  }
  
  if (data.physicalActivity < 30) {
    riskPoints += 1;
    keyFactors.push({ name: 'Low Physical Activity', impact: 'Moderate' });
  }
  
  if (data.dietQuality < 4) {
    riskPoints += 1;
    keyFactors.push({ name: 'Poor Diet Quality', impact: 'Moderate' });
  }
  
  if (data.geneticHistory) {
    riskPoints += 2;
    keyFactors.push({ name: 'Family History of Mental Health Issues', impact: 'High' });
  }
  
  // Age and gender factors
  if (data.age < 25 || data.age > 65) {
    riskPoints += 1;
    keyFactors.push({ name: 'Age Risk Factor', impact: 'Moderate' });
  }
  
  if (data.gender === 'female') {
    riskPoints += 1;
  }
  
  // Marital and employment status
  if (data.maritalStatus === 'divorced' || data.maritalStatus === 'widowed') {
    riskPoints += 1;
    keyFactors.push({ name: 'Marital Status Impact', impact: 'Moderate' });
  }
  
  if (data.employmentStatus === 'unemployed') {
    riskPoints += 2;
    keyFactors.push({ name: 'Unemployment Stress', impact: 'High' });
  }
  
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
    
    if (hasHighRiskCondition) {
      riskPoints += 2;
      keyFactors.push({ name: 'Medical Conditions', impact: 'High' });
    }
    
    if (data.medicalConditions.length >= 2) {
      riskPoints += 1;
    }
  }

  // Determine risk level and depression type
  let riskLevel = 'low';
  
  if (riskPoints >= 8) {
    riskLevel = 'high';
    depressionType = 'Major Depressive Episode Risk';
    depressionTypeDescription = 'You show multiple risk factors that may indicate a significant depression risk. Professional evaluation is strongly recommended.';
  } else if (riskPoints >= 4) {
    riskLevel = 'moderate';
    depressionType = 'Mild to Moderate Depression Risk';
    depressionTypeDescription = 'You have several risk factors that suggest you may be experiencing some depressive symptoms. Consider speaking with a healthcare provider.';
  } else {
    riskLevel = 'low';
    depressionType = 'Low Depression Risk';
    depressionTypeDescription = 'Your current risk factors suggest a lower likelihood of depression, but continue monitoring your mental health.';
  }

  // Generate personalized recommendations
  recommendations.push('Practice regular self-care activities that bring you joy and relaxation');
  recommendations.push('Maintain a consistent sleep schedule with 7-9 hours of sleep each night');
  
  if (data.stressLevel > 6) {
    recommendations.push('Incorporate stress management techniques such as meditation, deep breathing, or yoga');
    recommendations.push('Consider time management strategies to reduce daily stressors');
  }
  
  if (data.sleepQuality < 6) {
    recommendations.push('Improve sleep hygiene by limiting screen time before bed and creating a restful environment');
    recommendations.push('Establish a relaxing bedtime routine');
  }
  
  if (data.socialSupport < 6) {
    recommendations.push('Connect regularly with supportive friends and family, or consider joining support groups');
    recommendations.push('Consider volunteering or joining community activities to build social connections');
  }
  
  if (data.physicalActivity < 50) {
    recommendations.push('Gradually increase physical activity - aim for at least 150 minutes of moderate exercise per week');
    recommendations.push('Start with short walks and progressively increase activity duration');
  }
  
  if (data.dietQuality < 6) {
    recommendations.push('Focus on a balanced diet rich in vegetables, fruits, whole grains, and omega-3 fatty acids');
    recommendations.push('Consider consulting with a nutritionist for personalized dietary advice');
  }
  
  if (data.geneticHistory) {
    recommendations.push('Be aware of early warning signs of depression and maintain regular mental health check-ins');
  }
  
  if (riskLevel === 'high') {
    recommendations.push('Seek professional help from a mental health specialist immediately');
    recommendations.push('Consider therapy options such as cognitive behavioral therapy (CBT) which is effective for depression');
    recommendations.push('Discuss medication options with a psychiatrist if appropriate');
  } else if (riskLevel === 'moderate') {
    recommendations.push('Schedule an appointment with your healthcare provider to discuss your mental health');
    recommendations.push('Consider counseling or therapy as a preventive measure');
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