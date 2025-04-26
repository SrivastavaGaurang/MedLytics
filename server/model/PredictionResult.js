const mongoose = require('mongoose');

// PredictionResult Schema
const PredictionResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  predictionType: {
    type: String,
    required: true,
    enum: ['sleep', 'anxiety', 'depression', 'nutrition']
  },
  inputs: {
    type: Object,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// SleepAnalysis Schema
const SleepAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  sleepDuration: {
    type: Number,
    required: true
  },
  qualityOfSleep: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  physicalActivity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  bmi: {
    type: Number,
    required: true
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true
    },
    diastolic: {
      type: Number,
      required: true
    }
  },
  heartRate: {
    type: Number,
    required: true
  },
  dailySteps: {
    type: Number,
    required: true
  },
  hasDisorder: {
    type: Boolean,
    default: false
  },
  disorderType: {
    type: String,
    enum: ['none', 'insomnia', 'sleep_apnea', 'restless_leg_syndrome', 'narcolepsy', 'other'],
    default: 'none'
  },
  predictionConfidence: {
    type: Number,
    default: 0
  },
  recommendations: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  PredictionResult: mongoose.model('PredictionResult', PredictionResultSchema),
  SleepAnalysis: mongoose.model('SleepAnalysis', SleepAnalysisSchema)
};