// utils/analyzeSleepDisorder.js
/**
 * Analyzes sleep data and returns sleep disorder risk assessment
 * @param {Object} data - Sleep and health metrics
 * @returns {Object} - Assessment results including risk level, possible disorders, and recommendations
 */
const analyzeSleepDisorder = (data) => {
    // Destructure input data
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
      dailySteps
    } = data;
  
    // Risk factors counter
    let riskFactors = 0;
    let possibleDisorders = [];
    let recommendations = [];
  
    // Age-related risk assessment
    if (age > 60) {
      riskFactors += 1;
      recommendations.push('Consider age-appropriate sleep hygiene practices');
    }
  
    // Sleep duration assessment
    if (sleepDuration < 6) {
      riskFactors += 2;
      possibleDisorders.push('Insomnia');
      recommendations.push('Aim for 7-9 hours of sleep per night');
    } else if (sleepDuration > 9) {
      riskFactors += 1;
      possibleDisorders.push('Hypersomnia');
      recommendations.push('Excessive sleep may indicate an underlying condition, consider consulting a sleep specialist');
    }
  
    // Sleep quality assessment
    if (qualityOfSleep < 5) {
      riskFactors += 2;
      recommendations.push('Improve sleep environment: reduce noise, light, and maintain comfortable temperature');
    }
  
    // Physical activity assessment
    if (physicalActivity < 30) {
      riskFactors += 1;
      recommendations.push('Increase daily physical activity, aim for at least 30 minutes of moderate exercise');
    } else if (physicalActivity > 85) {
      recommendations.push('Ensure exercise is not too close to bedtime as it may interfere with sleep');
    }
  
    // Stress level assessment
    if (stressLevel > 7) {
      riskFactors += 2;
      possibleDisorders.push('Stress-Induced Insomnia');
      recommendations.push('Practice stress management techniques like meditation or deep breathing exercises');
    }
  
    // BMI assessment
    if (bmi > 30) {
      riskFactors += 2;
      possibleDisorders.push('Sleep Apnea');
      recommendations.push('Weight management may help reduce sleep apnea symptoms');
    }
  
    // Blood pressure assessment
    if (bloodPressure.systolic > 140 || bloodPressure.diastolic > 90) {
      riskFactors += 1;
      recommendations.push('Monitor blood pressure regularly and consider consulting a healthcare provider');
    }
  
    // Heart rate assessment
    if (heartRate > 100 || heartRate < 50) {
      riskFactors += 1;
      recommendations.push('Abnormal resting heart rate may affect sleep quality, consider cardiovascular evaluation');
    }
  
    // Daily steps assessment
    if (dailySteps < 5000) {
      riskFactors += 1;
      recommendations.push('Increase daily activity level by taking more steps throughout the day');
    }
  
    // Special disorder checks
  
    // Restless Leg Syndrome check (using proxies in our data)
    if (age > 40 && stressLevel > 6 && physicalActivity < 40) {
      possibleDisorders.push('Restless Leg Syndrome');
      recommendations.push('Consider stretching exercises before bed to alleviate restless leg symptoms');
    }
  
    // Circadian Rhythm Disorder check
    if (qualityOfSleep < 6 && sleepDuration < 7 && stressLevel > 5) {
      possibleDisorders.push('Circadian Rhythm Disorder');
      recommendations.push('Maintain consistent sleep and wake times, even on weekends');
      recommendations.push('Get exposure to natural daylight during the day');
    }
  
    // Determine risk level
    let riskLevel;
    if (riskFactors <= 2) {
      riskLevel = 'Low';
    } else if (riskFactors <= 5) {
      riskLevel = 'Moderate';
    } else {
      riskLevel = 'High';
    }
  
    // Default recommendations for everyone
    if (!recommendations.includes('Maintain consistent sleep and wake times, even on weekends')) {
      recommendations.push('Maintain consistent sleep and wake times, even on weekends');
    }
    if (!recommendations.includes('Limit screen time before bed')) {
      recommendations.push('Limit screen time at least 1 hour before bed');
    }
    
    // Ensure unique entries
    possibleDisorders = [...new Set(possibleDisorders)];
    recommendations = [...new Set(recommendations)];
  
    return {
      riskLevel,
      possibleDisorders,
      recommendations
    };
  };
  
  export default analyzeSleepDisorder;