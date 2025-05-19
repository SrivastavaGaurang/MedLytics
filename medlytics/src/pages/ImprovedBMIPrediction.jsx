import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeBMI } from '../services/bmiService';
import './BMIResult.css';

const ImprovedBMIPrediction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    sleepDuration: '',
    qualityOfSleep: '',
    physicalActivityLevel: '',
    stressLevel: '',
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    dailySteps: ''
  });
  const [progressValue, setProgressValue] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    // Initialize Bootstrap tooltips only if window.bootstrap is available
    if (window.bootstrap && window.bootstrap.Tooltip) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    } else {
      console.warn('Bootstrap Tooltip is not available. Ensure Bootstrap JS is loaded.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setProgressValue(0);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required. Please log in.');

      const heightM = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      const calculatedBMI = weight / (heightM * heightM);
      let category = 'Normal';
      if (calculatedBMI < 18.5) category = 'Underweight';
      else if (calculatedBMI >= 25 && calculatedBMI < 30) category = 'Overweight';
      else if (calculatedBMI >= 30) category = 'Obesity';

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
        result: {
          predictedCategory: category,
          explanation: `Your BMI is ${calculatedBMI.toFixed(2)}, which falls into the ${category} category.`,
          recommendations: getRecommendations(category),
          confidence: 95
        }
      };

      const bmiData = await analyzeBMI(dataToSubmit, token);
      setProgressValue(100);
      navigate(`/bmi-results/${bmiData._id}`);
    } catch (err) {
      setError(err.message || 'Failed to calculate BMI');
      setProgressValue(0);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = (category) => {
    switch(category) {
      case 'Underweight':
        return [
          'Increase caloric intake with nutrient-dense foods',
          'Consider consulting with a dietitian',
          'Add strength training to your exercise routine'
        ];
      case 'Overweight':
      case 'Obesity':
        return [
          'Focus on a balanced diet with calorie deficit',
          'Increase physical activity to at least 150 minutes per week',
          'Consider consulting with a healthcare provider'
        ];
      default:
        return [
          'Maintain your balanced diet',
          'Continue regular physical activity',
          'Schedule regular health check-ups'
        ];
    }
  };

  return (
    <div className="container-fluid bg-light py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="display-5 fw-bold text-center mb-5">BMI Prediction</h2>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow result-card">
              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <h4 className="mb-4">Basic Information</h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="height" className="form-label">Height (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        step="0.1"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="weight" className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        step="0.1"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="age" className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="gender" className="form-label">Gender</label>
                      <select
                        className="form-select"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="mt-5 mb-4">Health Metrics</h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="sleepDuration" className="form-label">Sleep Duration (hours)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="sleepDuration"
                        name="sleepDuration"
                        value={formData.sleepDuration}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        step="0.1"
                        min="1"
                        max="12"
                        data-bs-toggle="tooltip"
                        title="Typical sleep duration for adults is 7-9 hours"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="qualityOfSleep" className="form-label">Quality of Sleep (1-10)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="qualityOfSleep"
                        name="qualityOfSleep"
                        value={formData.qualityOfSleep}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="1"
                        max="10"
                        data-bs-toggle="tooltip"
                        title="1 = Poor, 10 = Excellent"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="physicalActivityLevel" className="form-label">Physical Activity Level (0-100)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="physicalActivityLevel"
                        name="physicalActivityLevel"
                        value={formData.physicalActivityLevel}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="0"
                        max="100"
                        data-bs-toggle="tooltip"
                        title="0 = Sedentary, 100 = Very Active"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="stressLevel" className="form-label">Stress Level (1-10)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="stressLevel"
                        name="stressLevel"
                        value={formData.stressLevel}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="1"
                        max="10"
                        data-bs-toggle="tooltip"
                        title="1 = Low Stress, 10 = High Stress"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bloodPressure.systolic" className="form-label">Systolic Blood Pressure</label>
                      <input
                        type="number"
                        className="form-control"
                        id="bloodPressure.systolic"
                        name="bloodPressure.systolic"
                        value={formData.bloodPressure.systolic}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="70"
                        max="200"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bloodPressure.diastolic" className="form-label">Diastolic Blood Pressure</label>
                      <input
                        type="number"
                        className="form-control"
                        id="bloodPressure.diastolic"
                        name="bloodPressure.diastolic"
                        value={formData.bloodPressure.diastolic}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="40"
                        max="120"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="heartRate" className="form-label">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="heartRate"
                        name="heartRate"
                        value={formData.heartRate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="40"
                        max="200"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="dailySteps" className="form-label">Daily Steps</label>
                      <input
                        type="number"
                        className="form-control"
                        id="dailySteps"
                        name="dailySteps"
                        value={formData.dailySteps}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="100"
                        max="50000"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-4"
                      >
                        <div className="progress-circle">
                          <svg viewBox="0 0 36 36">
                            <path
                              className="text-light"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.8"
                            />
                            <path
                              className="text-primary"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.8"
                              strokeDasharray={`${progressValue}, 100`}
                            />
                          </svg>
                          <div className="progress-text">{progressValue}%</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    className="btn btn-primary mt-4 w-100"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Calculating...
                      </>
                    ) : (
                      'Calculate BMI'
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title mb-4">BMI Ranges</h4>
                <ul className="bmi-range list-unstyled">
                  <li className="underweight"><span className="dot"></span>Underweight: &lt; 18.5</li>
                  <li className="normal"><span className="dot"></span>Normal: 18.5 - 24.9</li>
                  <li className="overweight"><span className="dot"></span>Overweight: 25 - 29.9</li>
                  <li className="obesity"><span className="dot"></span>Obesity: &ge; 30</li>
                </ul>
                <p className="mt-4 text-muted small">
                  These ranges are based on WHO standards. Consult a healthcare provider for personalized advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImprovedBMIPrediction;