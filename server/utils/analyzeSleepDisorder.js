// utils/analyzeSleepDisorder.js
/**
 * Enhanced Sleep Disorder Analysis Algorithm
 * Provides comprehensive assessment with detailed recommendations
 */

const analyzeSleepDisorder = (formData) => {
  const {
    age,
    gender,
    sleepDuration,
    qualityOfSleep,
    physicalActivity,
    stressLevel,
    bmi,
    bloodPressure,
    heartRate,
    dailySteps,
    // New enhanced fields
    sleepEnvironment = 5,
    screenTimeBeforeBed = 2,
    caffeineIntake = 2,
    alcoholIntake = 1,
    shiftWork = false,
    chronicPain = false,
    snoring = false,
    breathingInterruptions = false,
    restlessLegs = false,
    nightmares = false,
    sleepingPills = false,
    napsDuringDay = 1,
    bedtimeConsistency = 5
  } = formData;

  // Calculate comprehensive sleep quality score (0-100)
  let sleepScore = 0;
  let riskFactors = [];
  let possibleDisorders = [];
  let recommendations = [];
  let professionalHelp = false;

  // 1. Sleep Duration Analysis (20 points)
  if (sleepDuration >= 7 && sleepDuration <= 9) {
    sleepScore += 20;
  } else if (sleepDuration >= 6 && sleepDuration < 7) {
    sleepScore += 15;
    riskFactors.push('Insufficient sleep duration');
    recommendations.push('Aim for 7-9 hours of sleep per night');
  } else if (sleepDuration > 9 && sleepDuration <= 10) {
    sleepScore += 15;
    riskFactors.push('Excessive sleep duration');
  } else {
    sleepScore += 10;
    riskFactors.push('Severe sleep duration abnormality');
    recommendations.push('Consult a sleep specialist about your sleep duration');
    professionalHelp = true;
  }

  // 2. Sleep Quality (20 points)
  if (qualityOfSleep >= 8) {
    sleepScore += 20;
  } else if (qualityOfSleep >= 6) {
    sleepScore += 15;
    recommendations.push('Consider improving sleep environment (darkness, quiet, comfortable temperature)');
  } else if (qualityOfSleep >= 4) {
    sleepScore += 10;
    riskFactors.push('Poor sleep quality');
    recommendations.push('Establish a consistent bedtime routine');
  } else {
    sleepScore += 5;
    riskFactors.push('Very poor sleep quality');
    possibleDisorders.push('Insomnia');
    recommendations.push('Seek evaluation for possible sleep disorders');
    professionalHelp = true;
  }

  // 3. Sleep Environment (10 points)
  if (sleepEnvironment >= 8) {
    sleepScore += 10;
  } else if (sleepEnvironment >= 6) {
    sleepScore += 7;
    recommendations.push('Optimize bedroom environment: darker curtains, white noise machine, or temperature control');
  } else {
    sleepScore += 4;
    riskFactors.push('Poor sleep environment');
    recommendations.push('Invest in blackout curtains, earplugs, or a better mattress');
  }

  // 4. Screen Time Before Bed (10 points)
  if (screenTimeBeforeBed === 0) {
    sleepScore += 10;
  } else if (screenTimeBeforeBed === 1) {
    sleepScore += 7;
    recommendations.push('Try to avoid screens 30 minutes before bed');
  } else if (screenTimeBeforeBed === 2) {
    sleepScore += 4;
    riskFactors.push('Excessive screen time before bed');
    recommendations.push('Blue light from screens can disrupt melatonin production. Use night mode or blue light filters');
  } else {
    sleepScore += 2;
    riskFactors.push('Very high screen exposure before sleep');
    recommendations.push('Establish a screen-free bedtime routine at least 1 hour before sleep');
  }

  // 5. Stress Level (10 points)
  if (stressLevel <= 3) {
    sleepScore += 10;
  } else if (stressLevel <= 5) {
    sleepScore += 7;
    recommendations.push('Practice stress-reduction techniques: meditation, deep breathing, or journaling');
  } else if (stressLevel <= 7) {
    sleepScore += 4;
    riskFactors.push('High stress levels');
    recommendations.push('Consider professional stress management counseling');
  } else {
    sleepScore += 2;
    riskFactors.push('Severe stress');
    recommendations.push('Seek professional help for stress and anxiety management');
    professionalHelp = true;
  }

  // 6. Physical Activity (10 points)
  if (physicalActivity >= 150) {
    sleepScore += 10;
  } else if (physicalActivity >= 75) {
    sleepScore += 7;
    recommendations.push('Aim for 150 minutes of moderate exercise per week for better sleep');
  } else {
    sleepScore += 3;
    riskFactors.push('Insufficient physical activity');
    recommendations.push('Regular exercise improves sleep quality - start with 20-30 minutes of walking daily');
  }

  // 7. Substance Use Analysis (10 points)
  let substanceScore = 10;
  if (caffeineIntake >= 3) {
    substanceScore -= 3;
    riskFactors.push('High caffeine consumption');
    recommendations.push('Limit caffeine intake, especially after 2 PM');
  } else if (caffeineIntake === 2) {
    substanceScore -= 1;
    recommendations.push('Consider reducing afternoon caffeine consumption');
  }

  if (alcoholIntake >= 2) {
    substanceScore -= 3;
    riskFactors.push('Alcohol affecting sleep architecture');
    recommendations.push('Alcohol disrupts REM sleep - limit consumption, especially before bedtime');
  }

  if (sleepingPills) {
    substanceScore -= 2;
    riskFactors.push('Dependence on sleep medications');
    recommendations.push('Consult your doctor about gradually reducing sleep medication dependency');
  }

  sleepScore += Math.max(0, substanceScore);

  // 8. Health Indicators (10 points)
  let healthScore = 10;

  // BMI analysis
  if (bmi >= 18.5 && bmi < 25) {
    // Normal weight - full points
  } else if (bmi < 18.5) {
    healthScore -= 2;
    riskFactors.push('Underweight status');
  } else if (bmi >= 25 && bmi < 30) {
    healthScore -= 2;
    riskFactors.push('Overweight - increased sleep apnea risk');
    recommendations.push('Maintaining a healthy weight can improve sleep quality');
  } else if (bmi >= 30) {
    healthScore -= 4;
    riskFactors.push('Obesity - high sleep apnea risk');
    possibleDisorders.push('Obstructive Sleep Apnea');
    recommendations.push('Weight loss can significantly improve sleep apnea symptoms');
    professionalHelp = true;
  }

  // Blood pressure
  if (bloodPressure.systolic > 140 || bloodPressure.diastolic > 90) {
    healthScore -= 2;
    riskFactors.push('Hypertension');
    recommendations.push('Poor sleep can worsen blood pressure - consult your doctor');
  }

  // Heart rate
  if (heartRate > 100 || heartRate < 50) {
    healthScore -= 2;
    riskFactors.push('Abnormal resting heart rate');
  }

  sleepScore += Math.max(0, healthScore);

  // 9. Sleep Disorder Screening

  // Sleep Apnea Screen
  if (snoring && breathingInterruptions) {
    possibleDisorders.push('Obstructive Sleep Apnea');
    riskFactors.push('Snoring with breathing interruptions');
    recommendations.push('URGENT: Get evaluated for sleep apnea with a sleep study');
    professionalHelp = true;
  } else if (snoring && bmi >= 30) {
    possibleDisorders.push('Possible Sleep Apnea');
    recommendations.push('Consider a sleep study to rule out sleep apnea');
  }

  // Restless Leg Syndrome
  if (restlessLegs) {
    possibleDisorders.push('Restless Leg Syndrome');
    riskFactors.push('Restless leg symptoms');
    recommendations.push('Check iron levels and consult a neurologist about restless leg syndrome');
  }

  // Shift Work Disorder
  if (shiftWork) {
    riskFactors.push('Irregular sleep schedule');
    recommendations.push('For shift workers: use bright light therapy during work hours, keep bedroom dark during day sleep');
  }

  // Chronic Pain
  if (chronicPain) {
    riskFactors.push('Chronic pain affecting sleep');
    recommendations.push('Work with your doctor on pain management to improve sleep');
  }

  // Nightmares/Sleep Terrors
  if (nightmares) {
    riskFactors.push('Frequent nightmares');
    recommendations.push('Nightmare frequency may indicate stress or trauma - consider counseling');
  }

  // Bedtime Consistency
  if (bedtimeConsistency < 5) {
    riskFactors.push('Inconsistent sleep schedule');
    recommendations.push('Maintain a consistent sleep schedule, even on weekends (within 1-2 hours)');
  }

  // Excessive Daytime Napping
  if (napsDuringDay >= 3) {
    riskFactors.push('Excessive daytime sleepiness');
    recommendations.push('Limit naps to 20-30 minutes before 3 PM');
  }

  // Final risk level determination
  let riskLevel;
  if (sleepScore >= 80) {
    riskLevel = 'Low Risk';
  } else if (sleepScore >= 60) {
    riskLevel = 'Moderate Risk';
  } else if (sleepScore >= 40) {
    riskLevel = 'High Risk';
  } else {
    riskLevel = 'Very High Risk';
    professionalHelp = true;
  }

  // Add general recommendations
  if (recommendations.length < 3) {
    recommendations.push('Maintain a regular sleep schedule');
    recommendations.push('Create a relaxing bedtime routine');
    recommendations.push('Keep your bedroom cool, dark, and quiet');
  }

  // Add professional help recommendation if needed
  if (professionalHelp) {
    recommendations.unshift('⚠️ IMPORTANT: Consult a healthcare provider or sleep specialist for professional evaluation');
  }

  // Remove duplicates
  possibleDisorders = [...new Set(possibleDisorders)];
  recommendations = [...new Set(recommendations)];
  riskFactors = [...new Set(riskFactors)];

  // If no specific disorders detected
  if (possibleDisorders.length === 0 && riskLevel !== 'Low Risk') {
    possibleDisorders.push('Poor Sleep Hygiene');
  }

  return {
    sleepScore: Math.round(sleepScore),
    riskLevel,
    riskFactors,
    possibleDisorders: possibleDisorders.length > 0 ? possibleDisorders : ['No specific disorders detected'],
    recommendations,
    professionalHelpNeeded: professionalHelp,
    detailedAnalysis: {
      durationScore: sleepDuration >= 7 && sleepDuration <= 9 ? 'Optimal' : sleepDuration < 7 ? 'Too Short' : 'Too Long',
      qualityRating: qualityOfSleep >= 8 ? 'Excellent' : qualityOfSleep >= 6 ? 'Good' : qualityOfSleep >= 4 ? 'Fair' : 'Poor',
      environmentRating: sleepEnvironment >= 8 ? 'Excellent' : sleepEnvironment >= 6 ? 'Good' : 'Needs Improvement',
      lifestyleImpact: stressLevel > 7 || caffeineIntake >= 3 || alcoholIntake >= 2 ? 'Significant' : stressLevel > 5 ? 'Moderate' : 'Minimal'
    }
  };
};

export default analyzeSleepDisorder;