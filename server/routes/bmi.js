// routes/bmiRoutes.js - Fixed version following anxiety pattern
import express from 'express';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import BMIAnalysis from '../models/BMIAnalysis.js';
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

    if (!authId) {
      return res.status(400).json({ message: 'Auth ID is required' });
    }

    // Validate required fields
    if (!age || !gender || !height || !weight || !sleepDuration || !qualityOfSleep || 
        !physicalActivityLevel || !stressLevel || !bloodPressure || !heartRate || !dailySteps) {
      return res.status(400).json({ message: 'All fields are required' });
    }

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

    // Calculate BMI
    const heightInMeters = height / 100;
    const calculatedBMI = weight / (heightInMeters * heightInMeters);

    // Analyze BMI based on provided data
    const predictedCategory = determineBMICategory(calculatedBMI);
    const healthRisk = determineHealthRisk(calculatedBMI, age, bloodPressure, physicalActivityLevel);
    const keyFactors = determineKeyFactors(calculatedBMI, age, sleepDuration, qualityOfSleep, physicalActivityLevel, stressLevel, bloodPressure, heartRate, dailySteps);
    const recommendations = generateRecommendations(predictedCategory, healthRisk, keyFactors);
    const confidence = calculateConfidence(keyFactors);

    // Create new BMI analysis record
    const newAnalysis = new BMIAnalysis({
      user: user._id,
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

// Route to get BMI history for a user (requires authentication)
router.get('/history', checkJwt, async (req, res) => {
  try {
    const authId = req.user.sub; // Get Auth0 ID from JWT
    
    const analyses = await BMIAnalysis.find({ authId })
      .sort({ date: -1 }); // Sort by date, newest first
    
    res.json(analyses);
  } catch (err) {
    console.error('Error fetching BMI history:', err);
    res.status(500).json({ message: 'Server error fetching BMI history' });
  }
});

// Route to delete a BMI analysis (requires authentication)
router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const authId = req.user.sub;
    const analysis = await BMIAnalysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'BMI analysis not found' });
    }
    
    if (analysis.authId !== authId) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await analysis.deleteOne();
    res.json({ message: 'BMI analysis removed' });
  } catch (err) {
    console.error('Error deleting BMI analysis:', err);
    res.status(500).json({ message: 'Server error deleting BMI analysis' });
  }
});

// Helper functions for BMI analysis

// Determine BMI category based on calculated BMI
function determineBMICategory(bmi) {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
}

// Determine health risk based on BMI and other factors
function determineHealthRisk(bmi, age, bloodPressure, physicalActivityLevel) {
  let riskScore = 0;
  
  // BMI risk factor
  if (bmi < 18.5 || bmi >= 30) {
    riskScore += 3;
  } else if (bmi >= 25) {
    riskScore += 2;
  } else {
    riskScore += 0;
  }
  
  // Age risk factor
  if (age >= 65) {
    riskScore += 2;
  } else if (age >= 45) {
    riskScore += 1;
  }
  
  // Blood pressure risk factor
  if (bloodPressure.systolic >= 140 || bloodPressure.diastolic >= 90) {
    riskScore += 3;
  } else if (bloodPressure.systolic >= 130 || bloodPressure.diastolic >= 80) {
    riskScore += 2;
  } else if (bloodPressure.systolic >= 120) {
    riskScore += 1;
  }
  
  // Physical activity protective factor
  if (physicalActivityLevel >= 70) {
    riskScore -= 1;
  } else if (physicalActivityLevel < 30) {
    riskScore += 1;
  }
  
  // Determine risk level
  if (riskScore >= 6) {
    return 'Very High';
  } else if (riskScore >= 4) {
    return 'High';
  } else if (riskScore >= 2) {
    return 'Moderate';
  } else {
    return 'Low';
  }
}

