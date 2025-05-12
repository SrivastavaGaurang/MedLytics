import React, { useState } from 'react';

const NutritionalPrediction = () => {
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: 30,
    sleep_duration: 7.0,
    quality_of_sleep: 7,
    physical_activity: 60,
    stress_level: 5,
    heart_rate: 75,
    daily_steps: 8000,
    systolic: 120,
    diastolic: 80
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumericChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  const handleSubmit = () => {
    setLoading(true);

    // Here you would connect to your backend API
    // For now, we'll simulate a response
    setTimeout(() => {
      const bmiCategories = ['Underweight', 'Normal', 'Overweight', 'Obese'];
      const predictedCategory = bmiCategories[Math.floor(Math.random() * bmiCategories.length)];
      
      setPrediction(predictedCategory);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h2 className="mb-0">BMI Category Prediction</h2>
            </div>
            <div className="card-body">
              <p className="lead mb-4">
                Enter your health information below to get a prediction of your BMI category.
              </p>

              <div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select 
                      className="form-select" 
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="age"
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={(e) => handleNumericChange('age', e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="sleep_duration" className="form-label">Sleep Duration (hours)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-control" 
                      id="sleep_duration"
                      min="0"
                      max="24"
                      value={formData.sleep_duration}
                      onChange={(e) => handleNumericChange('sleep_duration', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="quality_of_sleep" className="form-label">Quality of Sleep (1-10)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="quality_of_sleep"
                      min="1"
                      max="10"
                      value={formData.quality_of_sleep}
                      onChange={(e) => handleNumericChange('quality_of_sleep', e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="physical_activity" className="form-label">Physical Activity Level (min/day)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="physical_activity"
                      min="0"
                      max="300"
                      value={formData.physical_activity}
                      onChange={(e) => handleNumericChange('physical_activity', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="stress_level" className="form-label">Stress Level (1-10)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="stress_level"
                      min="1"
                      max="10"
                      value={formData.stress_level}
                      onChange={(e) => handleNumericChange('stress_level', e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="heart_rate" className="form-label">Heart Rate (bpm)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="heart_rate"
                      min="40"
                      max="200"
                      value={formData.heart_rate}
                      onChange={(e) => handleNumericChange('heart_rate', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="daily_steps" className="form-label">Daily Steps</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="daily_steps"
                      min="0"
                      max="50000"
                      value={formData.daily_steps}
                      onChange={(e) => handleNumericChange('daily_steps', e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="systolic" className="form-label">Systolic Blood Pressure (mmHg)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="systolic"
                      min="80"
                      max="200"
                      value={formData.systolic}
                      onChange={(e) => handleNumericChange('systolic', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="diastolic" className="form-label">Diastolic Blood Pressure (mmHg)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="diastolic"
                      min="40"
                      max="130"
                      value={formData.diastolic}
                      onChange={(e) => handleNumericChange('diastolic', e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-success btn-lg"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? 'Processing...' : 'Predict BMI Category'}
                  </button>
                </div>
              </div>

              {prediction && (
                <div className="mt-4">
                  <div className="alert alert-info">
                    <h4 className="alert-heading">Prediction Result</h4>
                    <p className="mb-0">
                      Based on the information provided, your predicted BMI category is: 
                      <strong> {prediction}</strong>
                    </p>
                    <hr />
                    <p className="mb-0 small">
                      Note: This is only a prediction based on lifestyle factors and not a direct measurement. 
                      Please consult with a healthcare professional for proper evaluation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionalPrediction;