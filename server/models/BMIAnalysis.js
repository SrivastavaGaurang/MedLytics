// models/BMIAnalysis.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const BMIAnalysisSchema = new Schema({
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
    enum: ['Male', 'Female']
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
  physicalActivityLevel: {
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
    predictedCategory: {
      type: String,
      enum: ['Underweight', 'Normal', 'Overweight', 'Obesity'],
      default: null
    },
    explanation: {
      type: String
    },
    recommendations: [{
      type: String
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('BMIAnalysis', BMIAnalysisSchema);