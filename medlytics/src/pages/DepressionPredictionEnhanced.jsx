import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaHeart, 
  FaBrain, 
  FaRunning, 
  FaUtensils, 
  FaUsers, 
  FaBed,
  FaStethoscope,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt,
  FaChartLine,
  FaQuestionCircle,
  FaArrowRight,
  FaSpinner,
  FaCheckCircle,
  FaCalendarAlt,
  FaLightbulb,
  FaArrowLeft,
  FaPrint,
  FaDownload,
  FaShare
} from 'react-icons/fa';

const ProfessionalDepressionSystem = () => {
  const [currentView, setCurrentView] = useState('assessment'); // 'assessment' or 'results'
  const [currentStep, setCurrentStep] = useState(1);
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
  const [showHelp, setShowHelp] = useState({});
  const [analysisResults, setAnalysisResults] = useState(null);

  const totalSteps = 5;

  // Enhanced analysis algorithm
  const analyzeDepression = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let riskPoints = 0;
        let keyFactors = [];
        let recommendations = [];

        // Advanced risk calculation
        if (data.stressLevel > 7) {
          riskPoints += 3;
          keyFactors.push({ name: 'High Stress Level', impact: 'High', description: 'Chronic stress significantly increases depression risk' });
        } else if (data.stressLevel > 5) {
          riskPoints += 1;
          keyFactors.push({ name: 'Moderate Stress Level', impact: 'Moderate', description: 'Elevated stress may contribute to mental health concerns' });
        }

        if (data.sleepQuality <= 3) {
          riskPoints += 3;
          keyFactors.push({ name: 'Poor Sleep Quality', impact: 'High', description: 'Sleep disturbances are strongly linked to depression' });
        } else if (data.sleepQuality <= 5) {
          riskPoints += 1;
          keyFactors.push({ name: 'Suboptimal Sleep', impact: 'Moderate', description: 'Sleep quality affects mood regulation' });
        }

        if (data.socialSupport <= 3) {
          riskPoints += 3;
          keyFactors.push({ name: 'Limited Social Support', impact: 'High', description: 'Social isolation is a major risk factor for depression' });
        } else if (data.socialSupport <= 5) {
          riskPoints += 1;
          keyFactors.push({ name: 'Moderate Social Support', impact: 'Moderate', description: 'Enhanced social connections could benefit mental health' });
        }

        if (data.physicalActivity < 30) {
          riskPoints += 2;
          keyFactors.push({ name: 'Low Physical Activity', impact: 'Moderate', description: 'Regular exercise is crucial for mental wellbeing' });
        }

        if (data.dietQuality <= 4) {
          riskPoints += 1;
          keyFactors.push({ name: 'Poor Diet Quality', impact: 'Moderate', description: 'Nutrition directly impacts brain health and mood' });
        }

        if (data.geneticHistory) {
          riskPoints += 2;
          keyFactors.push({ name: 'Family History', impact: 'High', description: 'Genetic predisposition increases depression risk' });
        }

        // Age and demographic factors
        if (data.age < 25 || data.age > 65) {
          riskPoints += 1;
          keyFactors.push({ name: 'Age Factor', impact: 'Moderate', description: 'Certain age groups have higher depression rates' });
        }

        if (data.employmentStatus === 'unemployed') {
          riskPoints += 2;
          keyFactors.push({ name: 'Unemployment Stress', impact: 'High', description: 'Job loss and financial stress impact mental health' });
        }

        if (data.maritalStatus === 'divorced' || data.maritalStatus === 'widowed') {
          riskPoints += 1;
          keyFactors.push({ name: 'Relationship Changes', impact: 'Moderate', description: 'Major life transitions can trigger depression' });
        }

        // Medical conditions impact
        if (data.medicalConditions && data.medicalConditions.length > 0) {
          riskPoints += data.medicalConditions.length >= 2 ? 2 : 1;
          keyFactors.push({ name: 'Medical Conditions', impact: 'Moderate', description: 'Chronic health issues can affect mental wellbeing' });
        }

        // Determine risk level and type
        let riskLevel = 'low';
        let depressionType = 'Low Depression Risk';
        let description = 'Your current risk factors suggest a lower likelihood of depression. Continue monitoring your mental health and maintaining healthy habits.';
        let severity = 'Minimal Risk';

        if (riskPoints >= 12) {
          riskLevel = 'high';
          severity = 'High Risk';
          depressionType = 'Major Depressive Episode Risk';
          description = 'Multiple significant risk factors indicate a high likelihood of depression. Immediate professional evaluation and intervention are strongly recommended.';
          recommendations = [
            'Seek immediate professional help from a mental health specialist or psychiatrist',
            'Consider evidence-based therapy options such as Cognitive Behavioral Therapy (CBT) or Interpersonal Therapy',
            'Discuss medication options with a qualified psychiatrist if appropriate',
            'Develop a crisis plan and emergency contacts for mental health support',
            'Focus on basic self-care: regular meals, sleep hygiene, and daily structure',
            'Avoid isolation - maintain regular contact with supportive friends and family',
            'Consider joining support groups for individuals with depression'
          ];
        } else if (riskPoints >= 6) {
          riskLevel = 'moderate';
          severity = 'Moderate Risk';
          depressionType = 'Mild to Moderate Depression Risk';
          description = 'Several risk factors suggest you may be experiencing some depressive symptoms or are at risk for developing depression. Professional consultation is recommended.';
          recommendations = [
            'Schedule an appointment with your healthcare provider to discuss your mental health',
            'Consider counseling or therapy as a preventive measure',
            'Implement stress management techniques such as meditation, yoga, or deep breathing',
            'Prioritize sleep hygiene and aim for 7-9 hours of quality sleep nightly',
            'Increase social connections and activities that bring you joy',
            'Establish a regular exercise routine - even 30 minutes of walking can help',
            'Monitor your mood and symptoms regularly using a mood journal'
          ];
        } else {
          recommendations = [
            'Continue maintaining your current healthy lifestyle habits',
            'Stay connected with supportive friends and family members',
            'Practice regular self-care activities that promote wellbeing',
            'Maintain a consistent sleep schedule and good sleep hygiene',
            'Keep up with regular physical activity and balanced nutrition',
            'Practice stress management techniques during challenging times',
            'Stay aware of changes in your mood and seek help if needed'
          ];
        }

        // Add universal recommendations
        recommendations.push(
          'Remember that mental health is just as important as physical health',
          'Consider learning about mental health resources in your community'
        );

        resolve({
          riskLevel,
          severity,
          depressionType,
          description,
          keyFactors,
          recommendations,
          riskScore: riskPoints,
          maxScore: 20,
          assessmentDate: new Date().toISOString(),
          personalInfo: {
            age: data.age,
            gender: data.gender,
            maritalStatus: data.maritalStatus,
            employmentStatus: data.employmentStatus
          }
        });
      }, 2500);
    });
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNumericChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleConditionsChange = (e) => {
    setConditions(e.target.value);
  };

  const toggleHelp = (field) => {
    setShowHelp(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.age >= 13 && formData.age <= 100;
      case 2:
        return true;
      case 3:
        return formData.stressLevel >= 1 && formData.stressLevel <= 10;
      case 4:
        return formData.physicalActivity >= 0 && formData.physicalActivity <= 100;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const medicalConditions = conditions
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');

      const results = await analyzeDepression({
        ...formData,
        medicalConditions
      });

      setAnalysisResults(results);
      setCurrentView('results');
      setLoading(false);
    } catch (err) {
      console.error('Error submitting depression analysis:', err);
      setError('An error occurred while processing your submission. Please try again.');
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setCurrentView('assessment');
    setCurrentStep(1);
    setAnalysisResults(null);
    setError(null);
    setFormData({
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
    setConditions('');
  };

  const renderProgressBar = () => (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="text-muted mb-0 fw-semibold">Assessment Progress</h6>
        <span className="badge bg-primary fs-6 px-3 py-2">{currentStep} of {totalSteps}</span>
      </div>
      <div className="progress" style={{ height: '12px', borderRadius: '10px' }}>
        <div 
          className="progress-bar bg-gradient progress-bar-striped progress-bar-animated" 
          role="progressbar" 
          style={{ 
            width: `${(currentStep / totalSteps) * 100}%`,
            background: 'linear-gradient(45deg, #667eea, #764ba2)'
          }}
          aria-valuenow={currentStep} 
          aria-valuemin="0" 
          aria-valuemax={totalSteps}
        ></div>
      </div>
    </div>
  );

  const renderHelpTooltip = (field, content) => (
    <div className="position-relative d-inline-block">
      <FaQuestionCircle 
        className="text-primary ms-2 cursor-pointer" 
        onClick={() => toggleHelp(field)}
        style={{ cursor: 'pointer', fontSize: '0.9rem' }}
      />
      {showHelp[field] && (
        <div className="position-absolute top-100 start-0 bg-dark text-white p-3 rounded shadow-lg border" 
             style={{ fontSize: '0.85rem', maxWidth: '280px', zIndex: 1000, marginTop: '5px' }}>
          <div className="d-flex justify-content-between align-items-start">
            <span>{content}</span>
            <button 
              className="btn-close btn-close-white ms-2" 
              style={{ fontSize: '0.7rem' }}
              onClick={() => toggleHelp(field)}
            ></button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSliderWithLabels = (name, value, min, max, labels, icon, color = 'primary') => (
    <div className="mb-4">
      <label htmlFor={name} className="form-label d-flex align-items-center mb-3">
        {icon && <span className="me-2" style={{ color: `var(--bs-${color})` }}>{icon}</span>}
        <span className="fw-semibold">{labels.title}</span>
        <span className={`ms-auto badge bg-${color} fs-6 px-3 py-2`}>{value}{labels.unit || `/${max}`}</span>
        {labels.help && renderHelpTooltip(name, labels.help)}
      </label>
      <div className="px-3">
        <input 
          type="range" 
          className="form-range" 
          id={name}
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleNumericChange(name, e.target.value)}
          style={{ 
            height: '8px',
            background: `linear-gradient(to right, var(--bs-${color}) 0%, var(--bs-${color}) ${((value - min) / (max - min)) * 100}%, #dee2e6 ${((value - min) / (max - min)) * 100}%, #dee2e6 100%)`,
            borderRadius: '10px'
          }}
          required
        />
        <div className="d-flex justify-content-between small text-muted mt-2 px-1">
          <span className="fw-medium">{labels.low}</span>
          <span className="fw-medium">{labels.high}</span>
        </div>
      </div>
    </div>
  );

  const renderRiskBadge = (level, severity) => {
    const badges = {
      low: { 
        bg: 'success', 
        icon: <FaCheckCircle className="me-2" />,
        gradient: 'linear-gradient(45deg, #28a745, #20c997)'
      },
      moderate: { 
        bg: 'warning', 
        icon: <FaInfoCircle className="me-2" />,
        gradient: 'linear-gradient(45deg, #ffc107, #fd7e14)'
      },
      high: { 
        bg: 'danger', 
        icon: <FaExclamationTriangle className="me-2" />,
        gradient: 'linear-gradient(45deg, #dc3545, #e83e8c)'
      }
    };

    const badge = badges[level] || badges.low;

    return (
      <div className="text-center mb-4">
        <div 
          className="d-inline-block px-5 py-4 rounded-3 shadow-lg text-white"
          style={{ background: badge.gradient }}
        >
          <h3 className="mb-0 fw-bold">
            {badge.icon}
            {severity}
          </h3>
        </div>
      </div>
    );
  };

  const renderFactorBadge = (impact) => {
    const impacts = {
      High: { color: 'danger', icon: '●' },
      Moderate: { color: 'warning', icon: '●' },
      Low: { color: 'info', icon: '●' }
    };
    const config = impacts[impact] || impacts.Low;
    return `text-${config.color}`;
  };

  const renderStep = () => {
    const stepConfigs = [
      {
        icon: <FaUser size={24} />,
        title: 'Personal Information',
        color: 'primary',
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        icon: <FaUsers size={24} />,
        title: 'Social & Professional Status',
        color: 'success',
        bg: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)'
      },
      {
        icon: <FaBrain size={24} />,
        title: 'Mental Health Factors',
        color: 'warning',
        bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        icon: <FaHeart size={24} />,
        title: 'Physical Health & Lifestyle',
        color: 'info',
        bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      {
        icon: <FaStethoscope size={24} />,
        title: 'Medical History',
        color: 'secondary',
        bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      }
    ];

    const currentConfig = stepConfigs[currentStep - 1];

    switch (currentStep) {
      case 1:
        return (
          <div className="card border-0 shadow-lg">
            <div className="card-header text-white py-4" style={{ background: currentConfig.bg }}>
              <h4 className="mb-0 d-flex align-items-center">
                {currentConfig.icon}
                <span className="ms-3">{currentConfig.title}</span>
              </h4>
            </div>
            <div className="card-body p-5">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="age" className="form-label fw-semibold">
                    Age {renderHelpTooltip('age', 'Your current age helps us understand age-related depression risk patterns and provide appropriate recommendations.')}
                  </label>
                  <input 
                    type="number" 
                    className="form-control form-control-lg border-2" 
                    id="age"
                    min="13"
                    max="100"
                    value={formData.age}
                    onChange={(e) => handleNumericChange('age', e.target.value)}
                    style={{ borderRadius: '12px' }}
                    required
                  />
                  <div className="form-text">Must be between 13 and 100 years</div>
                </div>
                <div className="col-md-6 mb-4">
                  <label htmlFor="gender" className="form-label fw-semibold">
                    Gender {renderHelpTooltip('gender', 'Gender can influence depression risk factors due to biological, psychological, and social differences.')}
                  </label>
                  <select 
                    className="form-select form-select-lg border-2" 
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    style={{ borderRadius: '12px' }}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="card border-0 shadow-lg">
            <div className="card-header text-white py-4" style={{ background: currentConfig.bg }}>
              <h4 className="mb-0 d-flex align-items-center">
                {currentConfig.icon}
                <span className="ms-3">{currentConfig.title}</span>
              </h4>
            </div>
            <div className="card-body p-5">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="maritalStatus" className="form-label fw-semibold">
                    Marital Status {renderHelpTooltip('marital', 'Relationship status affects social support levels and can influence mental health outcomes.')}
                  </label>
                  <select 
                    className="form-select form-select-lg border-2" 
                    id="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                    style={{ borderRadius: '12px' }}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="married">Married/Partnership</option>
                    <option value="divorced">Divorced/Separated</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                <div className="col-md-6 mb-4">
                  <label htmlFor="employmentStatus" className="form-label fw-semibold">
                    Employment Status {renderHelpTooltip('employment', 'Work status impacts financial security, daily structure, and self-esteem, all of which affect mental health.')}
                  </label>
                  <select 
                    className="form-select form-select-lg border-2" 
                    id="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={(e) => handleChange('employmentStatus', e.target.value)}
                    style={{ borderRadius: '12px' }}
                    required
                  >
                    <option value="employed">Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="card border-0 shadow-lg">
            <div className="card-header text-white py-4" style={{ background: currentConfig.bg }}>
              <h4 className="mb-0 d-flex align-items-center">
                {currentConfig.icon}
                <span className="ms-3">{currentConfig.title}</span>
              </h4>
            </div>
            <div className="card-body p-5">
              <div className="row">
                <div className="col-md-6">
                  {renderSliderWithLabels(
                    'stressLevel',
                    formData.stressLevel,
                    1,
                    10,
                    {
                      title: 'Current Stress Level',
                      low: 'Very Low',
                      high: 'Extremely High',
                      help: 'Rate your overall stress level considering work, relationships, finances, and daily pressures.'
                    },
                    <FaExclamationTriangle />,
                    'danger'
                  )}
                </div>
                <div className="col-md-6">
                  {renderSliderWithLabels(
                    'sleepQuality',
                    formData.sleepQuality,
                    1,
                    10,
                    {
                      title: 'Sleep Quality',
                      low: 'Very Poor',
                      high: 'Excellent',
                      help: 'Consider how well you sleep, how rested you feel, and any sleep disturbances you experience.'
                    },
                    <FaBed />,
                    'info'
                  )}
                </div>
              </div>
              <div className="mt-4">
                {renderSliderWithLabels(
                  'socialSupport',
                  formData.socialSupport,
                  1,
                  10,
                  {
                    title: 'Social Support Level',
                    low: 'Very Isolated',
                    high: 'Well Connected',
                    help: 'Think about the emotional support you receive from family, friends, and your community.'
                  },
                  <FaUsers />,
                  'success'
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="card border-0 shadow-lg">
            <div className="card-header text-white py-4" style={{ background: currentConfig.bg }}>
              <h4 className="mb-0 d-flex align-items-center">
                {currentConfig.icon}
                <span className="ms-3">{currentConfig.title}</span>
              </h4>
            </div>
            <div className="card-body p-5">
              <div className="row">
                <div className="col-md-6">
                  {renderSliderWithLabels(
                    'physicalActivity',
                    formData.physicalActivity,
                    0,
                    100,
                    {
                      title: 'Physical Activity',
                      unit: ' mins/week',
                      low: '0 mins',
                      high: '100+ mins',
                      help: 'Include all forms of exercise: walking, sports, gym workouts, yoga, or any physical activity.'
                    },
                    <FaRunning />,
                    'primary'
                  )}
                </div>
                <div className="col-md-6">
                  {renderSliderWithLabels(
                    'dietQuality',
                    formData.dietQuality,
                    1,
                    10,
                    {
                      title: 'Diet Quality',
                      low: 'Very Poor',
                      high: 'Excellent',
                      help: 'Consider the balance, variety, and nutritional value of your regular meals and eating habits.'
                    },
                    <FaUtensils />,
                    'success'
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="card border-0 shadow-lg">
            <div className="card-header text-white py-4" style={{ background: currentConfig.bg }}>
              <h4 className="mb-0 d-flex align-items-center">
                {currentConfig.icon}
                <span className="ms-3">{currentConfig.title}</span>
              </h4>
            </div>
            <div className="card-body p-5">
              <div className="mb-5">
                <div className="form-check form-switch d-flex align-items-center">
                  <input 
                    className="form-check-input me-3" 
                    type="checkbox" 
                    id="geneticHistory"
                    checked={formData.geneticHistory}
                    onChange={(e) => handleCheckboxChange('geneticHistory', e.target.checked)}
                    style={{ transform: 'scale(1.3)' }}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="geneticHistory">
                    Family history of depression or mental health conditions
                    {renderHelpTooltip('genetic', 'Family history of depression, anxiety, bipolar disorder, or other mental health conditions can increase your risk.')}
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="medicalConditions" className="form-label fw-semibold">
                  Medical Conditions (Optional) {renderHelpTooltip('medical', 'Chronic conditions like diabetes, heart disease, thyroid disorders, or chronic pain can affect mental health.')}
                </label>
                <textarea 
                  className="form-control border-2" 
                  id="medicalConditions"
                  rows="4"
                  placeholder="e.g., Thyroid disorder, Diabetes, Chronic pain, Heart disease..."
                  value={conditions}
                  onChange={handleConditionsChange}
                  style={{ borderRadius: '12px' }}
                ></textarea>
                <div className="form-text">Separate multiple conditions with commas. This information helps provide more accurate recommendations.</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => (
    <div className="card border-0 shadow-lg">
      <div className="card-header py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="d-flex align-items-center text-white">
          <FaChartLine size={28} className="me-3" />
          <div>
            <h2 className="mb-1 fw-bold">Depression Risk Analysis Results</h2>
            <p className="mb-0 opacity-90">Comprehensive Mental Health Assessment</p>
          </div>
        </div>
      </div>
      <div className="card-body p-5">
        {/* Risk Assessment */}
        {renderRiskBadge(analysisResults.riskLevel, analysisResults.severity)}
        
        {/* Summary Info */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="d-flex align-items-center text-muted mb-3">
              <FaCalendarAlt className="me-2" />
              <span>Assessment Date: {new Date(analysisResults.assessmentDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-center text-muted mb-3">
              <FaUser className="me-2" />
              <span>Age: {analysisResults.personalInfo.age} | Gender: {analysisResults.personalInfo.gender}</span>
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div className="mb-5">
          <h4 className="text-primary mb-3">
            <FaChartLine className="me-2" />
            Risk Score Analysis
          </h4>
          <div className="card border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-semibold">Your Risk Score</span>
                <span className="badge bg-primary fs-6 px-3 py-2">{analysisResults.riskScore} / {analysisResults.maxScore}</span>
              </div>
              <div className="progress mb-3" style={{ height: '12px' }}>
                <div 
                  className={`progress-bar bg-${analysisResults.riskLevel === 'high' ? 'danger' : analysisResults.riskLevel === 'moderate' ? 'warning' : 'success'}`}
                  role="progressbar" 
                  style={{ width: `${(analysisResults.riskScore / analysisResults.maxScore) * 100}%` }}
                ></div>
              </div>
              <h5 className="card-title text-primary">{analysisResults.depressionType}</h5>
              <p className="card-text">{analysisResults.description}</p>
            </div>
          </div>
        </div>

        {/* Key Contributing Factors */}
        {analysisResults.keyFactors && analysisResults.keyFactors.length > 0 && (
          <div className="mb-5">
            <h4 className="text-warning mb-4">
              <FaExclamationTriangle className="me-2" />
              Key Contributing Factors
            </h4>
            <div className="row">
              {analysisResults.keyFactors.map((factor, index) => (
                <div key={index} className="col-md-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="card-title mb-0 fw-semibold">{factor.name}</h6>
                        <span className={`badge bg-${factor.impact === 'High' ? 'danger' : factor.impact === 'Moderate' ? 'warning' : 'info'}`}>
                          {factor.impact} Impact
                        </span>
                      </div>
                      <p className="card-text small text-muted">{factor.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {analysisResults.recommendations && analysisResults.recommendations.length > 0 && (
          <div className="mb-5">
            <h4 className="text-success mb-4">
              <FaLightbulb className="me-2" />
              Personalized Recommendations
            </h4>
            <div className="card border-success">
              <div className="card-body">
                <div className="row">
                  {analysisResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="col-12 mb-3">
                      <div className="d-flex align-items-start">
                        <FaCheckCircle className="text-success me-3 mt-1 flex-shrink-0" />
                        <p className="mb-0">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Resources */}
        {analysisResults.riskLevel === 'high' && (
          <div className="mb-5">
            <div className="alert alert-danger border-danger">
              <h5 className="alert-heading d-flex align-items-center text-danger">
                <FaExclamationTriangle className="me-2" />
                Emergency Mental Health Resources
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2"><strong>National Suicide Prevention Lifeline:</strong></p>
                  <p className="mb-2">📞 <strong>988</strong> (24/7 Crisis Support)</p>
                  <p className="mb-2"><strong>Crisis Text Line:</strong></p>
                  <p className="mb-3">📱 Text <strong>HOME</strong> to <strong>741741</strong></p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2"><strong>Emergency Services:</strong></p>
                  <p className="mb-2">🚨 <strong>911</strong> (Immediate Emergencies)</p>
                  <p className="mb-2"><strong>Online Support:</strong></p>
                  <p className="mb-0">🌐 <a href="https://suicidepreventionlifeline.org" target="_blank" rel="noopener noreferrer">suicidepreventionlifeline.org</a></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Disclaimer */}
        <div className="alert alert-info border-info mb-4">
          <h5 className="alert-heading d-flex align-items-center">
            <FaInfoCircle className="me-2" />
            Important Medical Disclaimer
          </h5>
          <p className="mb-2">
            This assessment is designed for informational and educational purposes only. It is not intended to be a substitute 
            for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare 
            provider with any questions you may have regarding a medical condition.
          </p>
          <hr />
          <p className="mb-0">
            <strong>Next Steps:</strong> Consider sharing these results with your healthcare provider for a comprehensive evaluation 
            and to discuss appropriate treatment options if needed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <button 
            onClick={resetAssessment}
            className="btn btn-primary btn-lg px-4"
          >
            <FaArrowLeft className="me-2" /> Take New Assessment
          </button>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => window.print()}
            >
              <FaPrint className="me-2" />
              Print Results
            </button>
            <button 
              className="btn btn-outline-primary btn-lg px-4"
              onClick={() => {
                const resultsText = `Depression Risk Assessment Results
                
Risk Level: ${analysisResults.severity}
Assessment Date: ${new Date(analysisResults.assessmentDate).toLocaleDateString()}
Risk Score: ${analysisResults.riskScore}/${analysisResults.maxScore}

${analysisResults.depressionType}
${analysisResults.description}

Key Factors:
${analysisResults.keyFactors.map(f => `• ${f.name} (${f.impact} Impact)`).join('\n')}

Recommendations:
${analysisResults.recommendations.map(r => `• ${r}`).join('\n')}

Important: This is not a medical diagnosis. Consult healthcare professionals for proper evaluation.`;
                
                navigator.clipboard.writeText(resultsText).then(() => {
                  alert('Results copied to clipboard!');
                }).catch(() => {
                  alert('Unable to copy to clipboard. Please use print option.');
                });
              }}
            >
              <FaShare className="me-2" />
              Share Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === 'results' && analysisResults) {
    return (
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {renderResults()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center text-white mb-5">
              <h1 className="display-4 fw-bold mb-3">
                <FaBrain className="me-3" />
                Depression Risk Assessment
              </h1>
              <p className="lead">
                A comprehensive, evidence-based analysis to understand your mental health risk factors and receive personalized recommendations.
              </p>
              <div className="d-flex justify-content-center gap-4 mt-4">
                <div className="text-center">
                  <FaShieldAlt size={24} className="mb-2" />
                  <div className="small">Confidential</div>
                </div>
                <div className="text-center">
                  <FaChartLine size={24} className="mb-2" />
                  <div className="small">Evidence-Based</div>
                </div>
                <div className="text-center">
                  <FaHeart size={24} className="mb-2" />
                  <div className="small">Professional Grade</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                {renderProgressBar()}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
                <FaExclamationTriangle className="me-2" />
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Loading Overlay */}
            {loading && (
              <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                   style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999 }}>
                <div className="text-center text-white">
                  <FaSpinner className="fa-spin mb-3" size={48} />
                  <h4>Analyzing Your Mental Health Risk Factors...</h4>
                  <p>This may take a few moments</p>
                  <div className="progress mx-auto" style={{ width: '300px', height: '8px' }}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                         role="progressbar" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Step */}
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button 
                type="button" 
                className="btn btn-outline-light btn-lg px-4"
                onClick={prevStep}
                disabled={currentStep === 1}
                style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
              >
                <FaArrowLeft className="me-2" />
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button 
                  type="button" 
                  className="btn btn-light btn-lg px-4"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                >
                  Next <FaArrowRight className="ms-2" />
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-success btn-lg px-4"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spinner-border spinner-border-sm me-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FaChartLine className="me-2" />
                      Get My Results
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="card border-0 shadow-sm mt-5">
              <div className="card-body">
                <div className="alert alert-info border-0 mb-0">
                  <h5 className="alert-heading d-flex align-items-center">
                    <FaShieldAlt className="me-2" />
                    Privacy & Confidentiality Guarantee
                  </h5>
                  <p className="mb-2">
                    Your responses are completely confidential and used solely for this assessment. 
                    We use evidence-based algorithms developed in consultation with mental health professionals.
                    This tool provides educational insights and is not a substitute for professional medical advice.
                  </p>
                  <hr />
                  <p className="mb-0 small">
                    <strong>Crisis Support:</strong> If you're experiencing thoughts of self-harm, please contact emergency services (911) 
                    or call the National Suicide Prevention Lifeline at <strong>988</strong> immediately. 
                    Help is available 24/7.
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

export default ProfessionalDepressionSystem;