// utils/analyzeSleepDisorder.js
/**
 * Enhanced sleep disorder analysis with weighted risk scoring
 * @param {Object} data - Sleep and health metrics
 * @returns {Object} - Comprehensive assessment with risk level, disorders, factors, and recommendations
 */
const analyzeSleepDisorder = (data) => {
  // Destructure input data with defaults
  const {
    age = 30,
    gender = 'other',
    sleepDuration = 7,
    qualityOfSleep = 7,
    physicalActivity = 50,
    stressLevel = 5,
    bmi = 22,
    bloodPressure = { systolic: 120, diastolic: 80 },
    heartRate = 70,
    dailySteps = 7000
  } = data;

  // Initialize scoring variables
  let totalRiskScore = 0;
  let maxPossibleScore = 0;
  const possibleDisorders = [];
  const keyFactors = [];
  const recommendations = new Set();

  // Weight constants for different risk factors
  const WEIGHTS = {
    CRITICAL: 3.0,  // Most important factors
    HIGH: 2.0,      // Very important factors
    MEDIUM: 1.5,    // Moderately important
    LOW: 1.0        // Less critical but still relevant
  };

  // ========== WEIGHTED RISK FACTOR ANALYSIS ==========

  // 1. SLEEP DURATION (CRITICAL - Weight: 3.0)
  maxPossibleScore += WEIGHTS.CRITICAL * 10;
  if (sleepDuration < 5) {
    totalRiskScore += WEIGHTS.CRITICAL * 10;
    possibleDisorders.push({
      name: 'Severe Insomnia',
      severity: 'High',
      probability: 85
    });
    keyFactors.push({
      name: 'Critically Short Sleep Duration',
      impact: 'Critical',
      value: `${sleepDuration} hours`
    });
    recommendations.add('URGENT: Aim for 7-9 hours of sleep per night - severe sleep deprivation detected');
    recommendations.add('Consider consulting a sleep specialist immediately for insomnia evaluation');
  } else if (sleepDuration < 6) {
    totalRiskScore += WEIGHTS.CRITICAL * 7;
    possibleDisorders.push({
      name: 'Insomnia',
      severity: 'Moderate',
      probability: 70
    });
    keyFactors.push({
      name: 'Insufficient Sleep Duration',
      impact: 'High',
      value: `${sleepDuration} hours`
    });
    recommendations.add('Gradually increase sleep duration to 7-9 hours per night');
  } else if (sleepDuration < 7) {
    totalRiskScore += WEIGHTS.CRITICAL * 4;
    keyFactors.push({
      name: 'Below Optimal Sleep Duration',
      impact: 'Medium',
      value: `${sleepDuration} hours`
    });
    recommendations.add('Aim for at least 7 hours of sleep for optimal health');
  } else if (sleepDuration > 9) {
    totalRiskScore += WEIGHTS.CRITICAL * 5;
    possibleDisorders.push({
      name: 'Hypersomnia',
      severity: 'Moderate',
      probability: 60
    });
    keyFactors.push({
      name: 'Excessive Sleep Duration',
      impact: 'Medium',
      value: `${sleepDuration} hours`
    });
    recommendations.add('Excessive sleep may indicate underlying conditions - consult a healthcare provider');
  }

  // 2. SLEEP QUALITY (CRITICAL - Weight: 3.0)
  maxPossibleScore += WEIGHTS.CRITICAL * 10;
  if (qualityOfSleep <= 3) {
    totalRiskScore += WEIGHTS.CRITICAL * 10;
    keyFactors.push({
      name: 'Very Poor Sleep Quality',
      impact: 'Critical',
      value: `${qualityOfSleep}/10`
    });
    recommendations.add('Create optimal sleep environment: dark, quiet, cool (60-67°F)');
    recommendations.add('Consider sleep study to identify quality issues');
  } else if (qualityOfSleep <= 5) {
    totalRiskScore += WEIGHTS.CRITICAL * 6;
    keyFactors.push({
      name: 'Poor Sleep Quality',
      impact: 'High',
      value: `${qualityOfSleep}/10`
    });
    recommendations.add('Improve sleep environment: reduce noise, light, and maintain comfortable temperature');
    recommendations.add('Establish a relaxing bedtime routine');
  } else if (qualityOfSleep <= 7) {
    totalRiskScore += WEIGHTS.CRITICAL * 3;
    recommendations.add('Continue improving sleep hygiene to enhance sleep quality');
  }

  // 3. STRESS LEVEL (HIGH - Weight: 2.0)
  maxPossibleScore += WEIGHTS.HIGH * 10;
  if (stressLevel >= 9) {
    totalRiskScore += WEIGHTS.HIGH * 10;
    possibleDisorders.push({
      name: 'Severe Stress-Induced Insomnia',
      severity: 'High',
      probability: 85
    });
    keyFactors.push({
      name: 'Extremely High Stress Level',
      impact: 'Critical',
      value: `${stressLevel}/10`
    });
    recommendations.add('URGENT: Practice daily stress management - meditation, deep breathing, or yoga');
    recommendations.add('Consider professional counseling for stress management');
  } else if (stressLevel >= 7) {
    totalRiskScore += WEIGHTS.HIGH * 7;
    possibleDisorders.push({
      name: 'Stress-Induced Insomnia',
      severity: 'Moderate',
      probability: 70
    });
    keyFactors.push({
      name: 'High Stress Level',
      impact: 'High',
      value: `${stressLevel}/10`
    });
    recommendations.add('Implement stress reduction techniques: mindfulness, meditation, or progressive muscle relaxation');
  } else if (stressLevel >= 5) {
    totalRiskScore += WEIGHTS.HIGH * 4;
    keyFactors.push({
      name: 'Moderate Stress Level',
      impact: 'Medium',
      value: `${stressLevel}/10`
    });
    recommendations.add('Monitor stress levels and practice regular relaxation exercises');
  }

  // 4. BMI AND SLEEP APNEA RISK (HIGH - Weight: 2.0)
  maxPossibleScore += WEIGHTS.HIGH * 10;
  if (bmi >= 35) {
    totalRiskScore += WEIGHTS.HIGH * 10;
    possibleDisorders.push({
      name: 'Obstructive Sleep Apnea',
      severity: 'High',
      probability: 90
    });
    keyFactors.push({
      name: 'Severe Obesity (Class II/III)',
      impact: 'Critical',
      value: `BMI: ${bmi.toFixed(1)}`
    });
    recommendations.add('URGENT: Consult sleep specialist for sleep apnea screening (high risk)');
    recommendations.add('Develop medically supervised weight management plan');
  } else if (bmi >= 30) {
    totalRiskScore += WEIGHTS.HIGH * 7;
    possibleDisorders.push({
      name: 'Sleep Apnea',
      severity: 'Moderate',
      probability: 70
    });
    keyFactors.push({
      name: 'Obesity',
      impact: 'High',
      value: `BMI: ${bmi.toFixed(1)}`
    });
    recommendations.add('Weight management may significantly reduce sleep apnea risk');
    recommendations.add('Consider sleep apnea screening if experiencing snoring or daytime fatigue');
  } else if (bmi >= 25) {
    totalRiskScore += WEIGHTS.HIGH * 3;
    recommendations.add('Maintain healthy weight to prevent future sleep-related issues');
  } else if (bmi < 18.5) {
    totalRiskScore += WEIGHTS.MEDIUM * 4;
    keyFactors.push({
      name: 'Underweight',
      impact: 'Medium',
      value: `BMI: ${bmi.toFixed(1)}`
    });
    recommendations.add('Consult healthcare provider about healthy weight gain strategies');
  }

  // 5. PHYSICAL ACTIVITY (MEDIUM - Weight: 1.5)
  maxPossibleScore += WEIGHTS.MEDIUM * 10;
  if (physicalActivity < 20) {
    totalRiskScore += WEIGHTS.MEDIUM * 8;
    keyFactors.push({
      name: 'Very Low Physical Activity',
      impact: 'High',
      value: `${physicalActivity}%`
    });
    recommendations.add('Start with light activity: 10-minute walks, gradually increase to 30 min/day');
  } else if (physicalActivity < 40) {
    totalRiskScore += WEIGHTS.MEDIUM * 5;
    keyFactors.push({
      name: 'Low Physical Activity',
      impact: 'Medium',
      value: `${physicalActivity}%`
    });
    recommendations.add('Increase daily physical activity to 30+ minutes of moderate exercise');
  } else if (physicalActivity > 90) {
    totalRiskScore += WEIGHTS.MEDIUM * 3;
    recommendations.add('Ensure intense exercise is completed at least 3-4 hours before bedtime');
  }

  // 6. CARDIOVASCULAR METRICS (MEDIUM - Weight: 1.5)
  maxPossibleScore += WEIGHTS.MEDIUM * 10;

  // Blood Pressure
  if (bloodPressure.systolic >= 140 || bloodPressure.diastolic >= 90) {
    totalRiskScore += WEIGHTS.MEDIUM * 7;
    keyFactors.push({
      name: 'Hypertension (High Blood Pressure)',
      impact: 'High',
      value: `${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg`
    });
    recommendations.add('Monitor blood pressure regularly and consult healthcare provider');
    recommendations.add('High BP can indicate sleep apnea - consider screening');
  } else if (bloodPressure.systolic >= 130 || bloodPressure.diastolic >= 85) {
    totalRiskScore += WEIGHTS.MEDIUM * 4;
    keyFactors.push({
      name: 'Elevated Blood Pressure',
      impact: 'Medium',
      value: `${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg`
    });
    recommendations.add('Monitor blood pressure and maintain healthy lifestyle to prevent hypertension');
  }

  // Heart Rate
  if (heartRate > 100) {
    totalRiskScore += WEIGHTS.MEDIUM * 6;
    keyFactors.push({
      name: 'Elevated Resting Heart Rate',
      impact: 'Medium',
      value: `${heartRate} bpm`
    });
    recommendations.add('Elevated heart rate may indicate poor sleep quality or stress - consult healthcare provider');
  } else if (heartRate < 50 && physicalActivity < 70) { // Low HR without being athletic
    totalRiskScore += WEIGHTS.MEDIUM * 5;
    keyFactors.push({
      name: 'Low Resting Heart Rate',
      impact: 'Medium',
      value: `${heartRate} bpm`
    });
    recommendations.add('Unusually low heart rate warrants cardiovascular evaluation');
  }

  // 7. DAILY ACTIVITY LEVEL (LOW - Weight: 1.0)
  maxPossibleScore += WEIGHTS.LOW * 10;
  if (dailySteps < 3000) {
    totalRiskScore += WEIGHTS.LOW * 8;
    keyFactors.push({
      name: 'Sedentary Lifestyle',
      impact: 'Medium',
      value: `${dailySteps} steps/day`
    });
    recommendations.add('Aim to gradually increase daily steps to at least 7,000-10,000');
  } else if (dailySteps < 5000) {
    totalRiskScore += WEIGHTS.LOW * 5;
    recommendations.add('Increase daily activity by taking short walks throughout the day');
  }

  // 8. AGE-RELATED FACTORS (LOW - Weight: 1.0)
  maxPossibleScore += WEIGHTS.LOW * 10;
  if (age > 65) {
    totalRiskScore += WEIGHTS.LOW * 6;
    keyFactors.push({
      name: 'Age-Related Sleep Changes',
      impact: 'Low',
      value: `${age} years`
    });
    recommendations.add('Age-appropriate sleep strategies: earlier bedtime, daytime naps if needed');
  } else if (age > 50) {
    totalRiskScore += WEIGHTS.LOW * 3;
    recommendations.add('Monitor for age-related sleep pattern changes');
  }

  // ========== SPECIAL DISORDER DETECTION ==========

  // Restless Leg Syndrome (RLS) indicators
  if (age > 40 && stressLevel > 6 && physicalActivity < 40 && qualityOfSleep < 6) {
    possibleDisorders.push({
      name: 'Restless Leg Syndrome',
      severity: 'Moderate',
      probability: 55
    });
    recommendations.add('Try leg stretches and massage before bed for potential RLS symptoms');
    recommendations.add('Consider iron level screening if symptoms persist');
  }

  // Circadian Rhythm Disorder indicators
  if (qualityOfSleep < 6 && sleepDuration < 7 && stressLevel > 5) {
    possibleDisorders.push({
      name: 'Circadian Rhythm Disorder',
      severity: 'Moderate',
      probability: 60
    });
    recommendations.add('Maintain consistent sleep/wake times, even on weekends');
    recommendations.add('Get 30+ minutes of natural daylight within 2 hours of waking');
    recommendations.add('Avoid bright lights and screens 2 hours before bedtime');
  }

  // Periodic Limb Movement Disorder (PLMD) - correlated with poor quality
  if (qualityOfSleep <= 4 && age > 50 && heartRate > 75) {
    possibleDisorders.push({
      name: 'Periodic Limb Movement Disorder',
      severity: 'Low',
      probability: 40
    });
    recommendations.add('Discuss sleep quality concerns with healthcare provider for potential PLMD evaluation');
  }

  // ========== CALCULATE SLEEP EFFICIENCY & CONFIDENCE ==========

  // Sleep efficiency estimation (simplified calculation)
  const expectedSleepDuration = 8;
  const sleepEfficiency = Math.min(100, Math.max(0,
    (sleepDuration / expectedSleepDuration) * (qualityOfSleep / 10) * 100
  ));

  // Calculate confidence score (based on data quality and consistency)
  let confidence = 85; // Base confidence

  // Reduce confidence for extreme or inconsistent values
  if (sleepDuration < 3 || sleepDuration > 12) confidence -= 10;
  if (bmi < 15 || bmi > 50) confidence -= 10;
  if (heartRate < 40 || heartRate > 130) confidence -= 10;

  // Increase confidence if multiple factors align
  const alignedFactors = [
    (sleepDuration < 7 && qualityOfSleep < 6),
    (stressLevel > 7 && qualityOfSleep < 6),
    (bmi > 30 && heartRate > 80),
    (physicalActivity < 30 && dailySteps < 5000)
  ].filter(Boolean).length;

  confidence += alignedFactors * 3;
  confidence = Math.min(95, Math.max(60, confidence));

  // ========== DETERMINE RISK LEVEL ==========

  const riskPercentage = (totalRiskScore / maxPossibleScore) * 100;
  let riskLevel, riskDescription;

  if (riskPercentage >= 60) {
    riskLevel = 'High';
    riskDescription = 'Significant sleep disorder risk detected. Professional evaluation strongly recommended.';
  } else if (riskPercentage >= 35) {
    riskLevel = 'Moderate';
    riskDescription = 'Moderate sleep concerns identified. Consider lifestyle modifications and monitoring.';
  } else if (riskPercentage >= 15) {
    riskLevel = 'Low';
    riskDescription = 'Minor sleep concerns detected. Focus on preventive measures and healthy sleep habits.';
  } else {
    riskLevel = 'Minimal';
    riskDescription = 'Sleep patterns appear relatively healthy. Continue maintaining good sleep hygiene.';
  }

  // ========== ADD UNIVERSAL RECOMMENDATIONS ==========

  recommendations.add('Maintain a consistent sleep schedule, even on weekends');
  recommendations.add('Limit screen time and blue light exposure 1-2 hours before bed');
  recommendations.add('Avoid caffeine after 2 PM and alcohol close to bedtime');
  recommendations.add('Create a relaxing bedtime routine (reading, warm bath, gentle stretching)');

  // Prioritize recommendations (move critical ones to top)
  const prioritizedRecommendations = Array.from(recommendations).sort((a, b) => {
    const aUrgent = a.includes('URGENT');
    const bUrgent = b.includes('URGENT');
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    return 0;
  });

  // ========== ESTIMATE SLEEP STAGES ==========

  // Estimate sleep stages based on age and sleep quality
  // Normal ranges: Light (50-60%), Deep (10-25%), REM (20-25%)
  let remSleep, deepSleep, lightSleep;

  // Base values adjusted by age
  if (age < 30) {
    deepSleep = 20;
    remSleep = 25;
  } else if (age < 50) {
    deepSleep = 15;
    remSleep = 22;
  } else {
    deepSleep = 12;
    remSleep = 20;
  }

  // Adjust based on sleep quality (poor quality reduces deep/REM)
  if (qualityOfSleep < 5) {
    deepSleep *= 0.7;
    remSleep *= 0.8;
  } else if (qualityOfSleep < 7) {
    deepSleep *= 0.9;
    remSleep *= 0.9;
  }

  // Calculate light sleep as the remainder
  lightSleep = 100 - (deepSleep + remSleep);

  // Normalize to ensure sum is 100%
  const total = deepSleep + remSleep + lightSleep;
  deepSleep = Math.round((deepSleep / total) * 100);
  remSleep = Math.round((remSleep / total) * 100);
  lightSleep = 100 - (deepSleep + remSleep);

  // ========== RETURN COMPREHENSIVE RESULTS ==========

  return {
    riskLevel,
    riskDescription,
    riskScore: Math.round(riskPercentage),
    confidence: Math.round(confidence),
    sleepEfficiency: Math.round(sleepEfficiency),
    sleepStages: {
      deepSleep,
      remSleep,
      lightSleep
    },
    possibleDisorders: possibleDisorders.length > 0
      ? possibleDisorders.sort((a, b) => b.probability - a.probability)
      : [{ name: 'No specific disorders detected', severity: 'None', probability: 0 }],
    keyFactors: keyFactors.sort((a, b) => {
      const impactOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0);
    }),
    recommendations: prioritizedRecommendations
  };
};

export default analyzeSleepDisorder;