// Determine key factors affecting BMI and health
function determineKeyFactors(bmi, age, sleepDuration, qualityOfSleep, physicalActivityLevel, stressLevel, bloodPressure, heartRate, dailySteps) {
  const factors = [];
  
  // BMI factor
  if (bmi < 18.5) {
    factors.push({
      name: 'Underweight',
      impact: 'High',
      value: `BMI: ${Math.round(bmi * 100) / 100}`
    });
  } else if (bmi >= 30) {
    factors.push({
      name: 'Obesity',
      impact: 'High',
      value: `BMI: ${Math.round(bmi * 100) / 100}`
    });
  } else if (bmi >= 25) {
    factors.push({
      name: 'Overweight',
      impact: 'Medium',
      value: `BMI: ${Math.round(bmi * 100) / 100}`
    });
  }
  
  // Sleep factors
  if (sleepDuration < 6 || sleepDuration > 9) {
    factors.push({
      name: 'Sleep Duration',
      impact: sleepDuration < 5 || sleepDuration > 10 ? 'High' : 'Medium',
      value: `${sleepDuration} hours`
    });
  }
  
  if (qualityOfSleep <= 4) {
    factors.push({
      name: 'Poor Sleep Quality',
      impact: qualityOfSleep <= 2 ? 'High' : 'Medium',
      value: `${qualityOfSleep}/10`
    });
  }
  
  // Physical activity
  if (physicalActivityLevel < 30) {
    factors.push({
      name: 'Low Physical Activity',
      impact: physicalActivityLevel < 15 ? 'High' : 'Medium',
      value: `${physicalActivityLevel}%`
    });
  }
  
  // Stress level
  if (stressLevel >= 7) {
    factors.push({
      name: 'High Stress',
      impact: stressLevel >= 9 ? 'High' : 'Medium',
      value: `${stressLevel}/10`
    });
  }
  
  // Blood pressure
  if (bloodPressure.systolic >= 140 || bloodPressure.diastolic >= 90) {
    factors.push({
      name: 'High Blood Pressure',
      impact: 'High',
      value: `${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg`
    });
  } else if (bloodPressure.systolic >= 130 || bloodPressure.diastolic >= 80) {
    factors.push({
      name: 'Elevated Blood Pressure',
      impact: 'Medium',
      value: `${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg`
    });
  }
  
  // Heart rate
  if (heartRate > 100 || heartRate < 60) {
    factors.push({
      name: 'Abnormal Heart Rate',
      impact: heartRate > 120 || heartRate < 50 ? 'High' : 'Medium',
      value: `${heartRate} bpm`
    });
  }
  
  // Daily steps
  if (dailySteps < 5000) {
    factors.push({
      name: 'Low Daily Activity',
      impact: dailySteps < 2000 ? 'High' : 'Medium',
      value: `${dailySteps} steps`
    });
  }
  
  return factors;
}

// Generate recommendations based on analysis
function generateRecommendations(category, healthRisk, keyFactors) {
  const recommendations = [];
  
  // Category-specific recommendations
  if (category === 'Underweight') {
    recommendations.push('Consult with a healthcare provider or nutritionist to develop a healthy weight gain plan.');
    recommendations.push('Focus on nutrient-dense, calorie-rich foods and consider strength training to build muscle mass.');
    recommendations.push('Monitor for underlying health conditions that may be causing weight loss.');
  } else if (category === 'Overweight' || category === 'Obese') {
    recommendations.push('Aim for gradual, sustainable weight loss of 1-2 pounds per week through diet and exercise.');
    recommendations.push('Focus on portion control and incorporate more fruits, vegetables, and lean proteins into your diet.');
    recommendations.push('Increase physical activity to at least 150 minutes of moderate-intensity exercise per week.');
  } else {
    recommendations.push('Maintain your current healthy weight through balanced nutrition and regular exercise.');
    recommendations.push('Continue monitoring your health metrics and lifestyle habits.');
  }
  
  // Factor-specific recommendations
  if (keyFactors.some(f => f.name.includes('Sleep'))) {
    recommendations.push('Prioritize 7-9 hours of quality sleep per night and maintain a consistent sleep schedule.');
    recommendations.push('Create a relaxing bedtime routine and limit screen time before sleep.');
  }
  
  if (keyFactors.some(f => f.name === 'Low Physical Activity')) {
    recommendations.push('Gradually increase your daily physical activity - start with short walks and build up intensity.');
    recommendations.push('Aim for at least 10,000 steps per day and incorporate strength training 2-3 times per week.');
  }
  
  if (keyFactors.some(f => f.name === 'High Stress')) {
    recommendations.push('Practice stress management techniques such as meditation, deep breathing, or yoga.');
    recommendations.push('Consider counseling or therapy if stress levels remain persistently high.');
  }
  
  if (keyFactors.some(f => f.name.includes('Blood Pressure'))) {
    recommendations.push('Monitor your blood pressure regularly and consult with a healthcare provider.');
    recommendations.push('Reduce sodium intake and increase consumption of potassium-rich foods.');
  }
  
  if (keyFactors.some(f => f.name === 'Abnormal Heart Rate')) {
    recommendations.push('Consult with a healthcare provider about your heart rate patterns.');
    recommendations.push('Monitor your heart rate during exercise and at rest.');
  }
  
  // Risk-based recommendations
  if (healthRisk === 'High' || healthRisk === 'Very High') {
    recommendations.push('Schedule a comprehensive health evaluation with your healthcare provider.');
    recommendations.push('Consider working with a team of healthcare professionals including a dietitian and exercise physiologist.');
  }
  
  // General health recommendations
  recommendations.push('Stay hydrated by drinking plenty of water throughout the day.');
  recommendations.push('Focus on whole, minimally processed foods and limit added sugars and saturated fats.');
  
  return recommendations;
}

// Calculate confidence score based on data completeness and consistency
function calculateConfidence(keyFactors) {
  let confidence = 85; // Base confidence
  
  // Reduce confidence for high-impact negative factors
  const highImpactFactors = keyFactors.filter(f => f.impact === 'High').length;
  confidence -= highImpactFactors * 5;
  
  // Reduce confidence for multiple concerning factors
  if (keyFactors.length > 5) {
    confidence -= 10;
  } else if (keyFactors.length > 3) {
    confidence -= 5;
  }
  
  // Ensure confidence stays within bounds
  return Math.max(60, Math.min(95, confidence));
}

export default router;