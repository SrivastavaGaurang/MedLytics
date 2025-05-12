import React, { useState } from 'react';

const DepressionPrediction = () => {
  const [formData, setFormData] = useState({
    school_year: 1,
    age: 18,
    gender: 'male',
    bmi: 22.0,
    who_bmi: 'Normal',
    phq_score: 0,
    depressiveness: false,
    suicidal: false,
    gad_score: 0
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = () => {
    setLoading(true);

    // Here you would connect to your backend API
    // For now, we'll simulate a response
    setTimeout(() => {
      const severityOptions = ['Minimal', 'Mild', 'Moderate', 'Severe'];
      const predictedSeverity = severityOptions[Math.floor(Math.random() * severityOptions.length)];
      
      setPrediction(predictedSeverity);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Depression Severity Prediction</h2>
            </div>
            <div className="card-body">
              <p className="lead mb-4">
                Complete the form below to get a prediction of depression severity based on your information.
              </p>

              <div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="school_year" className="form-label">School Year</label>
                    <select 
                      className="form-select" 
                      id="school_year"
                      value={formData.school_year}
                      onChange={(e) => handleChange('school_year', e.target.value)}
                    >
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Fourth Year</option>
                      <option value="5">Fifth Year</option>
                      <option value="6">Sixth Year</option>
                      <option value="0">Not in School</option>
                    </select>
                  </div>
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
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select 
                      className="form-select" 
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="bmi" className="form-label">BMI</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-control" 
                      id="bmi"
                      min="10"
                      max="50"
                      value={formData.bmi}
                      onChange={(e) => handleNumericChange('bmi', e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="who_bmi" className="form-label">BMI Category</label>
                    <select 
                      className="form-select" 
                      id="who_bmi"
                      value={formData.who_bmi}
                      onChange={(e) => handleChange('who_bmi', e.target.value)}
                    >
                      <option value="Underweight">Underweight</option>
                      <option value="Normal">Normal</option>
                      <option value="Overweight">Overweight</option>
                      <option value="Obese">Obese</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phq_score" className="form-label">PHQ-9 Score (Depression Scale)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="phq_score"
                      min="0"
                      max="27"
                      value={formData.phq_score}
                      onChange={(e) => handleNumericChange('phq_score', e.target.value)}
                    />
                    <small className="text-muted">Range: 0-27</small>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="gad_score" className="form-label">GAD-7 Score (Anxiety Scale)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="gad_score"
                      min="0"
                      max="21"
                      value={formData.gad_score}
                      onChange={(e) => handleNumericChange('gad_score', e.target.value)}
                    />
                    <small className="text-muted">Range: 0-21</small>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="depressiveness"
                        checked={formData.depressiveness}
                        onChange={(e) => handleCheckboxChange('depressiveness', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="depressiveness">
                        Do you experience depressiveness?
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="suicidal"
                        checked={formData.suicidal}
                        onChange={(e) => handleCheckboxChange('suicidal', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="suicidal">
                        Do you have suicidal thoughts?
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? 'Processing...' : 'Predict Depression Severity'}
                  </button>
                </div>
              </div>

              {prediction && (
                <div className="mt-4">
                  <div className="alert alert-info">
                    <h4 className="alert-heading">Prediction Result</h4>
                    <p className="mb-0">
                      Based on the information provided, your predicted depression severity level is: 
                      <strong> {prediction}</strong>
                    </p>
                    <hr />
                    <p className="mb-0 small">
                      Note: This is only a prediction and not a medical diagnosis. 
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

export default DepressionPrediction;