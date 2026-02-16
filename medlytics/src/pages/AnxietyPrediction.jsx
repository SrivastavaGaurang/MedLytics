// src/pages/AnxietyPrediction.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyzeAnxiety } from '../services/anxietyService';

const AnxietyPrediction = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    school_year: 1,
    age: '',
    gender: '',
    bmi: '',
    who_bmi: 'Normal',
    phq_score: 5,
    anxiousness: false,
    suicidal: false,
    epworth_score: 5
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    // Show login prompt after a delay if user isn't authenticated
    if (!isAuthenticated) {
      const timer = setTimeout(() => setShowAuthPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

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
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.age || !formData.gender) {
        setError("Please fill in all required fields before continuing");
        return;
      }
      // Reset error if form is valid
      setError(null);
    }
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
      const authId = user ? user._id : 'guest_' + Date.now();

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
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="school_year" className="form-label">School/Academic Year</label>
              <select
                className="form-select"
                id="school_year"
                name="school_year"
                value={formData.school_year}
                onChange={handleChange}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year or Graduate</option>
              </select>
            </div>

            <div className="card mb-4 border-light bg-light">
              <div className="card-body">
                <h5 className="card-title">Body Mass Index (BMI)</h5>
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
                      placeholder="e.g. 170"
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
                      placeholder="e.g. 70"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="bmi" className="form-label">BMI</label>
                    <input
                      type="number"
                      className="form-control"
                      id="bmi"
                      name="bmi"
                      value={formData.bmi}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6 mb-3">
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
                </div>
              </div>
            </div>

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
            <h3 className="mb-4">Mental Health Assessment</h3>
            <div className="card mb-4 border-light">
              <div className="card-body">
                <h5 className="card-title">Depression Screening</h5>
                <p className="text-muted small mb-3">
                  Over the last 2 weeks, how often have you been bothered by any of the following problems?
                </p>

                <label htmlFor="phq_score" className="form-label fw-bold">
                  Depression Score (PHQ-9 Scale: 0-27)
                </label>
                <div className="phq-description mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge rounded-pill bg-success px-3">None (0-4)</span>
                    <span className="badge rounded-pill bg-info px-3">Mild (5-9)</span>
                    <span className="badge rounded-pill bg-warning px-3">Moderate (10-14)</span>
                    <span className="badge rounded-pill bg-danger px-3">Severe (15+)</span>
                  </div>
                </div>
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
                  <small className="text-muted">0</small>
                  <small className="text-muted">27</small>
                </div>
                <div className="text-center mt-2">
                  <span className="fs-5 fw-bold">Selected: {formData.phq_score}</span>
                </div>
              </div>
            </div>

            <div className="card mb-4 border-light">
              <div className="card-body">
                <h5 className="card-title">Anxiety Symptoms</h5>

                <div className="mb-3 mt-3">
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
                      <span className="fw-bold">Excessive Worrying:</span> I often feel anxious or worry excessively about various things
                    </label>
                  </div>
                </div>

                <div className="mb-3">
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
                      <span className="fw-bold">Self-harm Thoughts:</span> I have experienced thoughts of self-harm
                    </label>
                  </div>
                  {formData.suicidal && (
                    <div className="alert alert-warning mt-2">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
                        <div>
                          <strong>If you're experiencing thoughts of harming yourself, please seek immediate help:</strong>
                          <ul className="mb-0 mt-2">
                            <li>National Suicide Prevention Lifeline: 988 or 1-800-273-8255</li>
                            <li>Text HOME to 741741 for Crisis Text Line</li>
                            <li>Or go to your nearest emergency room</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
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
            <h3 className="mb-4">Sleep Assessment</h3>
            <div className="card mb-4 border-light">
              <div className="card-body">
                <h5 className="card-title">Epworth Sleepiness Scale</h5>
                <p className="text-muted mb-3">
                  How likely are you to doze off or fall asleep in the following situations, in contrast to just feeling tired?
                </p>

                <label htmlFor="epworth_score" className="form-label fw-bold">
                  Daytime Sleepiness (0-24)
                </label>
                <div className="d-flex justify-content-between mb-2">
                  <span className="badge rounded-pill bg-success px-3">Normal (0-10)</span>
                  <span className="badge rounded-pill bg-warning px-3">Mild (11-14)</span>
                  <span className="badge rounded-pill bg-danger px-3">Severe (15+)</span>
                </div>
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
                  <small className="text-muted">0</small>
                  <small className="text-muted">24</small>
                </div>
                <div className="text-center mt-2">
                  <span className="fs-5 fw-bold">Selected: {formData.epworth_score}</span>
                </div>
              </div>
            </div>

            <div className="alert alert-info d-flex" role="alert">
              <i className="bi bi-info-circle-fill me-2 fs-5"></i>
              <div>
                <strong>Your privacy matters to us!</strong>
                <p className="mb-0">All data will be processed securely and used only for your personalized analysis.
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
                    <i className="bi bi-graph-up me-2"></i> Submit & Analyze
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
                  <p className="mb-0">Creating an account allows you to track your progress and access your history.</p>
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

          {/* Anxiety prediction card */}
          <div className="card shadow">
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-activity fs-3 me-2"></i>
                <h2 className="mb-0">Anxiety Assessment Tool</h2>
              </div>
              <p className="mb-0 mt-1 text-white-50">
                Complete this assessment to understand your anxiety levels and receive personalized recommendations
              </p>
            </div>
            <div className="card-body p-4">
              {/* Progress indicator */}
              <div className="mb-4">
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${(step / 3) * 100}%` }}
                    aria-valuenow={step}
                    aria-valuemin="1"
                    aria-valuemax="3"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className={`${step >= 1 ? 'text-primary fw-bold' : 'text-muted'}`}>
                    <i className={`bi ${step >= 1 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i> Personal
                  </span>
                  <span className={`${step >= 2 ? 'text-primary fw-bold' : 'text-muted'}`}>
                    <i className={`bi ${step >= 2 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i> Mental Health
                  </span>
                  <span className={`${step >= 3 ? 'text-primary fw-bold' : 'text-muted'}`}>
                    <i className={`bi ${step >= 3 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i> Sleep
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

          {/* Informational cards */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-light">
                <div className="card-body">
                  <h5 className="card-title d-flex align-items-center">
                    <i className="bi bi-info-square-fill text-primary me-2"></i>
                    Understanding Anxiety
                  </h5>
                  <p className="card-text">
                    Anxiety disorders affect approximately 40 million adults in the United States alone.
                    Early detection and proper management can significantly improve quality of life.
                  </p>
                  <p className="card-text">
                    Our AI-powered analysis uses clinically validated parameters to assess your anxiety risk level
                    and provide evidence-based recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-light">
                <div className="card-body">
                  <h5 className="card-title d-flex align-items-center">
                    <i className="bi bi-shield-check text-success me-2"></i>
                    Medical Disclaimer
                  </h5>
                  <p className="card-text">
                    This assessment tool is for informational purposes only and not intended to replace
                    professional medical advice, diagnosis, or treatment.
                  </p>
                  <p className="card-text">
                    If you're experiencing severe symptoms or having thoughts of harming yourself,
                    please seek immediate medical attention or call the National Suicide Prevention Lifeline at 988.
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

export default AnxietyPrediction;
