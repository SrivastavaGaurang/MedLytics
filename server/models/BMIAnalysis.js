// models/BMIAnalysis.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const BMIAnalysisSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  authId: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other', 'male', 'female', 'other'] // Allow lowercase
  },
  height: {
    type: Number,
    required: true,
    min: 100,
    max: 250
  },
  weight: {
    type: Number,
    required: true,
    min: 30,
    max: 300
  },
  sleepDuration: {
    type: Number,
    required: true,
    min: 1,
    max: 12
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
      required: true,
      min: 70,
      max: 200
    },
    diastolic: {
      type: Number,
      required: true,
      min: 40,
      max: 120
    }
  },
  heartRate: {
    type: Number,
    required: true,
    min: 40,
    max: 200
  },
  dailySteps: {
    type: Number,
    required: true,
    min: 100,
    max: 50000
  },
  result: {
    calculatedBMI: {
      type: Number,
      required: true
    },
    predictedCategory: {
      type: String,
      enum: [
        'Underweight', 'Normal', 'Overweight', 'Obese',
        'Severe Thinness', 'Moderate Thinness', 'Mild Thinness',
        'Obese Class I', 'Obese Class II', 'Obese Class III'
      ],
      required: true
    },
    healthRisk: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Very High', 'Minimal'],
      default: 'Low'
    },
    explanation: {
      type: String
    },
    keyFactors: [{
      name: String,
      impact: {
        type: String,
        enum: ['Low', 'Medium', 'High']
      },
      value: mongoose.Schema.Types.Mixed
    }],
    recommendations: [{
      type: String
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('BMIAnalysis', BMIAnalysisSchema);