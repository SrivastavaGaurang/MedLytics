// routes/bmiRoutes.js
import express from 'express';
import BMIAnalysis from '../models/BMIAnalysis.js';

const router = express.Router();

// Route to analyze BMI data and store results
router.post('/analyze', async (req, res) => {
  try {
    const {
      authId,
      age,
      gender,
      height,
      weight,
      sleepDuration,
      qualityOfSleep,
      physicalActivityLevel,
      stressLevel,
      bloodPressure,
      heartRate,
      dailySteps
    } = req.body;

    // Validate required fields
    if (!age || !gender || !height || !weight || !sleepDuration || !qualityOfSleep ||
      !physicalActivityLevel || !stressLevel || !bloodPressure || !heartRate || !dailySteps) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const calculatedBMI = weight / (heightInMeters * heightInMeters);

    // Analyze BMI based on provided data
    const predictedCategory = determineBMICategory(calculatedBMI);
    const healthRisk = determineHealthRisk(calculatedBMI, age, bloodPressure, physicalActivityLevel);
    const keyFactors = determineKeyFactors(calculatedBMI, age, sleepDuration, qualityOfSleep, physicalActivityLevel, stressLevel, bloodPressure, heartRate, dailySteps);
    const recommendations = generateRecommendations(predictedCategory, healthRisk, keyFactors);
    const explanation = generateExplanation(predictedCategory, calculatedBMI, healthRisk);
    const confidence = calculateConfidence(keyFactors);

    // Create new BMI analysis record
    const newAnalysis = new BMIAnalysis({
      authId,
      age,
      gender,
      height,
      weight,
      sleepDuration,
      qualityOfSleep,
      physicalActivityLevel,
      stressLevel,
      bloodPressure,
      heartRate,
      dailySteps,
      result: {
        calculatedBMI: Math.round(calculatedBMI * 100) / 100,
        predictedCategory,
        healthRisk,
        explanation,
        keyFactors,
        recommendations,
        confidence
      }
    });

    // Save to database
    const savedAnalysis = await newAnalysis.save();
    res.status(201).json(savedAnalysis);
  } catch (err) {
    console.error('Error analyzing BMI data:', err);
    res.status(500).json({ message: 'Server error processing BMI data', error: err.message });
  }
});

// Route to get a specific BMI analysis result
router.get('/results/:id', async (req, res) => {
  try {
    const analysis = await BMIAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'BMI analysis not found' });
    }

    res.json(analysis);
  } catch (err) {
    console.error('Error fetching BMI result:', err);
    res.status(500).json({ message: 'Server error fetching BMI result' });
  }
});

// Route to get BMI history for a user
router.get('/history', async (req, res) => {
  try {
    const authId = req.query.authId; // Get authId from query paramsinstead of JWT

    if (!authId) {
      return res.status(400).json({ message: 'Auth ID required as query parameter' });
    }

    const analyses = await BMIAnalysis.find({ authId })
      .sort({ date: -1 }); // Sort by date, newest first

    res.json(analyses);
  } catch (err) {
    console.error('Error fetching BMI history:', err);
    res.status(500).json({ message: 'Server error fetching BMI history' });
  }
});

// Route to delete a BMI analysis
router.delete('/:id', async (req, res) => {
  try {
    const analysis = await BMIAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'BMI analysis not found' });
    }

    await analysis.deleteOne();
    res.json({ message: 'BMI analysis removed' });
  } catch (err) {
    console.error('Error deleting BMI analysis:', err);
    res.status(500).json({ message: 'Server error deleting BMI analysis' });
  }
});

// Helper functions for BMI analysis

