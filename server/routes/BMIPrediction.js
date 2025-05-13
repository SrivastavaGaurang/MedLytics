// models/BMIPrediction.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const BMIPredictionSchema = new Schema({
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
  height: {
    type: Number, // in centimeters
    required: true
  },
  weight: {
    type: Number, // in kilograms
    required: true
  },
  waistCircumference: {
    type: Number, // in centimeters
    required: true
  },
  physicalActivityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']
  },
  dietType: {
    type: String,
    enum: ['balanced', 'vegetarian', 'vegan', 'high_protein', 'low_carb', 'mediterranean']
  },
  familyHealthHistory: {
    type: Boolean,
    required: true
  },
  sleepHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  medicalConditions: [{
    type: String
  }],
  result: {
    bmi: {
      type: Number
    },
    category: {
      type: String,
      enum: ['Underweight', 'Normal weight', 'Overweight', 'Obese']
    },
    healthRisks: [{
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

export default mongoose.model('BMIPrediction', BMIPredictionSchema);