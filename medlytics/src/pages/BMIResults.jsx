// src/pages/BMIResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBMIResult } from '../services/bmiService';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './BMIResult.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const BMIResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (!id) {
      setError("No result ID provided");
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        setLoading(true);
        const data = await getBMIResult(id);
        
        if (!data || !data.result) {
          throw new Error("Invalid data structure received");
        }
        
        setResultData(data.result);
      } catch (err) {
        console.error("Error in fetchResult:", err);
        setError(err.message || 'Failed to fetch BMI analysis result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const getBadgeColor = (category) => {
    switch (category) {
      case 'Underweight': return 'warning';
      case 'Normal': return 'success';
      case 'Overweight': return 'warning';
      case 'Obesity': return 'danger';
      default: return 'secondary';
    }
  };

  const getProgressValue = (category) => {
    switch (category) {
      case 'Underweight': return 25;
      case 'Normal': return 50;
      case 'Overweight': return 75;
      case 'Obesity': return 100;
      default: return 0;
    }
  };

  const calculateBMIValue = () => {
    if (!resultData || !resultData.explanation) return 0;
    const match = resultData.explanation.match(/Your BMI is (\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const getCategoryDescription = (category) => {
    switch (category) {
      case 'Underweight':
        return "Your BMI indicates you may be underweight. Consider consulting with a healthcare professional about healthy weight gain strategies.";
      case 'Normal':
        return "Congratulations! Your BMI falls within the normal weight range. Continue maintaining your healthy lifestyle.";
      case 'Overweight':
        return "Your BMI indicates you may be overweight. Consider adopting healthier eating habits and increasing physical activity.";
      case 'Obesity':
        return "Your BMI indicates obesity. We recommend consulting with a healthcare professional for a comprehensive weight management plan.";
      default:
        return "Unable to determine BMI category.";
    }
  };

  const chartData = {
    labels: ['Your BMI', 'Range'],
    datasets: [{
      data: [calculateBMIValue(), Math.max(0, 40 - calculateBMIValue())],
      backgroundColor: [
        resultData?.predictedCategory === 'Underweight' ? '#f39c12' :
        resultData?.predictedCategory === 'Normal' ? '#2ecc71' :
        resultData?.predictedCategory === 'Overweight' ? '#e67e22' : '#e74c3c',
        '#ecf0f1'
      ],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { 
        enabled: true,
        callbacks: {
          label: function(context) {
            if (context.dataIndex === 0) {
              return `BMI: ${calculateBMIValue().toFixed(1)}`;
            }
            return '';
          }
        }
      },
    },
    maintainAspectRatio: false,
  };

  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'Underweight':
        return <i className="bi bi-arrow-down-circle category-icon"></i>;
      case 'Normal':
        return <i className="bi bi-check-circle category-icon"></i>;
      case 'Overweight':
        return <i className="bi bi-arrow-up-circle category-icon"></i>;
      case 'Obesity':
        return <i className="bi bi-exclamation-circle category-icon"></i>;
      default:
        return <i className="bi bi-question-circle category-icon"></i>;
    }
  };

  const handleDownloadReport = () => {
    const reportContent = `
BMI Analysis Report
==================

Date: ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

BMI Category: ${resultData?.predictedCategory || 'N/A'}
BMI Value: ${calculateBMIValue().toFixed(1)}

Explanation:
${resultData?.explanation || 'No explanation provided'}

Recommendations:
${resultData?.recommendations?.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n') || 'No recommendations available'}

Disclaimer:
This BMI calculation is for informational purposes only and should not replace professional medical advice.
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bmi_report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 loading-text">Calculating your BMI results...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2 fs-3"></i>
        <div>
          <h4>Something went wrong</h4>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger" 
            onClick={() => navigate('/nutritional-prediction')}
          >
            Return to BMI Calculator
          </button>
        </div>
      </div>
    </div>
  );
  
  if (!resultData) return (
    <div className="no-data-container">
      <div className="alert alert-warning d-flex align-items-center" role="alert">
        <i className="bi bi-info-circle-fill me-2 fs-3"></i>
        <div>
          <h4>No Results Found</h4>
          <p>We couldn't find your BMI calculation results.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/nutritional-prediction')}
          >
            Calculate BMI
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bmi-results-container">
      <motion.div 
        className="results-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Your BMI Analysis Results</h1>
        <p className="results-date">
          <i className="bi bi-calendar3"></i> {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>
      
      <motion.div 
        className="results-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="results-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-speedometer2"></i> Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <i className="bi bi-graph-up"></i> Analysis
          </button>
          <button 
            className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <i className="bi bi-lightbulb"></i> Recommendations
          </button>
        </div>
        
        <div className="results-content">
          {activeTab === 'overview' && (
            <motion.div 
              className="tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bmi-gauge">
                <h3>BMI Category</h3>
                <div className="gauge-container">
                  <div className="progress bmi-progress">
                    <div 
                      className={`progress-bar bg-${getBadgeColor(resultData.predictedCategory)}`}
                      role="progressbar" 
                      style={{ width: `${getProgressValue(resultData.predictedCategory)}%` }}
                      aria-valuenow={getProgressValue(resultData.predictedCategory)} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="gauge-levels">
                    <span className="gauge-label">Underweight</span>
                    <span className="gauge-label">Normal</span>
                    <span className="gauge-label">Overweight</span>
                    <span className="gauge-label">Obesity</span>
                  </div>
                </div>
                <div className="category-indicator">
                  <div className="category-display">
                    {renderCategoryIcon(resultData.predictedCategory)}
                    <span className={`category-badge bg-${getBadgeColor(resultData.predictedCategory)}`}>
                      {resultData.predictedCategory}
                    </span>
                  </div>
                  <div className="bmi-value">
                    BMI: <strong>{calculateBMIValue().toFixed(1)}</strong>
                  </div>
                </div>
                <p className="category-description">{getCategoryDescription(resultData.predictedCategory)}</p>
              </div>
              
              <div className="bmi-chart-section">
                <h3>Visual Representation</h3>
                <div className="chart-container">
                  <div style={{ height: '200px', width: '200px', margin: '0 auto' }}>
                    <Doughnut data={chartData} options={chartOptions} />
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: chartData.datasets[0].backgroundColor[0] }}></span>
                      <span>Your BMI</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'analysis' && (
            <motion.div 
              className="tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Detailed Analysis</h3>
              <div className="analysis-content">
                <div className="explanation-card">
                  <div className="explanation-header">
                    <i className="bi bi-info-circle"></i>
                    <h4>What This Means</h4>
                  </div>
                  <p>{resultData.explanation}</p>
                </div>
                
                <div className="bmi-ranges-card">
                  <h4>BMI Range Reference</h4>
                  <div className="ranges-list">
                    <div className="range-item">
                      <span className="range-indicator underweight"></span>
                      <span className="range-label">Underweight</span>
                      <span className="range-value">Below 18.5</span>
                    </div>
                    <div className="range-item">
                      <span className="range-indicator normal"></span>
                      <span className="range-label">Normal Weight</span>
                      <span className="range-value">18.5 - 24.9</span>
                    </div>
                    <div className="range-item">
                      <span className="range-indicator overweight"></span>
                      <span className="range-label">Overweight</span>
                      <span className="range-value">25.0 - 29.9</span>
                    </div>
                    <div className="range-item">
                      <span className="range-indicator obesity"></span>
                      <span className="range-label">Obesity</span>
                      <span className="range-value">30.0 and above</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'recommendations' && (
            <motion.div 
              className="tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Personalized Recommendations</h3>
              <p className="recommendations-intro">Based on your BMI category, we recommend:</p>
              
              {resultData.recommendations && resultData.recommendations.length > 0 ? (
                <div className="recommendations-list">
                  {resultData.recommendations.map((rec, idx) => (
                    <motion.div 
                      key={idx} 
                      className="recommendation-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <div className="recommendation-number">{idx + 1}</div>
                      <p>{rec}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="no-recommendations-message">
                  <p>No specific recommendations available.</p>
                </div>
              )}
              
              {(resultData.predictedCategory === 'Obesity' || resultData.predictedCategory === 'Underweight') && (
                <motion.div 
                  className="professional-help-alert"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="alert-icon">
                    <i className="bi bi-shield-plus"></i>
                  </div>
                  <div className="alert-content">
                    <h4>Professional Consultation Recommended</h4>
                    <p>Based on your BMI category, we recommend consulting with a healthcare professional or registered dietitian for personalized guidance and support.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
        
        <div className="results-actions">
          <motion.button 
            className="action-button secondary"
            onClick={() => navigate('/nutritional-prediction')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-arrow-repeat"></i> Recalculate BMI
          </motion.button>
          
          <motion.button 
            className="action-button primary"
            onClick={handleDownloadReport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-download"></i> Download Report
          </motion.button>
          
          <motion.button 
            className="action-button accent"
            onClick={() => navigate('/bmi-history')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-clock-history"></i> View History
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div 
        className="disclaimer-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="disclaimer-icon">
          <i className="bi bi-info-circle"></i>
        </div>
        <div className="disclaimer-content">
          <h5>Health Disclaimer</h5>
          <p>BMI is a screening tool and does not diagnose body fatness or health. It should not replace professional medical advice. 
          Consult with a healthcare provider for comprehensive health assessment.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BMIResults;