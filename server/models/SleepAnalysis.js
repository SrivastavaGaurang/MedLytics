// models/SleepAnalysis.js
import mongoose from 'mongoose';

const SleepAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  sleepDuration: {
    type: Number,
    required: true,
  },
  qualityOfSleep: {
    type: Number,
    required: true,
  },
  physicalActivity: {
    type: Number,
    required: true,
  },
  stressLevel: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
  },
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true },
  },
  heartRate: {
    type: Number,
    required: true,
  },
  dailySteps: {
    type: Number,
    required: true,
  },
  result: {
    riskLevel: { type: String, required: true },
    possibleDisorders: [{ type: String }],
    recommendations: [{ type: String }],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SleepAnalysis', SleepAnalysisSchema);