// Determine BMI category based on calculated BMI (WHO Standards + Class I/II/III Obesity)
function determineBMICategory(bmi) {
  if (bmi < 16) {
    return 'Severe Thinness';
  } else if (bmi >= 16 && bmi < 17) {
    return 'Moderate Thinness';
  } else if (bmi >= 17 && bmi < 18.5) {
    return 'Mild Thinness';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else if (bmi >= 30 && bmi < 35) {
    return 'Obese Class I';
  } else if (bmi >= 35 && bmi < 40) {
    return 'Obese Class II';
  } else {
    return 'Obese Class III';
  }
}

// Determine health risk based on BMI and modified factors
function determineHealthRisk(bmi, age, bloodPressure, physicalActivityLevel) {
  let riskScore = 0;

  // BMI risk factor (Granular)
  if (bmi < 18.5) riskScore += 2;
  else if (bmi >= 25 && bmi < 30) riskScore += 1;
  else if (bmi >= 30 && bmi < 35) riskScore += 2;
  else if (bmi >= 35 && bmi < 40) riskScore += 3;
  else if (bmi >= 40) riskScore += 4;

  // Age risk factor (Adjusted)
  if (age >= 65) riskScore += 2;
  else if (age >= 50) riskScore += 1;

  // Blood pressure risk factor
  if (bloodPressure.systolic >= 160 || bloodPressure.diastolic >= 100) riskScore += 4; // Stage 2 Hypertension
  else if (bloodPressure.systolic >= 140 || bloodPressure.diastolic >= 90) riskScore += 3; // Stage 1
  else if (bloodPressure.systolic >= 130 || bloodPressure.diastolic >= 80) riskScore += 2; // Elevated
  else if (bloodPressure.systolic >= 120) riskScore += 1; // Pre-hypertension

  // Physical activity protective factor
  if (physicalActivityLevel >= 70) riskScore -= 2; // Highly active
  else if (physicalActivityLevel >= 40) riskScore -= 1; // Moderately active
  else if (physicalActivityLevel < 20) riskScore += 2; // Sedentary

  // Normalize Risk Check
  if (riskScore < 0) riskScore = 0;

  // Determine risk level
  if (riskScore >= 7) return 'Very High';
  if (riskScore >= 5) return 'High';
  if (riskScore >= 3) return 'Moderate';
  if (riskScore >= 1) return 'Low';
  return 'Minimal';
}

// Determine key factors affecting BMI and health
function determineKeyFactors(bmi, age, sleepDuration, qualityOfSleep, physicalActivityLevel, stressLevel, bloodPressure, heartRate, dailySteps) {
  const factors = [];

  // BMI factor
  if (bmi < 18.5) {
    factors.push({ name: 'Underweight', impact: 'High', value: `BMI: ${Math.round(bmi * 100) / 100}` });
  } else if (bmi >= 30) {
    factors.push({ name: 'Obesity', impact: 'High', value: `BMI: ${Math.round(bmi * 100) / 100}` });
  } else if (bmi >= 25) {
    factors.push({ name: 'Overweight', impact: 'Medium', value: `BMI: ${Math.round(bmi * 100) / 100}` });
  }

  // Sleep factors
  if (sleepDuration < 6) {
    factors.push({ name: 'Insufficient Sleep', impact: 'Medium', value: `${sleepDuration} hours` });
  } else if (sleepDuration > 9) {
    factors.push({ name: 'Excessive Sleep', impact: 'Low', value: `${sleepDuration} hours` });
  }

  if (qualityOfSleep <= 4) {
    factors.push({ name: 'Poor Sleep Quality', impact: 'High', value: `${qualityOfSleep}/10` });
  }

  // Physical activity
  if (physicalActivityLevel < 20) {
    factors.push({ name: 'Sedentary Lifestyle', impact: 'High', value: `${physicalActivityLevel}%` });
  } else if (physicalActivityLevel < 40) {
    factors.push({ name: 'Low Activity', impact: 'Medium', value: `${physicalActivityLevel}%` });
  }

  // Stress level
  if (stressLevel >= 8) {
    factors.push({ name: 'Severe Stress', impact: 'High', value: `${stressLevel}/10` });
  } else if (stressLevel >= 6) {
    factors.push({ name: 'Elevated Stress', impact: 'Medium', value: `${stressLevel}/10` });
  }

  // Blood pressure
  if (bloodPressure.systolic >= 140 || bloodPressure.diastolic >= 90) {
    factors.push({ name: 'Hypertension', impact: 'High', value: `${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg` });
  }

  // Heart rate (Resting typically)
  if (heartRate > 100) {
    factors.push({ name: 'Tachycardia (High HR)', impact: 'High', value: `${heartRate} bpm` });
  } else if (heartRate < 50 && physicalActivityLevel < 60) {
    // Low HR is only bad if not an athlete
    factors.push({ name: 'Bradycardia (Low HR)', impact: 'Medium', value: `${heartRate} bpm` });
  }

  // Daily steps
  if (dailySteps < 3000) {
    factors.push({ name: 'Very Low Steps', impact: 'High', value: `${dailySteps} steps` });
  } else if (dailySteps < 6000) {
    factors.push({ name: 'Low Steps', impact: 'Medium', value: `${dailySteps} steps` });
  }

  return factors;
}

// Generate recommendations based on analysis
function generateRecommendations(category, healthRisk, keyFactors) {
  const recommendations = [];

  // Category-specific recommendations
  if (category.includes('Thinness')) {
    recommendations.push('Consult a nutritionist to create a caloric surplus plan with nutrient-dense foods.');
    recommendations.push('Incorporate strength training to build muscle mass rather than just fat.');
  } else if (category.includes('Obese')) {
    recommendations.push('Prioritize a structured weight loss program under medical supervision.');
    recommendations.push('Focus on low-impact cardio (swimming, walking) to protect joints while burning calories.');
  } else if (category === 'Overweight') {
    recommendations.push('Aim for a slight caloric deficit and increase daily steps to manage weight.');
  }

  // Factor-specific recommendations
  if (keyFactors.some(f => f.name.includes('Sleep'))) {
    recommendations.push('Establish a consistent sleep schedule: same wake and bedtimes every day.');
  }
  if (keyFactors.some(f => f.name.includes('Stress'))) {
    recommendations.push('Practice daily mindfulness or deep breathing exercises (e.g., box breathing) for 10 minutes.');
  }
  if (keyFactors.some(f => f.name.includes('Hypertension') || f.name.includes('Blood Pressure'))) {
    recommendations.push('Reduce sodium intake immediately and monitor blood pressure daily.');
  }
  if (keyFactors.some(f => f.name.includes('Sedentary') || f.name.includes('Low Steps'))) {
    recommendations.push('Set a timer to stand up and stretch every hour used computer/desk work.');
  }

  // General check
  if (recommendations.length === 0) {
    recommendations.push('Maintain your current healthy lifestyle habits!');
  }

  return recommendations;
}

// Calculate confidence score based on data consistency
function calculateConfidence(keyFactors) {
  let confidence = 90; // Higher base confidence with improved logic

  // If too many high impact negative factors, logic might be conflicting or case is complex
  const highImpact = keyFactors.filter(f => f.impact === 'High').length;
  if (highImpact > 3) confidence -= 10;

  return Math.max(70, Math.min(99, confidence));
}

// Generate detailed explanation
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