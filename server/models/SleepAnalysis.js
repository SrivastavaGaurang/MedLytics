// models/SleepAnalysis.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const SleepAnalysisSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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
  result: {
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: null
    },
    possibleDisorders: [{
      type: String
    }],
    recommendations: [{
      type: String
    }]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SleepAnalysis', SleepAnalysisSchema);