// routes/anxietyRoutes.js
import express from 'express';
import AnxietyAnalysis from '../models/AnxietyAnalysis.js';

const router = express.Router();

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

    // Analyze anxiety based on provided data
    const anxietySeverity = determineAnxietySeverity(phq_score, anxiousness, suicidal);
    const anxietyType = determineAnxietyType(phq_score, anxiousness, epworth_score);
    const keyFactors = determineKeyFactors(phq_score, anxiousness, suicidal, epworth_score, bmi);
    const recommendations = generateRecommendations(anxietySeverity, anxietyType, keyFactors);

    // Create new anxiety analysis record
    const newAnalysis = new AnxietyAnalysis({
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

// Route to get anxiety history for a user
router.get('/history', async (req, res) => {
  try {
    const authId = req.query.authId; // Get authId from query params

    if (!authId) {
      return res.status(400).json({ message: 'Auth ID required as query parameter' });
    }

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
  // PHQ-9 Scoring for Anxiety/Depression overlap
  if (suicidal) return 'Severe';

  if (phq_score >= 20) return 'Severe';
  if (phq_score >= 15) return 'Moderate-Severe';
  if (phq_score >= 10) return 'Moderate';
  if (phq_score >= 5) return 'Mild';

  // Fallback if score is low but user reports anxiousness
  if (anxiousness && phq_score < 5) return 'Mild';

  return 'Minimal';
}

// Determine anxiety type based on inputs
function determineAnxietyType(phq_score, anxiousness, epworth_score) {
  if (phq_score >= 15 && anxiousness) {
    return {
      type: 'Generalized Anxiety / High Distress',
      description: 'Significant indicators of both anxiety and depressive symptoms, suggesting a generalized high-stress state.'
    };
  } else if (epworth_score >= 15 && anxiousness) {
    return {
      type: 'Sleep-Related Anxiety',
      description: 'Anxiety appears closely linked to sleep deprivation or sleep disorders.'
    };
  } else if (phq_score >= 10 && !anxiousness) {
    return {
      type: 'Depressive Mood with Anxiety',
      description: 'Primary symptoms suggest low mood, but anxiety may be present as a secondary factor.'
    };
  } else if (anxiousness) {
    return {
      type: 'Situational Anxiety',
      description: 'You report feeling anxious, but clinical scores are lower, suggesting this may be reactive to current life events.'
    };
  } else {
    return {
      type: 'Low Anxiety',
      description: 'No significant anxiety patterns detected.'
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