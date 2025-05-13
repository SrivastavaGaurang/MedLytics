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

// @route   POST api/depression/analyze
// @desc    Submit depression data for analysis
// @access  Public (authId required)
router.post(
  '/analyze',
  [
    check('authId', 'Auth ID is required').notEmpty(),
    check('school_year', 'School year is required').isNumeric(),
    check('age', 'Age is required').isNumeric(),
    check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
    check('bmi', 'BMI is required').isNumeric(),
    check('who_bmi', 'WHO BMI category is required').isIn(['Underweight', 'Normal', 'Overweight', 'Obese']),
    check('phq_score', 'PHQ score is required').isNumeric(),
    check('depressiveness', 'Depressiveness status is required').isBoolean(),
    check('suicidal', 'Suicidal status is required').isBoolean(),
    check('gad_score', 'GAD score is required').isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { authId, school_year, age, gender, bmi, who_bmi, phq_score, depressiveness, suicidal, gad_score } = req.body;

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
        school_year,
        age,
        gender,
        bmi,
        who_bmi,
        phq_score,
        depressiveness,
        suicidal,
        gad_score
      });

      const depressionAnalysis = new DepressionAnalysis({
        user: user._id,
        authId,
        school_year,
        age,
        gender,
        bmi,
        who_bmi,
        phq_score,
        depressiveness,
        suicidal,
        gad_score,
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

// Depression analysis algorithm (simulating the Python model logic)
function analyzeDepression(data) {
  // Determine depression severity based on PHQ-9 score
  let depressionSeverity;
  if (data.phq_score >= 20 || data.suicidal) {
    depressionSeverity = 'Severe';
  } else if (data.phq_score >= 15) {
    depressionSeverity = 'Moderate';
  } else if (data.phq_score >= 5) {
    depressionSeverity = 'Mild';
  } else {
    depressionSeverity = 'Minimal';
  }

  // Determine depression type based on symptoms
  let depressionType, depressionTypeDescription;
  if (data.phq_score >= 15 && data.depressiveness && data.gad_score >= 10) {
    depressionType = 'Major Depressive Disorder with Anxiety';
    depressionTypeDescription = 'Depression with significant anxiety components requiring comprehensive treatment.';
  } else if (data.phq_score >= 15 && data.depressiveness) {
    depressionType = 'Major Depressive Disorder';
    depressionTypeDescription = 'Severe depression that significantly impacts daily functioning.';
  } else if (data.phq_score >= 10 && data.gad_score >= 15) {
    depressionType = 'Anxiety with Depressive Features';
    depressionTypeDescription = 'Primary anxiety disorder with secondary depression symptoms.';
  } else if (data.phq_score >= 10) {
    depressionType = 'Moderate Depression';
    depressionTypeDescription = 'Depression symptoms that cause noticeable impairment in functioning.';
  } else {
    depressionType = 'Mild Depressive Symptoms';
    depressionTypeDescription = 'Mild symptoms that may not meet clinical threshold for a disorder.';
  }

  // Determine key factors
  const keyFactors = [];
  
  if (data.phq_score >= 10) {
    keyFactors.push({
      name: 'Depressed Mood',
      impact: data.phq_score >= 15 ? 'High' : 'Medium'
    });
  }
  
  if (data.depressiveness) {
    keyFactors.push({
      name: 'Persistent Sadness',
      impact: 'High'
    });
  }
  
  if (data.suicidal) {
    keyFactors.push({
      name: 'Suicidal Ideation',
      impact: 'High'
    });
  }
  
  if (data.gad_score >= 10) {
    keyFactors.push({
      name: 'Anxiety',
      impact: data.gad_score >= 15 ? 'High' : 'Medium'
    });
  }
  
  if (data.bmi < 18.5 || data.bmi >= 30) {
    keyFactors.push({
      name: 'Physical Health',
      impact: 'Medium'
    });
  }

  // Determine risk level
  let riskLevel = 'low';
  if (data.suicidal || data.phq_score >= 20) {
    riskLevel = 'high';
  } else if (data.phq_score >= 15 || (data.phq_score >= 10 && data.depressiveness)) {
    riskLevel = 'moderate';
  }

  // Generate recommendations
  const recommendations = [];
  
  // Base recommendations
  recommendations.push('Practice self-care activities that bring you joy and relaxation');
  recommendations.push('Maintain a consistent sleep schedule with 7-9 hours of sleep each night');
  
  // Severity-based recommendations
  if (depressionSeverity === 'Severe') {
    recommendations.push('Seek immediate professional help from a mental health specialist');
    recommendations.push('Consider both therapy and medication options, which work best in combination for severe depression');
    recommendations.push('Establish a safety plan with trusted individuals and emergency contacts');
  } else if (depressionSeverity === 'Moderate') {
    recommendations.push('Consult with a mental health professional for a comprehensive evaluation');
    recommendations.push('Engage in regular physical activity - even short walks can improve mood');
    recommendations.push('Practice mindfulness meditation to reduce rumination and negative thoughts');
  } else if (depressionSeverity === 'Mild') {
    recommendations.push('Consider talking to a counselor or therapist about your feelings');
    recommendations.push('Establish a daily routine with meaningful activities');
    recommendations.push('Connect regularly with supportive friends and family');
  }
  
  // Factor-specific recommendations
  if (keyFactors.some(f => f.name === 'Anxiety')) {
    recommendations.push('Practice deep breathing exercises when feeling overwhelmed');
    recommendations.push('Limit caffeine and alcohol which can worsen anxiety symptoms');
  }
  
  if (keyFactors.some(f => f.name === 'Physical Health')) {
    recommendations.push('Consult with a healthcare provider about a balanced nutrition plan');
    recommendations.push('Set small, achievable fitness goals to improve overall wellbeing');
  }
  
  if (keyFactors.some(f => f.name === 'Suicidal Ideation')) {
    recommendations.push('Remove access to means of self-harm and ensure regular check-ins with mental health professionals');
    recommendations.push('Contact the National Suicide Prevention Lifeline at 988 if experiencing a crisis');
  }

  return {
    depressionSeverity,
    depressionType,
    depressionTypeDescription,
    keyFactors,
    riskLevel,
    recommendations: [...new Set(recommendations)] // Remove duplicates
  };
}

export default router;