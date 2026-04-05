// routes/bmi.js — Analysis only, no database (Firebase handles persistence)
import express from 'express';

const router = express.Router();

// POST /api/bmi/analyze — Run analysis, return result (no DB save)
router.post('/analyze', async (req, res) => {
  try {
    const {
      authId, age, gender, height, weight, sleepDuration,
      qualityOfSleep, physicalActivityLevel, stressLevel,
      bloodPressure, heartRate, dailySteps,
    } = req.body;

    if (!age || !gender || !height || !weight || !sleepDuration || !qualityOfSleep ||
      !physicalActivityLevel || !stressLevel || !bloodPressure || !heartRate || !dailySteps) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const heightInMeters = height / 100;
    const calculatedBMI = weight / (heightInMeters * heightInMeters);

    const predictedCategory = determineBMICategory(calculatedBMI);
    const healthRisk = determineHealthRisk(calculatedBMI, age, bloodPressure, physicalActivityLevel);
    const keyFactors = determineKeyFactors(calculatedBMI, age, sleepDuration, qualityOfSleep, physicalActivityLevel, stressLevel, bloodPressure, heartRate, dailySteps);
    const recommendations = generateRecommendations(predictedCategory, healthRisk, keyFactors);
    const explanation = generateExplanation(predictedCategory, calculatedBMI, healthRisk);
    const confidence = calculateConfidence(keyFactors);

    res.status(200).json({
      authId, age, gender, height, weight, sleepDuration, qualityOfSleep,
      physicalActivityLevel, stressLevel, bloodPressure, heartRate, dailySteps,
      result: {
        calculatedBMI: Math.round(calculatedBMI * 100) / 100,
        predictedCategory, healthRisk, explanation, keyFactors, recommendations, confidence,
      },
    });
  } catch (err) {
    console.error('Error analyzing BMI data:', err);
    res.status(500).json({ message: 'Server error processing BMI data', error: err.message });
  }
});

// ─── Helper functions ────────────────────────────────────────────────────────

function determineBMICategory(bmi) {
  if (bmi < 16) return 'Severe Thinness';
  if (bmi < 17) return 'Moderate Thinness';
  if (bmi < 18.5) return 'Mild Thinness';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III';
}

function determineHealthRisk(bmi, age, bloodPressure, physicalActivityLevel) {
  let riskScore = 0;
  if (bmi < 18.5) riskScore += 2;
  else if (bmi >= 25 && bmi < 30) riskScore += 1;
  else if (bmi >= 30 && bmi < 35) riskScore += 2;
  else if (bmi >= 35 && bmi < 40) riskScore += 3;
  else if (bmi >= 40) riskScore += 4;
  if (age >= 65) riskScore += 2;
  else if (age >= 50) riskScore += 1;
  if (bloodPressure.systolic >= 160 || bloodPressure.diastolic >= 100) riskScore += 4;
  else if (bloodPressure.systolic >= 140 || bloodPressure.diastolic >= 90) riskScore += 3;
  else if (bloodPressure.systolic >= 130 || bloodPressure.diastolic >= 80) riskScore += 2;
  else if (bloodPressure.systolic >= 120) riskScore += 1;
  if (physicalActivityLevel >= 70) riskScore -= 2;
  else if (physicalActivityLevel >= 40) riskScore -= 1;
  else if (physicalActivityLevel < 20) riskScore += 2;
  if (riskScore < 0) riskScore = 0;
  if (riskScore >= 7) return 'Very High';
  if (riskScore >= 5) return 'High';
  if (riskScore >= 3) return 'Moderate';
  if (riskScore >= 1) return 'Low';
  return 'Minimal';
}

