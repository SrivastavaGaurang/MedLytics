
// src/pages/SleepDisorder.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeSleep } from '../services/sleepService';
import { useAuth } from '../contexts/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';

const SleepDisorder = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithRedirect } = useAuth();

  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    sleepDuration: '',
    qualityOfSleep: 5,
    physicalActivity: 50,
    stressLevel: 5,
    bmi: '',
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    dailySteps: '',
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'systolic' || name === 'diastolic') {
      setFormData({
        ...formData,
        bloodPressure: { ...formData.bloodPressure, [name]: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: ['qualityOfSleep', 'physicalActivity', 'stressLevel'].includes(name)
          ? Number(value)
          : value,
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const calculateBMI = () => {
    const height = document.getElementById('height').value / 100;
    const weight = document.getElementById('weight').value;
    if (height && weight) {
      const bmi = (weight / (height * height)).toFixed(1);
      setFormData({ ...formData, bmi });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to submit an analysis.');
      return;
    }
    setLoading(true);
    setError(null);
    const authId = user.sub;

    console.log('Submitting sleep form data:', { ...formData, authId });
    try {
      const payload = { ...formData, authId };
      const data = await analyzeSleep(payload);
      navigate(`/sleep-results/${data._id}`);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An error occurred while analyzing your data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = () => {
    console.log('Navigating to sleep history');
    navigate('/sleep-history');
  };

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
                aria-describedby="ageHelp"
              />
              <small id="ageHelp" className="form-text text-muted">Range: 18-100 years</small>
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
                aria-describedby="genderHelp"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <small id="genderHelp" className="form-text text-muted">Select your gender</small>
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
                  aria-describedby="heightHelp"
                />
                <small id="heightHelp" className="form-text text-muted">Range: 100-250 cm</small>
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
                  aria-describedby="weightHelp"
                />
                <small id="weightHelp" className="form-text text-muted">Range: 30-300 kg</small>
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
                aria-describedby="bmiHelp"
              />
              <small id="bmiHelp" className="form-text text-muted">Healthy range: 18.5-24.9</small>
            </div>
            <div className="d-grid mt-4">
              <button type="button" className="btn btn-primary" onClick={nextStep}>
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
              <label htmlFor="sleepDuration" className="form-label">Average Sleep Duration (hours per night)</label>
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
                aria-describedby="sleepDurationHelp"
              />
              <small id="sleepDurationHelp" className="form-text text-muted">
                Range: 1-12 hours (Recommended: 7-9 hours)
              </small>
            </div>
            <div className="mb-3">
              <label htmlFor="qualityOfSleep" className="form-label">
                Quality of Sleep (1-10): <span className="fw-bold">{formData.qualityOfSleep}</span>
              </label>
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() =>
                    formData.qualityOfSleep > 1 &&
                    setFormData({ ...formData, qualityOfSleep: formData.qualityOfSleep - 1 })
                  }
                  aria-label="Decrease sleep quality"
                >
                  -
                </button>
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  id="qualityOfSleep"
                  name="qualityOfSleep"
                  min="1"
                  max="10"
                  value={formData.qualityOfSleep}
                  onChange={handleChange}
                  required
                  aria-describedby="qualityOfSleepHelp"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() =>
                    formData.qualityOfSleep < 10 &&
                    setFormData({ ...formData, qualityOfSleep: formData.qualityOfSleep + 1 })
                  }
                  aria-label="Increase sleep quality"
                >
                  +
                </button>
              </div>
              <div className="d-flex justify-content-between">
                <small>Poor (1)</small>
                <small>Excellent (10)</small>
              </div>
              <small id="qualityOfSleepHelp" className="form-text text-muted">Rate your sleep quality</small>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>
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
                Physical Activity Level (0-100): <span className="fw-bold">{formData.physicalActivity}</span>
              </label>
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() =>
                    formData.physicalActivity > 0 &&
                    setFormData({ ...formData, physicalActivity: formData.physicalActivity - 5 })
                  }
                  aria-label="Decrease physical activity"
                >
                  -
                </button>
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  id="physicalActivity"
                  name="physicalActivity"
                  min="0"
                  max="100"
                  value={formData.physicalActivity}
                  onChange={handleChange}
                  required
                  aria-describedby="physicalActivityHelp"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() =>
                    formData.physicalActivity < 100 &&
                    setFormData({ ...formData, physicalActivity: formData.physicalActivity + 5 })
                  }
                  aria-label="Increase physical activity"
                >
                  +
                </button>
              </div>
              <div className="d-flex justify-content-between">
                <small>Sedentary (0)</small>
                <small>Very Active (100)</small>
              </div>
              <small id="physicalActivityHelp" className="form-text text-muted">Rate your daily physical activity</small>
            </div>
            <div className="mb-3">
              <label htmlFor="stressLevel" className="form-label">
                Stress Level (1-10): <span className="fw-bold">{formData.stressLevel}</span>
              </label>
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() =>
                    formData.stressLevel > 1 &&
                    setFormData({ ...formData, stressLevel: formData.stressLevel - 1 })
                  }
                  aria-label="Decrease stress level"
                >
                  -
                </button>
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  id="stressLevel"
                  name="stressLevel"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={handleChange}
                  required
                  aria-describedby="stressLevelHelp"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() =>
                    formData.stressLevel < 10 &&
                    setFormData({ ...formData, stressLevel: formData.stressLevel + 1 })
                  }
                  aria-label="Increase stress level"
                >
                  +
                </button>
              </div>
              <div className="d-flex justify-content-between">
                <small>Low (1)</small>
                <small>High (10)</small>
              </div>
              <small id="stressLevelHelp" className="form-text text-muted">Rate your stress level</small>
            </div>
            <div className="mb-3">
              <label htmlFor="dailySteps" className="form-label">Average Daily Steps</label>
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
                aria-describedby="dailyStepsHelp"
              />
              <small id="dailyStepsHelp" className="form-text text-muted">
                Range: 100-30,000 steps (Recommended: 7,000-10,000)
              </small>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>
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
                <label htmlFor="systolic" className="form-label">Systolic Blood Pressure (mmHg)</label>
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
                  aria-describedby="systolicHelp"
                />
                <small id="systolicHelp" className="form-text text-muted">Range: 70-200 mmHg (Normal: 90-120)</small>
              </div>
              <div className="col-md-6">
                <label htmlFor="diastolic" className="form-label">Diastolic Blood Pressure (mmHg)</label>
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
                  aria-describedby="diastolicHelp"
                />
                <small id="diastolicHelp" className="form-text text-muted">Range: 40-120 mmHg (Normal: 60-80)</small>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="heartRate" className="form-label">Resting Heart Rate (bpm)</label>
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
                aria-describedby="heartRateHelp"
              />
              <small id="heartRateHelp" className="form-text text-muted">Range: 40-200 bpm (Normal: 60-100)</small>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="btn btn-success" disabled={loading || !isAuthenticated}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Analyzing...
                  </>
                ) : (
                  'Submit & Analyze'
                )}
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="container py-5" aria-labelledby="sleep-disorder-title">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <h3>Please log in to perform a sleep analysis</h3>
                <p className="mb-4">Login to access the sleep disorder analysis tool and view your history.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => loginWithRedirect({ appState: { returnTo: '/sleep-disorder' } })}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5" aria-labelledby="sleep-disorder-title">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 id="sleep-disorder-title" className="mb-0">Sleep Disorder Analysis</h2>
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
              <form onSubmit={handleSubmit}>{renderStep()}</form>
            </div>
          </div>
          <div className="card mt-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Why This Analysis Matters</h5>
              <p className="card-text">
                Sleep disorders affect millions of people worldwide and can significantly impact your health and quality of
                life. Early detection and intervention can help improve sleep quality and prevent related health issues.
              </p>
              <p className="card-text">
                Our AI-powered analysis uses clinically-relevant parameters to assess your risk of common sleep disorders and
                provide personalized recommendations.
              </p>
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-info"
                  onClick={handleViewHistory}
                  aria-label="View sleep analysis history"
                >
                  View Sleep History
                </button>
              </div>
              <p className="card-text text-muted small mt-3">
                <strong>Note:</strong> This tool is for informational purposes only and does not replace professional medical
                advice. Always consult with a healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SleepDisorder;
