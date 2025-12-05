import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { analyzeBMI } from '../services/bmiService';

const ImprovedBMIPrediction = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithRedirect } = useAuth();

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    sleepDuration: '',
    qualityOfSleep: 5,
    physicalActivityLevel: 50,
    stressLevel: 5,
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    dailySteps: ''
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');

  useEffect(() => {
    // Show login prompt after a delay if user isn't authenticated
    if (!isAuthenticated) {
      const timer = setTimeout(() => setShowAuthPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['qualityOfSleep', 'physicalActivityLevel', 'stressLevel'].includes(name) ?
          Number(value) : value
      }));
    }
  };

  const calculateBMI = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);

    if (height && weight) {
      const heightM = height / 100; // Convert cm to m
      const calculatedBMI = (weight / (heightM * heightM));
      let category = 'Normal';

      if (calculatedBMI < 18.5) {
        category = 'Underweight';
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        category = 'Overweight';
      } else if (calculatedBMI >= 30) {
        category = 'Obesity';
      }

      setBmi(calculatedBMI.toFixed(1));
      setBmiCategory(category);
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.height || !formData.weight || !formData.age || !formData.gender) {
        setError("Please fill in all required fields before continuing");
        return;
      }
      calculateBMI();
      setError(null);
    }

    if (step === 2) {
      if (!formData.sleepDuration || !formData.bloodPressure.systolic ||
        !formData.bloodPressure.diastolic || !formData.heartRate || !formData.dailySteps) {
        setError("Please fill in all required fields before continuing");
        return;
      }
      setError(null);
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const getRecommendations = (category) => {
    switch (category) {
      case 'Underweight':
        return [
          'Increase caloric intake with nutrient-dense foods',
          'Consider consulting with a dietitian',
          'Add strength training to your exercise routine',
          'Monitor your weight gain progress regularly'
        ];
      case 'Overweight':
        return [
          'Focus on a balanced diet with moderate calorie deficit',
          'Increase physical activity to at least 150 minutes per week',
          'Consider portion control and mindful eating',
          'Consult with a healthcare provider for personalized advice'
        ];
      case 'Obesity':
        return [
          'Work with healthcare professionals for a comprehensive plan',
          'Focus on sustainable lifestyle changes',
          'Consider medical evaluation for underlying conditions',
          'Join support groups or programs for accountability'
        ];
      default:
        return [
          'Maintain your balanced diet and healthy eating habits',
          'Continue regular physical activity (150+ minutes/week)',
          'Schedule regular health check-ups',
          'Focus on overall wellness, not just weight'
        ];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authId = user?.sub;
      if (!authId) {
        throw new Error('Authentication required to analyze BMI data');
      }

      const dataToSubmit = {
        ...formData,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        age: parseInt(formData.age),
        sleepDuration: parseFloat(formData.sleepDuration),
        qualityOfSleep: parseInt(formData.qualityOfSleep),
        physicalActivityLevel: parseInt(formData.physicalActivityLevel),
        stressLevel: parseInt(formData.stressLevel),
        bloodPressure: {
          systolic: parseInt(formData.bloodPressure.systolic),
          diastolic: parseInt(formData.bloodPressure.diastolic)
        },
        heartRate: parseInt(formData.heartRate),
        dailySteps: parseInt(formData.dailySteps),
        bmi: parseFloat(bmi),
        bmiCategory,
        authId
      };

      const bmiData = await analyzeBMI(dataToSubmit);
      navigate(`/bmi-results/${bmiData._id}`);
    } catch (err) {
      console.error('Error submitting BMI form:', err);
      setError(err.message || 'An error occurred while analyzing your BMI data');
    } finally {
      setLoading(false);
    }
  };

  const getBMIColor = (category) => {
    switch (category) {
      case 'Underweight': return 'text-info';
      case 'Normal': return 'text-success';
      case 'Overweight': return 'text-warning';
      case 'Obesity': return 'text-danger';
      default: return 'text-muted';
    }
  };

  // Render form based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="mb-4">Basic Information</h3>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="height" className="form-label">Height (cm) <span className="text-danger">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="100"
                  max="250"
                  step="0.1"
                  placeholder="e.g. 170"
                />
                <div className="form-text">Enter your height in centimeters</div>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="weight" className="form-label">Weight (kg) <span className="text-danger">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  placeholder="e.g. 70"
                />
                <div className="form-text">Enter your weight in kilograms</div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="age" className="form-label">Age <span className="text-danger">*</span></label>
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
                <div className="form-text">Must be 18 years or older</div>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="gender" className="form-label">Gender <span className="text-danger">*</span></label>
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
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {bmi && (
              <div className="card mb-4 border-light bg-light">
                <div className="card-body">
                  <h5 className="card-title">Your BMI Calculation</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="text-center">
                        <div className="display-4 fw-bold text-primary">{bmi}</div>
                        <small className="text-muted">BMI Value</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-center">
                        <div className={`h4 fw-bold ${getBMIColor(bmiCategory)}`}>{bmiCategory}</div>
                        <small className="text-muted">Category</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-grid mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Continue <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h3 className="mb-4">Health Metrics</h3>
            <div className="card mb-4 border-light">
              <div className="card-body">
                <h5 className="card-title">Sleep & Activity</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="sleepDuration" className="form-label">Sleep Duration (hours) <span className="text-danger">*</span></label>
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
                      placeholder="e.g. 7.5"
                    />
                    <div className="form-text">Typical range: 7-9 hours</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="dailySteps" className="form-label">Daily Steps <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      id="dailySteps"
                      name="dailySteps"
                      value={formData.dailySteps}
                      onChange={handleChange}
                      required
                      min="100"
                      max="50000"
                      placeholder="e.g. 8000"
                    />
                    <div className="form-text">Goal: 10,000 steps per day</div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="qualityOfSleep" className="form-label">Sleep Quality (1-10)</label>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge rounded-pill bg-danger px-3">Poor (1-3)</span>
                    <span className="badge rounded-pill bg-warning px-3">Fair (4-6)</span>
                    <span className="badge rounded-pill bg-info px-3">Good (7-8)</span>
                    <span className="badge rounded-pill bg-success px-3">Excellent (9-10)</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    id="qualityOfSleep"
                    name="qualityOfSleep"
                    min="1"
                    max="10"
                    value={formData.qualityOfSleep}
                    onChange={handleChange}
                  />
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">1</small>
                    <small className="text-muted">10</small>
                  </div>
                  <div className="text-center mt-2">
                    <span className="fs-5 fw-bold">Selected: {formData.qualityOfSleep}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="physicalActivityLevel" className="form-label">Physical Activity Level (0-100)</label>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge rounded-pill bg-secondary px-3">Sedentary (0-25)</span>
                    <span className="badge rounded-pill bg-warning px-3">Light (26-50)</span>
                    <span className="badge rounded-pill bg-info px-3">Moderate (51-75)</span>
                    <span className="badge rounded-pill bg-success px-3">High (76-100)</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    id="physicalActivityLevel"
                    name="physicalActivityLevel"
                    min="0"
                    max="100"
                    value={formData.physicalActivityLevel}
                    onChange={handleChange}
                  />
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">0</small>
                    <small className="text-muted">100</small>
                  </div>
                  <div className="text-center mt-2">
                    <span className="fs-5 fw-bold">Selected: {formData.physicalActivityLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={prevStep}
              >
                <i className="bi bi-arrow-left me-1"></i> Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Continue <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3 className="mb-4">Vital Signs & Wellness</h3>
            <div className="card mb-4 border-light">
              <div className="card-body">
                <h5 className="card-title">Blood Pressure & Heart Rate</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="bloodPressure.systolic" className="form-label">Systolic BP <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      id="bloodPressure.systolic"
                      name="bloodPressure.systolic"
                      value={formData.bloodPressure.systolic}
                      onChange={handleChange}
                      required
                      min="70"
                      max="200"
                      placeholder="e.g. 120"
                    />
                    <div className="form-text">Normal: less than 120</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="bloodPressure.diastolic" className="form-label">Diastolic BP <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      id="bloodPressure.diastolic"
                      name="bloodPressure.diastolic"
                      value={formData.bloodPressure.diastolic}
                      onChange={handleChange}
                      required
                      min="40"
                      max="120"
                      placeholder="e.g. 80"
                    />
                    <div className="form-text">Normal: less than 80</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="heartRate" className="form-label">Resting Heart Rate (bpm) <span className="text-danger">*</span></label>
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
                    <div className="form-text">Normal: 60-100 bpm</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="stressLevel" className="form-label">Stress Level (1-10)</label>
                    <input
                      type="range"
                      className="form-range"
                      id="stressLevel"
                      name="stressLevel"
                      min="1"
                      max="10"
                      value={formData.stressLevel}
                      onChange={handleChange}
                    />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Low (1)</small>
                      <small className="text-muted">High (10)</small>
                    </div>
                    <div className="text-center mt-1">
                      <span className="fw-bold">Current: {formData.stressLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-info d-flex" role="alert">
              <i className="bi bi-info-circle-fill me-2 fs-5"></i>
              <div>
                <strong>Your privacy matters to us!</strong>
                <p className="mb-0">All health data will be processed securely and used only for your personalized BMI analysis.
                  See our <a href="/privacy-policy" className="alert-link">privacy policy</a> for details.</p>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={prevStep}
              >
                <i className="bi bi-arrow-left me-1"></i> Back
              </button>
              <button
                type="submit"
                className="btn btn-success btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-calculator me-2"></i> Calculate & Analyze BMI
                  </>
                )}
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
          {/* Authentication prompt */}
          {showAuthPrompt && !isAuthenticated && (
            <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
              <div className="d-flex">
                <i className="bi bi-shield-lock fs-4 me-2"></i>
                <div>
                  <strong>Sign in to save your results!</strong>
                  <p className="mb-0">Creating an account allows you to track your BMI progress and access your health history.</p>
                  <button
                    className="btn btn-sm btn-outline-dark mt-2"
                    onClick={() => navigate('/login')}
                  >
                    Sign In / Register
                  </button>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowAuthPrompt(false)}></button>
            </div>
          )}

          {/* BMI prediction card */}
          <div className="card shadow">
            <div className="card-header bg-success text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-calculator fs-3 me-2"></i>
                <h2 className="mb-0">BMI Analysis Tool</h2>
              </div>
              <p className="mb-0 mt-1 text-white-50">
                Complete this comprehensive health assessment for accurate BMI analysis and personalized recommendations
              </p>
            </div>
            <div className="card-body p-4">
              {/* Progress indicator */}
              <div className="mb-4">
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${(step / 3) * 100}%` }}
                    aria-valuenow={step}
                    aria-valuemin="1"
                    aria-valuemax="3"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className={`${step >= 1 ? 'text-success fw-bold' : 'text-muted'}`}>
                    <i className={`bi ${step >= 1 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i> Basic Info
                  </span>
                  <span className={`${step >= 2 ? 'text-success fw-bold' : 'text-muted'}`}>
                    <i className={`bi ${step >= 2 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i> Health Metrics
                  </span>
                  <span className={`${step >= 3 ? 'text-success fw-bold' : 'text-muted'}`}>
                    <i className={`bi ${step >= 3 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i> Vital Signs
                  </span>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-circle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {renderStep()}
              </form>
            </div>
          </div>

          {/* BMI ranges reference */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-light">
                <div className="card-body">
                  <h5 className="card-title d-flex align-items-center">
                    <i className="bi bi-bar-chart-line text-success me-2"></i>
                    BMI Categories
                  </h5>
                  <div className="bmi-ranges">
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span className="fw-bold text-info">Underweight</span>
                      <span className="badge bg-info">&lt; 18.5</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span className="fw-bold text-success">Normal</span>
                      <span className="badge bg-success">18.5 - 24.9</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span className="fw-bold text-warning">Overweight</span>
                      <span className="badge bg-warning">25.0 - 29.9</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2">
                      <span className="fw-bold text-danger">Obesity</span>
                      <span className="badge bg-danger">&gt;= 30.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-light">
                <div className="card-body">
                  <h5 className="card-title d-flex align-items-center">
                    <i className="bi bi-shield-check text-success me-2"></i>
                    Health Disclaimer
                  </h5>
                  <p className="card-text">
                    This BMI calculator is for informational purposes only and should not replace
                    professional medical advice, diagnosis, or treatment.
                  </p>
                  <p className="card-text">
                    BMI is a screening tool and doesn't directly measure body fat or account for
                    muscle mass, bone density, or overall body composition.
                  </p>
                  <p className="card-text mb-0">
                    <strong>Always consult with a healthcare provider</strong> for comprehensive
                    health assessments and personalized medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedBMIPrediction;
