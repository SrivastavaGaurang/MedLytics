// routes/depression.js — Analysis only, no database (Firebase handles persistence)
import express from 'express';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// POST /api/depression/predict — Run analysis, return result (no DB save)
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
    check('geneticHistory', 'Genetic history is required').isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        authId, age, gender, maritalStatus, employmentStatus,
        stressLevel, sleepQuality, socialSupport, physicalActivity,
        dietQuality, geneticHistory, medicalConditions,
      } = req.body;

      const result = analyzeDepression({
        age, gender, maritalStatus, employmentStatus,
        stressLevel, sleepQuality, socialSupport, physicalActivity,
        dietQuality, geneticHistory, medicalConditions,
      });

      res.json({
        authId,
        age, gender, maritalStatus, employmentStatus,
        stressLevel, sleepQuality, socialSupport, physicalActivity,
        dietQuality, geneticHistory, medicalConditions,
        result,
      });
    } catch (err) {
      console.error('Error in depression prediction:', err.message);
      res.status(500).json({
        message: 'Server error during depression analysis',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      });
    }
  }
);

// ─── Depression analysis algorithm ──────────────────────────────────────────

function analyzeDepression(data) {
  let totalScore = 0;
  const W_STRESS = 30, W_SLEEP = 25, W_SOCIAL = 15, W_PHYSICAL = 10, W_DIET = 10;
  const keyFactors = [], recommendations = [];

  const stressScore = (data.stressLevel / 10) * W_STRESS;
  totalScore += stressScore;
  if (data.stressLevel >= 8) keyFactors.push({ name: 'Severe Chronic Stress', impact: 'High' });
  else if (data.stressLevel >= 6) keyFactors.push({ name: 'Elevated Stress Levels', impact: 'Moderate' });

  const sleepScore = ((11 - data.sleepQuality) / 10) * W_SLEEP;
  totalScore += sleepScore;
  if (data.sleepQuality <= 3) keyFactors.push({ name: 'Severe Sleep Disturbance', impact: 'High' });
  else if (data.sleepQuality <= 5) keyFactors.push({ name: 'Poor Sleep Quality', impact: 'Moderate' });

  const supportScore = ((11 - data.socialSupport) / 10) * W_SOCIAL;
  totalScore += supportScore;
  if (data.socialSupport <= 3) keyFactors.push({ name: 'Social Isolation', impact: 'High' });

  totalScore += ((100 - data.physicalActivity) / 100) * W_PHYSICAL;
  totalScore += ((11 - data.dietQuality) / 10) * W_DIET;

  let riskMultiplier = 0;
  if (data.geneticHistory) { riskMultiplier += 15; keyFactors.push({ name: 'Family History', impact: 'High' }); }
  if (data.medicalConditions && data.medicalConditions.length > 0) riskMultiplier += 10;

  let falsePositiveFlag = false;
  if (data.stressLevel < 4 && data.sleepQuality > 7 && riskMultiplier === 0 && totalScore > 40) {
    totalScore *= 0.6;
    falsePositiveFlag = true;
  }
  totalScore += Math.min(25, riskMultiplier);

  let riskLevel = 'low';
  let depressionType = 'Low Probability';
  let depressionTypeDescription = 'Your profile suggests a low risk of depression. Maintain your healthy habits.';

  if (totalScore >= 75) {
    riskLevel = 'high'; depressionType = 'High Risk Profile';
    depressionTypeDescription = 'Strong indicators of depressive risk detected. Immediate professional consultation is recommended.';
  } else if (totalScore >= 45) {
    riskLevel = 'moderate'; depressionType = 'Moderate Risk Profile';
    depressionTypeDescription = 'You show several risk factors. Early intervention and lifestyle adjustments are highly advisable.';
  }

  if (riskLevel !== 'low') {
    if (data.stressLevel >= 8 && data.sleepQuality <= 4) {
      depressionType = 'Burnout / Stress-Induced';
      depressionTypeDescription = 'Symptoms appear driven by exhaustion and chronic stress.';
    } else if (data.socialSupport <= 3) {
      depressionType = 'Loneliness / Socially-Driven';
      depressionTypeDescription = 'Lack of social connection appears to be a primary driver.';
    }
  }

  if (riskLevel === 'high') {
    recommendations.push('Consult a mental health professional immediately.');
    recommendations.push('Reach out to a trusted person to share your feelings.');
  } else if (riskLevel === 'moderate') {
    recommendations.push('Consider talking to a counselor to prevent symptoms from worsening.');
    recommendations.push('Review your work-life balance and prioritize rest.');
  }

  return { riskLevel, depressionType, depressionTypeDescription, keyFactors, recommendations };
}

export default router;