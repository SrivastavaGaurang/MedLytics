// models/DepressionPrediction.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const DepressionPredictionSchema = new Schema({
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
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    required: true
  },
  employmentStatus: {
    type: String,
    enum: ['employed', 'unemployed', 'student', 'retired'],
    required: true
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  sleepQuality: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  socialSupport: {
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
  dietQuality: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  geneticHistory: {
    type: Boolean,
    required: true
  },
  medicalConditions: [{
    type: String
  }],
  result: {
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: null
    },
    possibleDepressionTypes: [{
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

export default mongoose.model('DepressionPrediction', DepressionPredictionSchema);