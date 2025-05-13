// models/NutritionalPrediction.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const NutritionalPredictionSchema = new Schema({
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
    type: Number,
    required: true, // in centimeters
  },
  weight: {
    type: Number,
    required: true, // in kilograms
  },
  waistCircumference: {
    type: Number,
    required: true // in centimeters
  },
  physicalActivityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']
  },
  dietType: {
    type: String,
    enum: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    required: true
  },
  medicalConditions: [{
    type: String
  }],
  medications: [{
    type: String
  }],
  alcoholConsumption: {
    type: Number,
    min: 0,
    max: 7, // drinks per week
    required: true
  },
  result: {
    bmi: {
      type: Number,
      default: null
    },
    bmiCategory: {
      type: String,
      enum: ['underweight', 'normal_weight', 'overweight', 'obese'],
      default: null
    },
    bodyFatPercentage: {
      type: Number,
      default: null
    },
    metabolicRate: {
      type: Number,
      default: null
    },
    nutritionalRecommendations: [{
      type: String
    }],
    healthRisks: [{
      type: String
    }]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate BMI
NutritionalPredictionSchema.pre('save', function(next) {
  // Calculate BMI (weight in kg / (height in meters)^2)
  const heightInMeters = this.height / 100;
  const bmi = this.weight / (heightInMeters * heightInMeters);
  
  // Set BMI category
  let bmiCategory = 'normal_weight';
  if (bmi < 18.5) bmiCategory = 'underweight';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'overweight';
  else if (bmi >= 30) bmiCategory = 'obese';

  // Assign BMI and category to result
  this.result.bmi = Math.round(bmi * 10) / 10;
  this.result.bmiCategory = bmiCategory;

  next();
});

export default mongoose.model('NutritionalPrediction', NutritionalPredictionSchema);