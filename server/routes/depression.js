// routes/depression.js
import express from 'express';
import { check, validationResult } from 'express-validator';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

// Import models
import DepressionAnalysis from '../models/DepressionAnalysis.js';
import User from '../models/User.js';

const router = express.Router();

// Setup Auth0 authentication middleware
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

// Enhanced Depression analysis algorithm with weighted scoring
function analyzeDepression(data) {
  let totalScore = 0;
  let maxScore = 100; // Normalized scale
  const keyFactors = [];
  const recommendations = [];

  // 1. Stress Level (Weight: 25%)
  // Scale 1-10: 10 is worst
  const stressScore = (data.stressLevel / 10) * 25;
  totalScore += stressScore;

  if (data.stressLevel >= 8) {
    keyFactors.push({ name: 'Severe Chronic Stress', impact: 'High' });
  } else if (data.stressLevel >= 6) {
    keyFactors.push({ name: 'Elevated Stress Levels', impact: 'Moderate' });
  }

  // 2. Sleep Quality (Weight: 20%)
  // Scale 1-10: 1 is worst (inverse)
  const sleepScore = ((11 - data.sleepQuality) / 10) * 20;
  totalScore += sleepScore;

  if (data.sleepQuality <= 3) {
    keyFactors.push({ name: 'Severe Sleep Disturbance', impact: 'High' });
  } else if (data.sleepQuality <= 5) {
    keyFactors.push({ name: 'Poor Sleep Quality', impact: 'Moderate' });
  }

  // 3. Social Support (Weight: 15%)
  // Scale 1-10: 1 is worst (inverse)
  const supportScore = ((11 - data.socialSupport) / 10) * 15;
  totalScore += supportScore;

  if (data.socialSupport <= 3) {
    keyFactors.push({ name: 'Social Isolation', impact: 'High' });
  } else if (data.socialSupport <= 5) {
    keyFactors.push({ name: 'Limited Social Support', impact: 'Moderate' });
  }

  // 4. Physical Activity (Weight: 10%)
  // Scale 0-100: 0 is worst (inverse)
  const activityScore = ((100 - data.physicalActivity) / 100) * 10;
  totalScore += activityScore;

  if (data.physicalActivity < 20) {
    keyFactors.push({ name: 'Sedentary Lifestyle', impact: 'Moderate' });
  }

  // 5. Diet Quality (Weight: 10%)
  // Scale 1-10: 1 is worst (inverse)
  const dietScore = ((11 - data.dietQuality) / 10) * 10;
  totalScore += dietScore;

  // 6. Risk Multipliers (Genetic/Medical/Life Events) - Additive up to 20%
  let riskMultiplier = 0;

  if (data.geneticHistory) {
    riskMultiplier += 10;
    keyFactors.push({ name: 'Family History', impact: 'High' });
  }

  if (data.employmentStatus === 'unemployed') {
    riskMultiplier += 5;
    keyFactors.push({ name: 'Unemployment Stress', impact: 'Moderate' });
  }

  if (data.maritalStatus === 'divorced' || data.maritalStatus === 'widowed') {
    riskMultiplier += 5;
    keyFactors.push({ name: 'Recent Life Changes', impact: 'Moderate' });
  }

  if (data.medicalConditions && data.medicalConditions.length > 0) {
    const highRiskConditions = ['chronic pain', 'hypothyroidism', 'fibromyalgia', 'autoimmune'];
    const hasHighRisk = data.medicalConditions.some(c => highRiskConditions.some(h => c.toLowerCase().includes(h)));

    if (hasHighRisk) {
      riskMultiplier += 10;
      keyFactors.push({ name: 'Chronic Health Condition', impact: 'High' });
    } else {
      riskMultiplier += 5;
    }
  }

  totalScore += Math.min(20, riskMultiplier);

  // Determine Risk Level
  let riskLevel = 'low';
  let depressionType = 'Low Risk';
  let depressionTypeDescription = 'Your profile suggests a low risk of depression. Maintain your healthy habits.';

  if (totalScore >= 70) {
    riskLevel = 'high';
    depressionType = 'High Risk Profile';
    depressionTypeDescription = 'Your combination of stress, sleep issues, and other factors indicates a high risk for depression. Professional evaluation is strongly recommended.';
  } else if (totalScore >= 40) {
    riskLevel = 'moderate';
    depressionType = 'Moderate Risk Profile';
    depressionTypeDescription = 'You have several risk factors that may contribute to depressive symptoms. Proactive lifestyle changes and monitoring are advised.';
  }

  // Infer Specific Type/Pattern based on dominant factors
  if (riskLevel !== 'low') {
    if (data.stressLevel >= 8 && data.sleepQuality <= 4) {
      depressionType = 'Stress-Induced Risk';
      depressionTypeDescription = 'Your symptoms appear strongly linked to chronic stress and sleep deprivation, creating a cycle that affects your mood.';
    } else if (data.socialSupport <= 3 && (data.maritalStatus === 'divorced' || data.maritalStatus === 'widowed')) {
      depressionType = 'Situational/Social Risk';
      depressionTypeDescription = 'Your risk appears connected to social isolation or recent life changes, highlighting the need for community and support.';
    } else if (data.geneticHistory && riskMultiplier >= 15) {
      depressionType = 'Biological/Genetic Risk';
      depressionTypeDescription = 'Your family history and medical factors suggest a biological predisposition that requires careful monitoring.';
    }
  }

  // Generate Recommendations
  if (riskLevel === 'high') {
    recommendations.push('Consult a mental health professional (psychiatrist or psychologist) for a comprehensive evaluation.');
    recommendations.push('If you have thoughts of self-harm, contact emergency services or a crisis hotline immediately.');
    recommendations.push('Consider evidence-based therapies like CBT to address negative thought patterns.');
  } else if (riskLevel === 'moderate') {
    recommendations.push('Schedule a check-up with your primary care physician to discuss your mental well-being.');
    recommendations.push('Start a daily mood journal to track triggers and patterns.');
  }

  if (data.sleepQuality < 6) {
    recommendations.push('Prioritize sleep hygiene: consistent schedule, dark room, and no screens before bed.');
  }
  if (data.stressLevel > 6) {
    recommendations.push('Incorporate daily stress reduction techniques like mindfulness meditation or deep breathing.');
  }
  if (data.socialSupport < 5) {
    recommendations.push('Reach out to a trusted friend or family member this week, or consider joining a support group.');
  }
  if (data.physicalActivity < 40) {
    recommendations.push('Aim for 30 minutes of moderate exercise (like brisk walking) at least 5 days a week.');
  }
  if (data.dietQuality < 5) {
    recommendations.push('Focus on a balanced diet rich in omega-3s, vegetables, and whole grains to support brain health.');
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