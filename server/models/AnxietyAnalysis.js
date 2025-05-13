// models/AnxietyAnalysis.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const AnxietyAnalysisSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  authId: {
    type: String,
    required: true
  },
  school_year: {
    type: Number,
    required: true,
    min: 1,
    max: 5
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
  bmi: {
    type: Number,
    required: true
  },
  who_bmi: {
    type: String,
    required: true,
    enum: ['Underweight', 'Normal', 'Overweight', 'Obese']
  },
  phq_score: {
    type: Number,
    required: true,
    min: 0,
    max: 27
  },
  anxiousness: {
    type: Boolean,
    required: true
  },
  suicidal: {
    type: Boolean,
    required: true
  },
  epworth_score: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  result: {
    anxietySeverity: {
      type: String,
      enum: ['Minimal', 'Mild', 'Moderate', 'Severe'],
      default: null
    },
    anxietyType: {
      type: String
    },
    anxietyTypeDescription: {
      type: String
    },
    keyFactors: [{
      name: String,
      impact: {
        type: String,
        enum: ['Low', 'Medium', 'High']
      }
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

export default mongoose.model('AnxietyAnalysis', AnxietyAnalysisSchema);