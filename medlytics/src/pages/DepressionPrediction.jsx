import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { analyzeDepression } from '../services/depressionService';

const DepressionPrediction = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  
  const [formData, setFormData] = useState({
    age: 25,
    gender: 'male',
    maritalStatus: 'single',
    employmentStatus: 'employed',
    stressLevel: 5,
    sleepQuality: 5,
    socialSupport: 5,
    physicalActivity: 50,
    dietQuality: 5,
    geneticHistory: false,
    medicalConditions: []
  });

  const [conditions, setConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleNumericChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  const handleConditionsChange = (e) => {
    setConditions(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Process medical conditions from string to array
      const medicalConditions = conditions
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');

      // Generate a random authId if the user is not authenticated
      const authId = isAuthenticated ? user.sub : `anonymous-${Date.now()}`;

      const response = await analyzeDepression({
        ...formData,
        authId,
        medicalConditions
      });

      // Navigate to results page with the ID from the response
      navigate(`/depression-results/${response._id}`);
    } catch (err) {
      console.error('Error submitting depression analysis:', err);
      setError('An error occurred while processing your submission. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Depression Risk Analysis</h2>
            </div>
            <div className="card-body">
              <p className="lead mb-4">
                Complete the form below to analyze your depression risk factors and receive personalized recommendations.
              </p>

              {error && (
                <div className="alert alert-danger mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="age"
                      min="13"
                      max="100"
                      value={formData.age}
                      onChange={(e) => handleNumericChange('age', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select 
                      className="form-select" 
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="maritalStatus" className="form-label">Marital Status</label>
                    <select 
                      className="form-select" 
                      id="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={(e) => handleChange('maritalStatus', e.target.value)}
                      required
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="employmentStatus" className="form-label">Employment Status</label>
                    <select 
                      className="form-select" 
                      id="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={(e) => handleChange('employmentStatus', e.target.value)}
                      required
                    >
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="stressLevel" className="form-label">
                      Stress Level (1-10)
                      <span className="ms-2 text-muted small">{formData.stressLevel}/10</span>
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      id="stressLevel"
                      min="1"
                      max="10"
                      value={formData.stressLevel}
                      onChange={(e) => handleNumericChange('stressLevel', e.target.value)}
                      required
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="sleepQuality" className="form-label">
                      Sleep Quality (1-10)
                      <span className="ms-2 text-muted small">{formData.sleepQuality}/10</span>
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      id="sleepQuality"
                      min="1"
                      max="10"
                      value={formData.sleepQuality}
                      onChange={(e) => handleNumericChange('sleepQuality', e.target.value)}
                      required
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="socialSupport" className="form-label">
                      Social Support (1-10)
                      <span className="ms-2 text-muted small">{formData.socialSupport}/10</span>
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      id="socialSupport"
                      min="1"
                      max="10"
                      value={formData.socialSupport}
                      onChange={(e) => handleNumericChange('socialSupport', e.target.value)}
                      required
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Isolated</span>
                      <span>Well Supported</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="physicalActivity" className="form-label">
                      Physical Activity (minutes/week)
                      <span className="ms-2 text-muted small">{formData.physicalActivity} mins</span>
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      id="physicalActivity"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.physicalActivity}
                      onChange={(e) => handleNumericChange('physicalActivity', e.target.value)}
                      required
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>0 mins</span>
                      <span>100+ mins</span>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="dietQuality" className="form-label">
                      Diet Quality (1-10)
                      <span className="ms-2 text-muted small">{formData.dietQuality}/10</span>
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      id="dietQuality"
                      min="1"
                      max="10"
                      value={formData.dietQuality}
                      onChange={(e) => handleNumericChange('dietQuality', e.target.value)}
                      required
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check mt-4">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="geneticHistory"
                        checked={formData.geneticHistory}
                        onChange={(e) => handleCheckboxChange('geneticHistory', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="geneticHistory">
                        Family history of depression or mental health conditions
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="medicalConditions" className="form-label">Medical Conditions (comma-separated)</label>
                  <textarea 
                    className="form-control" 
                    id="medicalConditions"
                    rows="2"
                    placeholder="e.g. Thyroid disorder, Diabetes, Chronic pain"
                    value={conditions}
                    onChange={handleConditionsChange}
                  ></textarea>
                  <div className="form-text">List any medical conditions that may affect your mental health</div>
                </div>

                <div className="mb-4">
                  <div className="alert alert-info">
                    <h5 className="alert-heading">Privacy Notice</h5>
                    <p className="mb-0">
                      Your information is kept confidential and will only be used for this assessment. 
                      This tool is for informational purposes only and is not a substitute for professional medical advice.
                    </p>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : 'Analyze Depression Risk'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressionPrediction;