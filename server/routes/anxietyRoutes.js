// routes/anxietyRoutes.js - Fixed version
import express from 'express';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import AnxietyAnalysis from '../models/AnxietyAnalysis.js';
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

// Route to analyze anxiety data and store results
router.post('/analyze', async (req, res) => {
  try {
    const {
      authId,
      school_year,
      age,
      gender,
      bmi,
      who_bmi,
      phq_score,
      anxiousness,
      suicidal,
      epworth_score
    } = req.body;

    if (!authId) {
      return res.status(400).json({ message: 'Auth ID is required' });
    }

    // Try to find existing user
    let user = await User.findOne({ authId });

    // If not found, create a new user (similar to sleep.js)
    if (!user) {
      user = new User({
        authId,
        name: 'Anonymous', // Optional: replace with name from Auth0 if passed later
        email: `${authId}@auth0.com`, // Fake/placeholder email
        password: 'Auth0User' // Dummy, since Auth0 manages auth
      });

      await user.save();
    }

    // Analyze anxiety based on provided data
    const anxietySeverity = determineAnxietySeverity(phq_score, anxiousness, suicidal);
    const anxietyType = determineAnxietyType(phq_score, anxiousness, epworth_score);
    const keyFactors = determineKeyFactors(phq_score, anxiousness, suicidal, epworth_score, bmi);
    const recommendations = generateRecommendations(anxietySeverity, anxietyType, keyFactors);

    // Create new anxiety analysis record
    const newAnalysis = new AnxietyAnalysis({
      user: user._id, // Added this line to link to user
      authId,
      school_year,
      age,
      gender,
      bmi,
      who_bmi,
      phq_score,
      anxiousness,
      suicidal,
      epworth_score,
      result: {
        anxietySeverity,
        anxietyType: anxietyType.type,
        anxietyTypeDescription: anxietyType.description,
        keyFactors,
        recommendations
      }
    });

    // Save to database
    const savedAnalysis = await newAnalysis.save();
    res.status(201).json(savedAnalysis);
  } catch (err) {
    console.error('Error analyzing anxiety data:', err);
    res.status(500).json({ message: 'Server error processing anxiety data', error: err.message });
  }
});

// Route to get a specific anxiety analysis result
router.get('/results/:id', async (req, res) => {
  try {
    const analysis = await AnxietyAnalysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Anxiety analysis not found' });
    }
    
    res.json(analysis);
  } catch (err) {
    console.error('Error fetching anxiety result:', err);
    res.status(500).json({ message: 'Server error fetching anxiety result' });
  }
});

// Route to get anxiety history for a user (requires authentication)
router.get('/history', checkJwt, async (req, res) => {
  try {
    const authId = req.user.sub; // Get Auth0 ID from JWT
    
    const analyses = await AnxietyAnalysis.find({ authId })
      .sort({ date: -1 }); // Sort by date, newest first
    
    res.json(analyses);
  } catch (err) {
    console.error('Error fetching anxiety history:', err);
    res.status(500).json({ message: 'Server error fetching anxiety history' });
  }
});

// Helper functions for anxiety analysis

// Determine anxiety severity based on inputs
function determineAnxietySeverity(phq_score, anxiousness, suicidal) {
  if (suicidal || phq_score >= 20) {
    return 'Severe';
  } else if (phq_score >= 15 || (phq_score >= 10 && anxiousness)) {
    return 'Moderate';
  } else if (phq_score >= 5 || anxiousness) {
    return 'Mild';
  } else {
    return 'Minimal';
  }
}

// Determine anxiety type based on inputs
function determineAnxietyType(phq_score, anxiousness, epworth_score) {
  if (phq_score >= 15 && anxiousness) {
    return {
      type: 'Generalized Anxiety Disorder',
      description: 'Characterized by persistent and excessive worry about various things.'
    };
  } else if (epworth_score >= 15 && anxiousness) {
    return {
      type: 'Anxiety with Sleep Disturbance',
      description: 'Anxiety that significantly impacts sleep quality and causes daytime sleepiness.'
    };
  } else if (phq_score >= 10 && !anxiousness) {
    return {
      type: 'Depression with Anxiety Features',
      description: 'Primary depression symptoms with secondary anxiety manifestations.'
    };
  } else if (anxiousness) {
    return {
      type: 'Mild Anxiety',
      description: 'Periodic worrying that may not meet the threshold for a clinical disorder.'
    };
  } else {
    return {
      type: 'Subclinical Stress',
      description: 'Normal stress response without significant anxiety features.'
    };
  }
}

// Determine key factors contributing to anxiety
function determineKeyFactors(phq_score, anxiousness, suicidal, epworth_score, bmi) {
  const factors = [];
  
  if (phq_score >= 10) {
    factors.push({
      name: 'Depression',
      impact: phq_score >= 15 ? 'High' : 'Medium'
    });
  }
  
  if (anxiousness) {
    factors.push({
      name: 'Excessive Worry',
      impact: 'High'
    });
  }
  
  if (suicidal) {
    factors.push({
      name: 'Suicidal Ideation',
      impact: 'High'
    });
  }
  
  if (epworth_score >= 10) {
    factors.push({
      name: 'Sleep Disturbance',
      impact: epworth_score >= 15 ? 'High' : 'Medium'
    });
  }
  
  if (bmi < 18.5 || bmi >= 30) {
    factors.push({
      name: 'Physical Health',
      impact: 'Medium'
    });
  }
  
  return factors;
}

// Generate recommendations based on analysis
function generateRecommendations(anxietySeverity, anxietyType, keyFactors) {
  const recommendations = [];
  
  // Basic recommendations for everyone
  recommendations.push('Practice regular mindfulness meditation to reduce stress and anxiety levels.');
  recommendations.push('Maintain a consistent sleep schedule and aim for 7-9 hours of quality sleep.');
  
  // Severity-based recommendations
  if (anxietySeverity === 'Severe') {
    recommendations.push('Seek immediate professional help from a mental health specialist.');
    recommendations.push('Consider therapy options like Cognitive Behavioral Therapy (CBT) which is highly effective for anxiety disorders.');
  } else if (anxietySeverity === 'Moderate') {
    recommendations.push('Consult with a mental health professional for a comprehensive evaluation.');
    recommendations.push('Regular exercise can significantly reduce anxiety symptoms - aim for 30 minutes of moderate activity most days.');
  } else if (anxietySeverity === 'Mild') {
    recommendations.push('Deep breathing exercises and progressive muscle relaxation can help manage mild anxiety symptoms.');
    recommendations.push('Consider keeping a journal to identify anxiety triggers and patterns.');
  }
  
  // Factor-specific recommendations
  if (keyFactors.some(f => f.name === 'Sleep Disturbance')) {
    recommendations.push('Limit screen time before bed and create a relaxing bedtime routine to improve sleep quality.');
    recommendations.push('Avoid caffeine in the afternoon and evening.');
  }
  
  if (keyFactors.some(f => f.name === 'Depression')) {
    recommendations.push('Ensure regular social connection and support, which is crucial for managing both depression and anxiety.');
  }
  
  if (keyFactors.some(f => f.name === 'Physical Health')) {
    recommendations.push('Consult with a healthcare provider about a balanced nutrition plan to support mental health.');
  }
  
  if (keyFactors.some(f => f.name === 'Suicidal Ideation')) {
    recommendations.push('Create a safety plan with emergency contacts and resources such as the National Suicide Prevention Lifeline (988).');
    recommendations.push('Remove access to means of self-harm and ensure regular check-ins with mental health professionals.');
  }
  
  return recommendations;
}

export default router;