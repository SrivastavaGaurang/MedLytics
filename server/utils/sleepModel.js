// utils/sleepModel.js
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');

// Gender encoding
const genderEncoding = {
  'male': 0,
  'female': 1
};

// Feature scaling parameters (these would come from your Python model)
const featureScaling = {
  'age': { mean: 41.5, std: 9.8 },
  'sleepDuration': { mean: 7.1, std: 1.2 },
  'qualityOfSleep': { mean: 7.2, std: 1.5 },
  'physicalActivityLevel': { mean: 53.5, std: 18.2 },
  'stressLevel': { mean: 5.0, std: 1.5 },
  'heartRate': { mean: 72.4, std: 8.1 },
  'dailySteps': { mean: 6813.2, std: 1710.3 },
  'systolic': { mean: 125.8, std: 7.2 },
  'diastolic': { mean: 82.5, std: 5.4 }
};

// Load the TensorFlow model
const loadModel = async () => {
  // In a real implementation, you'd load a saved TensorFlow.js model
  // For this example, we'll create a simple model
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    inputShape: [10], // Number of features
    units: 16,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 8,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 3, // None, Insomnia, Sleep Apnea
    activation: 'softmax'
  }));
  
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  return model;
};

// Preprocess input for prediction
const preprocessInput = (input) => {
  // Convert gender to numeric
  const genderValue = genderEncoding[input.gender.toLowerCase()] || 0;
  
  // Normalize numeric features
  const normalizedAge = (input.age - featureScaling.age.mean) / featureScaling.age.std;
  const normalizedSleepDuration = (input.sleepDuration - featureScaling.sleepDuration.mean) / featureScaling.sleepDuration.std;
  const normalizedQualityOfSleep = (input.qualityOfSleep - featureScaling.qualityOfSleep.mean) / featureScaling.qualityOfSleep.std;
  const normalizedPhysicalActivityLevel = (input.physicalActivityLevel - featureScaling.physicalActivityLevel.mean) / featureScaling.physicalActivityLevel.std;
  const normalizedStressLevel = (input.stressLevel - featureScaling.stressLevel.mean) / featureScaling.stressLevel.std;
  const normalizedHeartRate = (input.heartRate - featureScaling.heartRate.mean) / featureScaling.heartRate.std;
  const normalizedDailySteps = (input.dailySteps - featureScaling.dailySteps.mean) / featureScaling.dailySteps.std;
  const normalizedSystolic = (input.systolic - featureScaling.systolic.mean) / featureScaling.systolic.std;
  const normalizedDiastolic = (input.diastolic - featureScaling.diastolic.mean) / featureScaling.diastolic.std;
  
  // Return preprocessed values
  return {
    values: [
      genderValue,
      normalizedAge,
      normalizedSleepDuration,
      normalizedQualityOfSleep,
      normalizedPhysicalActivityLevel,
      normalizedStressLevel,
      normalizedHeartRate,
      normalizedDailySteps,
      normalizedSystolic,
      normalizedDiastolic
    ]
  };
};

module.exports = {
  loadModel,
  preprocessInput
};