function determineKeyFactors(bmi, age, sleepDuration, qualityOfSleep, physicalActivityLevel, stressLevel, bloodPressure, heartRate, dailySteps) {
  const factors = [];
  if (bmi < 18.5) factors.push({ name: 'Underweight', impact: 'High', value: `BMI: ${Math.round(bmi * 100) / 100}` });
  else if (bmi >= 30) factors.push({ name: 'Obesity', impact: 'High', value: `BMI: ${Math.round(bmi * 100) / 100}` });
  else if (bmi >= 25) factors.push({ name: 'Overweight', impact: 'Medium', value: `BMI: ${Math.round(bmi * 100) / 100}` });
  if (sleepDuration < 6) factors.push({ name: 'Insufficient Sleep', impact: 'Medium', value: `${sleepDuration} hours` });
  else if (sleepDuration > 9) factors.push({ name: 'Excessive Sleep', impact: 'Low', value: `${sleepDuration} hours` });
  if (qualityOfSleep <= 4) factors.push({ name: 'Poor Sleep Quality', impact: 'High', value: `${qualityOfSleep}/10` });
  if (physicalActivityLevel < 20) factors.push({ name: 'Sedentary Lifestyle', impact: 'High', value: `${physicalActivityLevel}%` });
  else if (physicalActivityLevel < 40) factors.push({ name: 'Low Activity', impact: 'Medium', value: `${physicalActivityLevel}%` });
  if (stressLevel >= 8) factors.push({ name: 'Severe Stress', impact: 'High', value: `${stressLevel}/10` });
  else if (stressLevel >= 6) factors.push({ name: 'Elevated Stress', impact: 'Medium', value: `${stressLevel}/10` });
  if (bloodPressure.systolic >= 140 || bloodPressure.diastolic >= 90) factors.push({ name: 'Hypertension', impact: 'High', value: `${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg` });
  if (heartRate > 100) factors.push({ name: 'Tachycardia (High HR)', impact: 'High', value: `${heartRate} bpm` });
  else if (heartRate < 50 && physicalActivityLevel < 60) factors.push({ name: 'Bradycardia (Low HR)', impact: 'Medium', value: `${heartRate} bpm` });
  if (dailySteps < 3000) factors.push({ name: 'Very Low Steps', impact: 'High', value: `${dailySteps} steps` });
  else if (dailySteps < 6000) factors.push({ name: 'Low Steps', impact: 'Medium', value: `${dailySteps} steps` });
  return factors;
}

function generateRecommendations(category, healthRisk, keyFactors) {
  const recommendations = [];
  if (category.includes('Thinness')) {
    recommendations.push('Consult a nutritionist to create a caloric surplus plan with nutrient-dense foods.');
    recommendations.push('Incorporate strength training to build muscle mass rather than just fat.');
  } else if (category.includes('Obese')) {
    recommendations.push('Prioritize a structured weight loss program under medical supervision.');
    recommendations.push('Focus on low-impact cardio (swimming, walking) to protect joints while burning calories.');
  } else if (category === 'Overweight') {
    recommendations.push('Aim for a slight caloric deficit and increase daily steps to manage weight.');
  }
  if (keyFactors.some(f => f.name.includes('Sleep'))) recommendations.push('Establish a consistent sleep schedule: same wake and bedtimes every day.');
  if (keyFactors.some(f => f.name.includes('Stress'))) recommendations.push('Practice daily mindfulness or deep breathing exercises for 10 minutes.');
  if (keyFactors.some(f => f.name.includes('Hypertension'))) recommendations.push('Reduce sodium intake immediately and monitor blood pressure daily.');
  if (keyFactors.some(f => f.name.includes('Sedentary') || f.name.includes('Low Steps'))) recommendations.push('Set a timer to stand up and stretch every hour during desk work.');
  if (recommendations.length === 0) recommendations.push('Maintain your current healthy lifestyle habits!');
  return recommendations;
}

function calculateConfidence(keyFactors) {
  let confidence = 90;
  const highImpact = keyFactors.filter(f => f.impact === 'High').length;
  if (highImpact > 3) confidence -= 10;
  return Math.max(70, Math.min(99, confidence));
}

function generateExplanation(category, bmi, risk) {
  const bmiFixed = bmi.toFixed(2);
  let text = `Your BMI is ${bmiFixed}, placing you in the **${category}** category. `;
  if (risk === 'Very High' || risk === 'High') {
    text += `Your overall health risk profile is **${risk}**, which requires immediate attention to prevent chronic conditions. `;
  } else if (risk === 'Moderate') {
    text += `Your health risk is **Moderate**, suggesting that proactive lifestyle changes now can prevent future issues. `;
  } else {
    text += `Your health risk is **${risk}**, which is excellent. Keep maintaining your habits! `;
  }
  return text;
}

export default router;