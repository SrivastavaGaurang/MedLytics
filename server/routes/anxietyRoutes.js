// routes/anxietyRoutes.js — Analysis only, no database (Firebase handles persistence)
import express from 'express';

const router = express.Router();

// POST /api/anxiety/analyze — Run analysis, return result (no DB save)
router.post('/analyze', async (req, res) => {
  try {
    const {
      authId, school_year, age, gender, bmi, who_bmi,
      phq_score, anxiousness, suicidal, epworth_score
    } = req.body;

    const anxietySeverity = determineAnxietySeverity(phq_score, anxiousness, suicidal);
    const anxietyType = determineAnxietyType(phq_score, anxiousness, epworth_score);
    const keyFactors = determineKeyFactors(phq_score, anxiousness, suicidal, epworth_score, bmi);
    const recommendations = generateRecommendations(anxietySeverity, anxietyType, keyFactors);

    res.status(200).json({
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
        recommendations,
      },
    });
  } catch (err) {
    console.error('Error analyzing anxiety data:', err);
    res.status(500).json({ message: 'Server error processing anxiety data', error: err.message });
  }
});

// ─── Helper functions ────────────────────────────────────────────────────────

function determineAnxietySeverity(phq_score, anxiousness, suicidal) {
  if (suicidal) return 'Severe';
  if (phq_score >= 20) return 'Severe';
  if (phq_score >= 15) return 'Moderate-Severe';
  if (phq_score >= 10) return 'Moderate';
  if (phq_score >= 5) return 'Mild';
  if (anxiousness && phq_score < 5) return 'Mild';
  return 'Minimal';
}

function determineAnxietyType(phq_score, anxiousness, epworth_score) {
  if (phq_score >= 15 && anxiousness) {
    return { type: 'Generalized Anxiety / High Distress', description: 'Significant indicators of both anxiety and depressive symptoms, suggesting a generalized high-stress state.' };
  } else if (epworth_score >= 15 && anxiousness) {
    return { type: 'Sleep-Related Anxiety', description: 'Anxiety appears closely linked to sleep deprivation or sleep disorders.' };
  } else if (phq_score >= 10 && !anxiousness) {
    return { type: 'Depressive Mood with Anxiety', description: 'Primary symptoms suggest low mood, but anxiety may be present as a secondary factor.' };
  } else if (anxiousness) {
    return { type: 'Situational Anxiety', description: 'You report feeling anxious, but clinical scores are lower, suggesting this may be reactive to current life events.' };
  }
  return { type: 'Low Anxiety', description: 'No significant anxiety patterns detected.' };
}

function determineKeyFactors(phq_score, anxiousness, suicidal, epworth_score, bmi) {
  const factors = [];
  if (phq_score >= 10) factors.push({ name: 'Depression', impact: phq_score >= 15 ? 'High' : 'Medium' });
  if (anxiousness) factors.push({ name: 'Excessive Worry', impact: 'High' });
  if (suicidal) factors.push({ name: 'Suicidal Ideation', impact: 'High' });
  if (epworth_score >= 10) factors.push({ name: 'Sleep Disturbance', impact: epworth_score >= 15 ? 'High' : 'Medium' });
  if (bmi < 18.5 || bmi >= 30) factors.push({ name: 'Physical Health', impact: 'Medium' });
  return factors;
}

function generateRecommendations(anxietySeverity, anxietyType, keyFactors) {
  const recommendations = [];
  recommendations.push('Practice regular mindfulness meditation to reduce stress and anxiety levels.');
  recommendations.push('Maintain a consistent sleep schedule and aim for 7-9 hours of quality sleep.');
  if (anxietySeverity === 'Severe') {
    recommendations.push('Seek immediate professional help from a mental health specialist.');
    recommendations.push('Consider therapy options like Cognitive Behavioral Therapy (CBT).');
  } else if (anxietySeverity === 'Moderate') {
    recommendations.push('Consult with a mental health professional for a comprehensive evaluation.');
    recommendations.push('Regular exercise can significantly reduce anxiety symptoms.');
  } else if (anxietySeverity === 'Mild') {
    recommendations.push('Deep breathing exercises and progressive muscle relaxation can help manage mild anxiety symptoms.');
    recommendations.push('Consider keeping a journal to identify anxiety triggers and patterns.');
  }
  if (keyFactors.some(f => f.name === 'Sleep Disturbance')) {
    recommendations.push('Limit screen time before bed and create a relaxing bedtime routine.');
  }
  if (keyFactors.some(f => f.name === 'Depression')) {
    recommendations.push('Ensure regular social connection and support.');
  }
  if (keyFactors.some(f => f.name === 'Suicidal Ideation')) {
    recommendations.push('Create a safety plan with emergency contacts and resources such as the National Suicide Prevention Lifeline (988).');
  }
  return recommendations;
}

export default router;