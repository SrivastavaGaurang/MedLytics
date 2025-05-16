import React, { useState, useEffect } from 'react';

const BMIPrediction = () => {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    sleepDuration: '',
    qualityOfSleep: 5,
    physicalActivityLevel: 50,
    stressLevel: 5,
    heartRate: '',
    dailySteps: '',
    bloodPressure: {
      systolic: '',
      diastolic: ''
    }
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  
  // Progress bar animation
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setProgressValue(0);
    }
  }, [loading]);
  
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
        [name]: ['qualityOfSleep', 'physicalActivityLevel', 'stressLevel'].includes(name) 
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // This is where we would normally call the API
      // For now, we'll simulate a prediction result based on the Python model logic
      let predictedCategory;
      
      if (formData.stressLevel > 7 && formData.physicalActivityLevel < 40) {
        predictedCategory = "Overweight";
      } else if (formData.sleepDuration < 6 && formData.stressLevel > 6) {
        predictedCategory = "Obesity";
      } else if (formData.physicalActivityLevel > 70 && formData.dailySteps > 8000) {
        predictedCategory = "Normal";
      } else if (formData.dailySteps < 4000 && formData.stressLevel > 7) {
        predictedCategory = "Overweight";
      } else {
        // Random selection for demo purposes
        const categories = ["Normal", "Overweight", "Obesity", "Underweight"];
        predictedCategory = categories[Math.floor(Math.random() * categories.length)];
      }
      
      setResult({
        predictedCategory,
        explanation: getExplanation(predictedCategory),
        recommendations: getRecommendations(predictedCategory)
      });
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An error occurred while analyzing your data');
    } finally {
      setLoading(false);
    }
  };
  
  const getExplanation = (category) => {
    switch(category) {
      case 'Underweight':
        return "Your lifestyle and health indicators suggest you may be underweight. This could be related to factors like high activity levels, inadequate caloric intake, or other health conditions.";
      case 'Normal':
        return "Your lifestyle and health indicators suggest you have a healthy weight. Your balance of physical activity, sleep quality, and stress levels appears to be working well for you.";
      case 'Overweight':
        return "Your lifestyle and health indicators suggest you may be overweight. This could be related to factors like stress levels, limited physical activity, or sleep patterns affecting your metabolic health.";
      case 'Obesity':
        return "Your lifestyle and health indicators suggest you may be in the obesity category. This prediction is based on factors like stress levels, physical activity, sleep patterns, and vital signs.";
      default:
        return "Your BMI category prediction is based on the combination of lifestyle factors, sleep patterns, and vital signs you've provided.";
    }
  };
  
  const getRecommendations = (category) => {
    const baseRecommendations = [
      "Aim for 7-9 hours of quality sleep each night",
      "Stay hydrated by drinking at least 8 glasses of water daily",
      "Incorporate stress reduction techniques like meditation or deep breathing",
      "Try to take at least 8,000 steps daily"
    ];
    
    switch(category) {
      case 'Underweight':
        return [
          "Consider consulting with a nutritionist for a balanced diet plan",
          "Focus on nutrient-dense foods that provide healthy calories",
          "Incorporate strength training to build muscle mass",
          ...baseRecommendations
        ];
      case 'Normal':
        return [
          "Maintain your current healthy habits",
          "Consider incorporating variety in your physical activities",
          "Continue balancing your nutrition with regular exercise",
          ...baseRecommendations
        ];
      case 'Overweight':
        return [
          "Gradually increase physical activity levels",
          "Focus on portion control and balanced nutrition",
          "Consider tracking your food intake with a journal or app",
          ...baseRecommendations
        ];
      case 'Obesity':
        return [
          "Consult with healthcare providers for personalized guidance",
          "Start with small, sustainable changes to diet and activity",
          "Set realistic goals for weight management",
          "Consider working with a nutritionist and fitness professional",
          ...baseRecommendations
        ];
      default:
        return baseRecommendations;
    }
  };
  
  const getBadgeColor = (category) => {
    switch (category) {
      case 'Underweight': return 'bg-warning text-dark';
      case 'Normal': return 'bg-success';
      case 'Overweight': return 'bg-warning text-dark';
      case 'Obesity': return 'bg-danger';
      default: return 'bg-secondary';
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            
            <div className="mt-4 d-flex justify-content-end">
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
                step="0.1"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="qualityOfSleep" className="form-label">
                Quality of Sleep (1-10): {formData.qualityOfSleep}
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
              <label htmlFor="physicalActivityLevel" className="form-label">
                Physical Activity Level (0-100): {formData.physicalActivityLevel}
              </label>
              <input
                type="range"
                className="form-range"
                id="physicalActivityLevel"
                name="physicalActivityLevel"
                min="0"
                max="100"
                value={formData.physicalActivityLevel}
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
                Stress Level (1-10): {formData.stressLevel}
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
                  placeholder="e.g. 120"
                />
              </div>
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
                  placeholder="e.g. 80"
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
                placeholder="e.g. 72"
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
                ) : 'Predict BMI Category'}
              </button>
            </div>
          </>
        );
          
      default:
        return null;
    }
  };

  // Render results component
  const renderResults = () => {
    if (!result) return null;
    
    return (
      <div className="card shadow-lg mt-4">
        <div className="card-body">
          <h2 className="card-title">BMI Category Prediction Result</h2>
          <p className="lead mb-3">
            Predicted BMI Category: <span className={`badge ${getBadgeColor(result.predictedCategory)}`}>
              {result.predictedCategory}
            </span>
          </p>

          <h5>What This Means</h5>
          <div className="mb-4">
            <p>{result.explanation}</p>
          </div>

          <h5>Recommendations</h5>
          {result.recommendations && result.recommendations.length > 0 ? (
            <ul className="list-group mb-4">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="list-group-item">{rec}</li>
              ))}
            </ul>
          ) : (
            <p>No recommendations available.</p>
          )}

          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={() => setResult(null)}>Try Again</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {result ? (
            renderResults()
          ) : (
            <>
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h2 className="mb-0">BMI Category Prediction</h2>
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
              
              {loading && (
                <div className="card mt-4 shadow">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Analyzing your data...</h5>
                    <div className="progress mb-2">
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        style={{ width: `${progressValue}%` }}
                        aria-valuenow={progressValue} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <div className="text-center">
                      <span>{progressValue}%</span>
                    </div>
                    <p className="mt-3 text-muted small">
                      Our AI is processing your health data and applying our machine learning model to predict your BMI category.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="card mt-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Why BMI Prediction Matters</h5>
                  <p className="card-text">
                    Your BMI category is an important indicator of your overall health. By analyzing various 
                    lifestyle factors, sleep patterns, and vital signs, we can predict your BMI category to help 
                    you understand your current health status.
                  </p>
                  <p className="card-text">
                    Our AI-powered analysis uses machine learning to predict your BMI category based on the 
                    information you provide. This can help identify potential health risks and provide 
                    personalized recommendations for improvement.
                  </p>
                  <p className="card-text text-muted small">
                    <strong>Note:</strong> This tool is for informational purposes only and does not replace 
                    professional medical advice. Always consult with a healthcare provider for proper diagnosis 
                    and treatment.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMIPrediction;