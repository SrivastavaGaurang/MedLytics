import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, CheckCircle, Clock, User, Activity, Brain, FileText } from 'lucide-react';

// AOS is imported and initialized in useEffect
const AnxietyPrediction = () => {
  // Initialize AOS
  useEffect(() => {
    // In a real application, AOS would be imported and initialized here
    // AOS.init({ duration: 800, once: true });
    
    // For our demo, we'll simulate AOS with CSS animations
    const elements = document.querySelectorAll('.aos-animate');
    elements.forEach(el => {
      el.classList.add('animated');
    });
  }, []);

  const [formData, setFormData] = useState({
    school_year: 1,
    age: 18,
    gender: 'male',
    bmi: 22.0,
    who_bmi: 'Normal',
    phq_score: 0,
    anxiousness: false,
    suicidal: false,
    epworth_score: 0
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

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
    const parsedValue = value === '' ? '' : parseFloat(value);
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
    window.scrollTo(0, 0);
  };

  const validateCurrentStep = () => {
    // Basic validation
    switch (activeStep) {
      case 1:
        return formData.age >= 13 && formData.age <= 100;
      case 2:
        return formData.bmi >= 10 && formData.bmi <= 50 && 
               formData.epworth_score >= 0 && formData.epworth_score <= 24;
      case 3:
        return formData.phq_score >= 0 && formData.phq_score <= 27;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Use multiple factors to determine severity
      let severity;
      const anxietyScore = calculateAnxietyScore();
      
      if (anxietyScore < 5) severity = 'Minimal';
      else if (anxietyScore < 10) severity = 'Mild';
      else if (anxietyScore < 15) severity = 'Moderate';
      else severity = 'Severe';
      
      setPrediction(severity);
      setLoading(false);
      setActiveStep(4);
    }, 1500);
  };

  const calculateAnxietyScore = () => {
    // Basic algorithm to calculate anxiety score based on inputs
    let score = 0;
    
    // PHQ score contributes significantly
    score += formData.phq_score * 0.5;
    
    // Direct anxiety indicators
    if (formData.anxiousness) score += 5;
    if (formData.suicidal) score += 7;
    
    // Sleep issues
    score += formData.epworth_score * 0.2;
    
    // BMI factors (extreme values correlate with anxiety)
    if (formData.who_bmi === 'Underweight' || formData.who_bmi === 'Obese') {
      score += 1;
    }
    
    return score;
  };

  // UI for severity level
  const getSeverityUI = (severity) => {
    switch(severity) {
      case 'Minimal':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={24} />
            <span className="font-semibold">Minimal</span>
          </div>
        );
      case 'Mild':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Info size={24} />
            <span className="font-semibold">Mild</span>
          </div>
        );
      case 'Moderate':
        return (
          <div className="flex items-center gap-2 text-orange-600">
            <AlertCircle size={24} />
            <span className="font-semibold">Moderate</span>
          </div>
        );
      case 'Severe':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={24} />
            <span className="font-semibold">Severe</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getRecommendations = (severity) => {
    switch(severity) {
      case 'Minimal':
        return "Continue practicing self-care. Regular exercise, mindfulness, and maintaining social connections can help preserve your mental wellbeing.";
      case 'Mild':
        return "Consider stress-reduction techniques like meditation, yoga, or deep breathing exercises. Establish a consistent sleep schedule and limit caffeine and alcohol.";
      case 'Moderate':
        return "You may benefit from speaking with a mental health professional. Consider counseling or therapy to develop coping strategies for managing anxiety.";
      case 'Severe':
        return "We strongly recommend consulting with a healthcare provider as soon as possible. Professional treatment can significantly improve your quality of life.";
      default:
        return "";
    }
  };

  // Step icons
  const getStepIcon = (step) => {
    switch(step) {
      case 1: return <User size={22} />;
      case 2: return <Activity size={22} />;
      case 3: return <Brain size={22} />;
      case 4: return <FileText size={22} />;
      default: return null;
    }
  };

  // Custom animated card component
  const AnimatedCard = ({ children, delay = 0 }) => (
    <div 
      className="aos-animate bg-white rounded-xl shadow-lg p-6 transition-all duration-500 opacity-0 translate-y-10" 
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );

  // Stylesheet for AOS-like animations (since we can't import AOS directly)
  const AOS_Styles = () => (
    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .aos-animate.animated {
        animation: fadeInUp 0.8s ease forwards;
      }
    `}</style>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-4 md:p-8">
      <AOS_Styles />
      
      <div className="max-w-4xl mx-auto">
        <AnimatedCard delay={100}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 -mx-6 -mt-6 p-6 rounded-t-xl text-white mb-6">
            <h1 className="text-3xl font-bold">Anxiety Assessment Tool</h1>
            <p className="text-blue-100 mt-2">Complete the assessment to evaluate your anxiety level</p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  className={`flex flex-col items-center ${step <= activeStep ? 'text-blue-700' : 'text-gray-400'}`}
                >
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full mb-1 transition-all duration-300 ${
                      step < activeStep ? 'bg-blue-700 text-white' : 
                      step === activeStep ? 'bg-blue-100 text-blue-700 border-2 border-blue-700' : 
                      'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {getStepIcon(step)}
                  </div>
                  <span className="text-xs hidden md:block">
                    {step === 1 ? 'Personal' : 
                     step === 2 ? 'Health' : 
                     step === 3 ? 'Mental Health' : 'Results'}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className="bg-blue-700 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${(activeStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div>
            {activeStep === 1 && (
              <div className="space-y-6 aos-animate">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User size={24} className="text-blue-700" />
                  Personal Information
                </h2>
                <p className="text-gray-600">Please provide your basic information to help with the assessment.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" 
                      value={formData.school_year}
                      onChange={(e) => handleChange('school_year', parseInt(e.target.value))}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="13"
                      max="100"
                      value={formData.age}
                      onChange={(e) => handleNumericChange('age', e.target.value)}
                    />
                    {formData.age < 13 || formData.age > 100 ? (
                      <p className="text-red-500 text-xs mt-1">Please enter an age between 13 and 100</p>
                    ) : null}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6 aos-animate">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Activity size={24} className="text-blue-700" />
                  Health Metrics
                </h2>
                <p className="text-gray-600">Please provide your health measurements.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                    <input 
                      type="number"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="10"
                      max="50"
                      value={formData.bmi}
                      onChange={(e) => handleNumericChange('bmi', e.target.value)}
                    />
                    {(formData.bmi < 10 || formData.bmi > 50) && formData.bmi !== '' ? (
                      <p className="text-red-500 text-xs mt-1">Please enter a BMI between 10 and 50</p>
                    ) : null}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BMI Category</label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      value={formData.who_bmi}
                      onChange={(e) => handleChange('who_bmi', e.target.value)}
                    >
                      <option value="Underweight">Underweight</option>
                      <option value="Normal">Normal</option>
                      <option value="Overweight">Overweight</option>
                      <option value="Obese">Obese</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Epworth Sleepiness Score
                      <span className="ml-1 text-xs text-gray-500">(0-24)</span>
                    </label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="24"
                      value={formData.epworth_score}
                      onChange={(e) => handleNumericChange('epworth_score', e.target.value)}
                    />
                    {(formData.epworth_score < 0 || formData.epworth_score > 24) && formData.epworth_score !== '' ? (
                      <p className="text-red-500 text-xs mt-1">Please enter a score between 0 and 24</p>
                    ) : null}
                    <p className="text-xs text-gray-500 mt-1">
                      The Epworth Sleepiness Scale measures your general level of daytime sleepiness.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6 aos-animate">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Brain size={24} className="text-blue-700" />
                  Mental Health Assessment
                </h2>
                <p className="text-gray-600">Please answer the following questions about your mental health.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PHQ-9 Score (Depression Scale)
                      <span className="ml-1 text-xs text-gray-500">(0-27)</span>
                    </label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="27"
                      value={formData.phq_score}
                      onChange={(e) => handleNumericChange('phq_score', e.target.value)}
                    />
                    {(formData.phq_score < 0 || formData.phq_score > 27) && formData.phq_score !== '' ? (
                      <p className="text-red-500 text-xs mt-1">Please enter a score between 0 and 27</p>
                    ) : null}
                    <p className="text-xs text-gray-500 mt-1">
                      The PHQ-9 is a depression screening tool that scores each of the 9 DSM-IV criteria.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-blue-50 rounded-xl shadow-sm">
                    <h3 className="text-md font-medium text-blue-800 mb-4">Mental Health Screening</h3>
                    
                    <div className="flex items-center mb-4 p-2 hover:bg-blue-100 rounded-lg transition-colors">
                      <input 
                        id="anxiousness"
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                        checked={formData.anxiousness}
                        onChange={(e) => handleCheckboxChange('anxiousness', e.target.checked)}
                      />
                      <label htmlFor="anxiousness" className="ml-3 text-sm font-medium text-gray-700">
                        Do you often feel anxious or worried about several areas of your life?
                      </label>
                    </div>
                    
                    <div className="flex items-center p-2 hover:bg-blue-100 rounded-lg transition-colors">
                      <input 
                        id="suicidal"
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                        checked={formData.suicidal}
                        onChange={(e) => handleCheckboxChange('suicidal', e.target.checked)}
                      />
                      <label htmlFor="suicidal" className="ml-3 text-sm font-medium text-gray-700">
                        Have you had thoughts that you would be better off dead or of hurting yourself?
                      </label>
                    </div>
                    
                    {formData.suicidal && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        <p className="font-medium">If you're having thoughts of harming yourself:</p>
                        <p className="mt-1">Please reach out to a mental health professional, call a crisis helpline, or visit your local emergency room.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="text-center aos-animate">
                {loading ? (
                  <div className="py-12 flex flex-col items-center">
                    <Clock className="animate-spin text-blue-600 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-800">Processing your results...</h3>
                    <p className="text-gray-600 mt-2">This will only take a moment</p>
                  </div>
                ) : prediction ? (
                  <div className="py-8">
                    <div className="mb-8">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full">
                        <AlertCircle size={48} className="text-blue-700" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Your Assessment Results</h3>
                    <p className="text-gray-600 mb-8">Based on your responses, your anxiety level is:</p>
                    
                    <div className="mb-8 flex justify-center">
                      <div className={`text-xl font-bold px-6 py-3 rounded-full ${
                        prediction === 'Minimal' ? 'bg-green-100 text-green-800' : 
                        prediction === 'Mild' ? 'bg-blue-100 text-blue-800' :
                        prediction === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getSeverityUI(prediction)}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-6 rounded-xl text-left mb-8">
                      <h4 className="font-medium text-blue-800 mb-3 text-lg">Recommendations</h4>
                      <p className="text-blue-700">
                        {getRecommendations(prediction)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-left text-sm text-gray-600">
                      <p className="font-medium text-gray-800 mb-1">Important Note:</p>
                      <p>
                        This assessment provides a general indication and is not a medical diagnosis.
                        We recommend consulting with a healthcare professional for a comprehensive evaluation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <h3 className="text-xl font-semibold text-gray-800">Preparing your assessment</h3>
                    <p className="text-gray-600 mt-2">Click submit to see your results</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {activeStep > 1 && (
                <button 
                  className="px-5 py-2.5 text-sm font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={prevStep}
                >
                  Back
                </button>
              )}
              
              {activeStep === 1 && (
                <div></div> // Empty div to maintain layout with justify-between
              )}
              
              {activeStep < 3 && (
                <button 
                  className="px-5 py-2.5 text-sm font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-auto"
                  onClick={nextStep}
                  disabled={
                    (activeStep === 1 && (formData.age < 13 || formData.age > 100)) ||
                    (activeStep === 2 && ((formData.bmi < 10 || formData.bmi > 50) || 
                                         (formData.epworth_score < 0 || formData.epworth_score > 24)))
                  }
                >
                  Continue
                </button>
              )}
              
              {activeStep === 3 && (
                <button 
                  className="px-5 py-2.5 text-sm font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-auto flex items-center gap-2"
                  onClick={handleSubmit}
                  disabled={loading || (formData.phq_score < 0 || formData.phq_score > 27)}
                >
                  {loading ? 'Processing...' : 'Submit Assessment'}
                </button>
              )}
              
              {prediction && (
                <button 
                  className="px-6 py-3 text-sm font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mx-auto"
                  onClick={() => {
                    setPrediction(null);
                    setActiveStep(1);
                    window.scrollTo(0, 0);
                  }}
                >
                  Start New Assessment
                </button>
              )}
            </div>
          </div>
        </AnimatedCard>
        
        {/* Disclaimer */}
        <div className="mt-6 text-center text-xs text-gray-500 aos-animate" style={{ animationDelay: '400ms' }}>
          <p>This tool is for informational purposes only and is not a substitute for professional medical advice.</p>
          <p className="mt-1">© {new Date().getFullYear()} Anxiety Assessment Tool. All rights reserved.</p>
        </div>
              </div>
    </div>
  );
};

export default AnxietyPrediction;