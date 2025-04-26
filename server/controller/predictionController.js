// controllers/predictionController.js
const tf = require('@tensorflow/tfjs-node');
const PredictionResult = require('../models/PredictionResult');
const { loadModel, preprocessInput } = require('../utils/sleepModel');

let model;

// Initialize model
(async () => {
  try {
    model = await loadModel();
    console.log('Sleep disorder prediction model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
  }
})();

// Predict sleep disorder
exports.predictSleepDisorder = async (req, res) => {
  try {
    const {
      gender,
      age,
      sleepDuration,
      qualityOfSleep,
      physicalActivityLevel,
      stressLevel,
      heartRate,
      dailySteps,
      systolic,
      diastolic,
      userId
    } = req.body;

    // Basic validation
    if (!gender || !age || !sleepDuration || !qualityOfSleep || 
        !physicalActivityLevel || !stressLevel || !heartRate || 
        !dailySteps || !systolic || !diastolic) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Preprocess the input
    const processedInput = preprocessInput({
      gender,
      age,
      sleepDuration,
      qualityOfSleep,
      physicalActivityLevel,
      stressLevel,
      heartRate,
      dailySteps,
      systolic,
      diastolic
    });

    // Make prediction
    const tensor = tf.tensor2d([processedInput.values]);
    const prediction = model.predict(tensor);
    const predictionData = await prediction.data();
    
    // Get highest probability class
    const predictedClass = predictionData.indexOf(Math.max(...predictionData));
    
    // Map class index to disorder name
    const disorderMap = ['None', 'Insomnia', 'Sleep Apnea'];
    const predictedDisorder = disorderMap[predictedClass];
    
    // Calculate confidence percentage
    const confidence = (predictionData[predictedClass] * 100).toFixed(2);

    // Save prediction to database if user is logged in
    let savedPrediction = null;
    if (userId) {
      savedPrediction = new PredictionResult({
        userId,
        predictionType: 'sleep',
        inputs: req.body,
        result: predictedDisorder,
        confidence: parseFloat(confidence)
      });
      await savedPrediction.save();
    }

    // Send response
    res.json({
      result: predictedDisorder,
      confidence: parseFloat(confidence),
      savedId: savedPrediction ? savedPrediction._id : null
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Server error during prediction', error: error.message });
  }
};

// Get prediction history for a user
exports.getPredictionHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const predictions = await PredictionResult.find({ 
      userId, 
      predictionType: 'sleep' 
    }).sort({ createdAt: -1 });
    
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};