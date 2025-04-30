// src/pages/SleepDisorder.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeSleep } from '../services/sleepService';
import { useAuth0 } from '@auth0/auth0-react';

const SleepDisorder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    sleepDuration: '',
    qualityOfSleep: 5, // Default to a mid value (1–10)
    physicalActivity: 50, // Default to mid (0–100)
    stressLevel: 5,
    bmi: '',
    bloodPressure: {
      systolic: '',
      diastolic: ''
    },
    heartRate: '',
    dailySteps: ''
  });
  
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'systolic' || name === 'diastolic') {
      setFormData({
        ...formData,
        bloodPressure: {
          ...formData.bloodPressure,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: ['qualityOfSleep', 'physicalActivity', 'stressLevel'].includes(name) 
          ? Number(value)
          : value
      });      
    }
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
      setFormData({
        ...formData,
        bmi
      });
    }
  };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     const token = localStorage.getItem('token');
      
  //     if (!token) {
  //       // If user is not logged in, save form data to localStorage and redirect to login
  //       localStorage.setItem('sleepFormData', JSON.stringify(formData));
  //       navigate('/login', { state: { from: '/sleep-disorder', message: 'Please log in to see your sleep analysis results' } });
  //       return;
  //     }
      
  //     const response = await fetch('http://localhost:5000/api/sleep/analyze', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-auth-token': token
  //       },
  //       body: JSON.stringify(formData)
  //     });
      
  //     const data = await response.json();
      
  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to analyze sleep data');
  //     }
      
  //     // Save analysis result ID and redirect to results page
  //     navigate(`/sleep-results/${data._id}`);
  //   } catch (err) {
  //     console.error('Error submitting form:', err);
  //     setError(err.message || 'An error occurred while analyzing your data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  
// const { getAccessTokenSilently } = useAuth0();
const {user} = useAuth0()

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  const authId = user.sub;

  e.preventDefault();
  console.log('Submitting sleep form data:', formData);
  const payload = { ...formData, authId };
  const data = await analyzeSleep(payload);
  navigate(`/sleep-results/${data._id}`);
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
                onChange={handleChange}
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
            <h3 className="mb-4">Sleep Information</h3>
            <div className="mb-3">
              <label htmlFor="sleepDuration" className="form-label">
                Average Sleep Duration (hours per night)
              </label>
              <input
                type="number"
                className="form-control"
                id="sleepDuration"
                name="sleepDuration"
                value={formData.sleepDuration}
                onChange={handleChange}
                required
                min="1"
                max="12"
                step="0.5"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="qualityOfSleep" className="form-label">
                Quality of Sleep (1-10)
              </label>
              <input
                type="range"
                className="form-range"
                id="qualityOfSleep"
                name="qualityOfSleep"
                min="1"
                max="10"
                value={formData.qualityOfSleep}
                onChange={handleChange}
                required
              />
              <div className="d-flex justify-content-between">
                <small>Poor (1)</small>
                <small>Excellent (10)</small>
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
            <h3 className="mb-4">Health & Lifestyle</h3>
            <div className="mb-3">
              <label htmlFor="physicalActivity" className="form-label">
                Physical Activity Level (0-100)
              </label>
              <input
                type="range"
                className="form-range"
                id="physicalActivity"
                name="physicalActivity"
                min="0"
                max="100"
                value={formData.physicalActivity}
                onChange={handleChange}
                required
              />
              <div className="d-flex justify-content-between">
                <small>Sedentary (0)</small>
                <small>Very Active (100)</small>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="stressLevel" className="form-label">
                Stress Level (1-10)
              </label>
              <input
                type="range"
                className="form-range"
                id="stressLevel"
                name="stressLevel"
                min="1"
                max="10"
                value={formData.stressLevel}
                onChange={handleChange}
                required
              />
              <div className="d-flex justify-content-between">
                <small>Low (1)</small>
                <small>High (10)</small>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="dailySteps" className="form-label">
                Average Daily Steps
              </label>
              <input
                type="number"
                className="form-control"
                id="dailySteps"
                name="dailySteps"
                value={formData.dailySteps}
                onChange={handleChange}
                required
                min="100"
                max="30000"
              />
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
        
      case 4:
        return (
          <>
            <h3 className="mb-4">Vital Signs</h3>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="systolic" className="form-label">
                  Systolic Blood Pressure (mmHg)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="systolic"
                  name="systolic"
                  value={formData.bloodPressure.systolic}
                  onChange={handleChange}
                  required
                  min="70"
                  max="200"
                /></div>
                <div className="col-md-6">
                  <label htmlFor="diastolic" className="form-label">
                    Diastolic Blood Pressure (mmHg)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="diastolic"
                    name="diastolic"
                    value={formData.bloodPressure.diastolic}
                    onChange={handleChange}
                    required
                    min="40"
                    max="120"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="heartRate" className="form-label">
                  Resting Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="heartRate"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  required
                  min="40"
                  max="200"
                />
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
                <h2 className="mb-0">Sleep Disorder Analysis</h2>
              </div>
              <div className="card-body p-4">
                <div className="mb-4">
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${(step / 4) * 100}%` }}
                      aria-valuenow={step} 
                      aria-valuemin="1" 
                      aria-valuemax="4"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <span className={step >= 1 ? 'text-primary' : 'text-muted'}>Personal</span>
                    <span className={step >= 2 ? 'text-primary' : 'text-muted'}>Sleep</span>
                    <span className={step >= 3 ? 'text-primary' : 'text-muted'}>Lifestyle</span>
                    <span className={step >= 4 ? 'text-primary' : 'text-muted'}>Vitals</span>
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
                <h5 className="card-title">Why This Analysis Matters</h5>
                <p className="card-text">
                  Sleep disorders affect millions of people worldwide and can significantly impact your health and quality of life.
                  Early detection and intervention can help improve sleep quality and prevent related health issues.
                </p>
                <p className="card-text">
                  Our AI-powered analysis uses clinically-relevant parameters to assess your risk of common sleep disorders
                  and provide personalized recommendations.
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
  
  export default SleepDisorder;