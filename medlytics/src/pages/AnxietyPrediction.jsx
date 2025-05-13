// src/pages/AnxietyPrediction.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { analyzeAnxiety } from '../services/anxietyService';

const AnxietyPrediction = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    school_year: 1, // Default value (1st year)
    age: '',
    gender: '',
    bmi: '',
    who_bmi: 'Normal', // Default value
    phq_score: 5, // Default mid-value for depression score
    anxiousness: false,
    suicidal: false,
    epworth_score: 5 // Default mid-value for sleepiness score
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              ['phq_score', 'epworth_score', 'school_year'].includes(name) ? 
              Number(value) : value
    });
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const calculateBMI = () => {
    const height = document.getElementById('height').value / 100; // Convert cm to m
    const weight = document.getElementById('weight').value;
    
    if (height && weight) {
      const bmi = (weight / (height * height)).toFixed(1);
      let who_bmi = 'Normal';
      
      if (bmi < 18.5) {
        who_bmi = 'Underweight';
      } else if (bmi >= 25 && bmi < 30) {
        who_bmi = 'Overweight';
      } else if (bmi >= 30) {
        who_bmi = 'Obese';
      }
      
      setFormData({
        ...formData,
        bmi,
        who_bmi
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const authId = user?.sub;
      if (!authId) {
        throw new Error('Authentication required to analyze anxiety data');
      }
      
      console.log('Submitting anxiety form data:', formData);
      const payload = { ...formData, authId };
      const data = await analyzeAnxiety(payload);
      navigate(`/anxiety-results/${data._id}`);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An error occurred while analyzing your data');
    } finally {
      setLoading(false);
    }
  };
  
  // Render form based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="mb-4">Personal Information</h3>
            <div className="mb-3">
              <label htmlFor="age" className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="100"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="school_year" className="form-label">School/Academic Year</label>
              <select
                className="form-select"
                id="school_year"
                name="school_year"
                value={formData.school_year}
                onChange={handleChange}
                required
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year or Graduate</option>
              </select>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="height" className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  id="height"
                  name="height"
                  onBlur={calculateBMI}
                  required
                  min="100"
                  max="250"
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="weight" className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  id="weight"
                  name="weight"
                  onBlur={calculateBMI}
                  required
                  min="30"
                  max="300"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="bmi" className="form-label">BMI (Auto-calculated)</label>
              <input
                type="number"
                className="form-control"
                id="bmi"
                name="bmi"
                value={formData.bmi}
                readOnly
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="who_bmi" className="form-label">BMI Category</label>
              <input
                type="text"
                className="form-control"
                id="who_bmi"
                name="who_bmi"
                value={formData.who_bmi}
                readOnly
              />
            </div>
            
            <div className="d-grid mt-4">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h3 className="mb-4">Mental Health Assessment</h3>
            <div className="mb-3">
              <label htmlFor="phq_score" className="form-label">
                Depression Score (PHQ Scale: 0-27)
              </label>
              <p className="text-muted small mb-2">
                Rate your level of depression symptoms in the past two weeks, where 0 is none and 27 is severe.
              </p>
              <input
                type="range"
                className="form-range"
                id="phq_score"
                name="phq_score"
                min="0"
                max="27"
                value={formData.phq_score}
                onChange={handleChange}
                required
              />
              <div className="d-flex justify-content-between">
                <small>None (0)</small>
                <small>Mild (9)</small>
                <small>Moderate (14)</small>
                <small>Severe (27)</small>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="anxiousness" className="form-label">Do you experience excessive worrying?</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="anxiousness"
                  name="anxiousness"
                  checked={formData.anxiousness}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="anxiousness">
                  Yes, I often feel anxious or worry excessively about various things
                </label>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="suicidal" className="form-label">Have you had thoughts of self-harm?</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="suicidal"
                  name="suicidal"
                  checked={formData.suicidal}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="suicidal">
                  Yes, I have experienced thoughts of self-harm
                </label>
              </div>
              {formData.suicidal && (
                <div className="alert alert-warning mt-2">
                  <strong>If you're experiencing thoughts of harming yourself, please seek immediate help:</strong>
                  <ul className="mb-0 mt-2">
                    <li>National Suicide Prevention Lifeline: 988 or 1-800-273-8255</li>
                    <li>Text HOME to 741741 for Crisis Text Line</li>
                    <li>Or go to your nearest emergency room</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={prevStep}
              >
                Back
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h3 className="mb-4">Sleep Assessment</h3>
            <div className="mb-3">
              <label htmlFor="epworth_score" className="form-label">
                Daytime Sleepiness (Epworth Sleepiness Scale: 0-24)
              </label>
              <p className="text-muted small mb-2">
                How likely are you to doze off or fall asleep in the following situations? 
                (0 = would never doze, 24 = high chance of dozing)
              </p>
              <input
                type="range"
                className="form-range"
                id="epworth_score"
                name="epworth_score"
                min="0"
                max="24"
                value={formData.epworth_score}
                onChange={handleChange}
                required
              />
              <div className="d-flex justify-content-between">
                <small>Normal (0-10)</small>
                <small>Excessive Sleepiness (11-24)</small>
              </div>
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={prevStep}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Analyzing...
                  </>
                ) : 'Submit & Analyze'}
              </button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Anxiety Prediction Analysis</h2>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${(step / 3) * 100}%` }}
                    aria-valuenow={step} 
                    aria-valuemin="1" 
                    aria-valuemax="3"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <span className={step >= 1 ? 'text-primary' : 'text-muted'}>Personal</span>
                  <span className={step >= 2 ? 'text-primary' : 'text-muted'}>Mental Health</span>
                  <span className={step >= 3 ? 'text-primary' : 'text-muted'}>Sleep</span>
                </div>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {renderStep()}
              </form>
            </div>
          </div>
          
          <div className="card mt-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Understanding Anxiety</h5>
              <p className="card-text">
                Anxiety disorders are among the most common mental health conditions, affecting millions worldwide.
                Early detection and intervention can significantly improve quality of life and prevent related health complications.
              </p>
              <p className="card-text">
                Our AI-powered analysis uses validated parameters to assess your anxiety risk level
                and provide personalized recommendations based on clinical guidelines.
              </p>
              <p className="card-text text-muted small">
                <strong>Note:</strong> This tool is for informational purposes only and does not replace professional medical advice.
                Always consult with a healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnxietyPrediction;