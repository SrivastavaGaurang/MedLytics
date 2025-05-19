// src/pages/AnxietyResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnxietyResult } from '../services/anxietyService';
import { motion } from 'framer-motion';
import './AnxietyResults.css'; // We'll create this file next

const AnxietyResults = () => {
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
        const data = await getAnxietyResult(id);
        
        if (!data || !data.result) {
          throw new Error("Invalid data structure received");
        }
        
        setResultData(data.result);
      } catch (err) {
        console.error("Error in fetchResult:", err);
        setError(err.message || 'Failed to fetch anxiety analysis result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const getBadgeColor = (severity) => {
    switch (severity) {
      case 'Minimal': return 'success';
      case 'Mild': return 'info';
      case 'Moderate': return 'warning';
      case 'Severe': return 'danger';
      default: return 'secondary';
    }
  };

  const getProgressValue = (severity) => {
    switch (severity) {
      case 'Minimal': return 25;
      case 'Mild': return 50;
      case 'Moderate': return 75;
      case 'Severe': return 100;
      default: return 0;
    }
  };
  
  const getSeverityDescription = (severity) => {
    switch (severity) {
      case 'Minimal':
        return "Your anxiety symptoms appear to be minimal. Continue with healthy habits to maintain good mental health.";
      case 'Mild':
        return "You're experiencing mild anxiety symptoms. This is common and can often be managed with self-care strategies.";
      case 'Moderate':
        return "Your anxiety symptoms are at a moderate level, which may benefit from professional support along with self-care.";
      case 'Severe':
        return "Your symptoms indicate severe anxiety. We strongly recommend seeking professional help as soon as possible.";
      default:
        return "Unable to determine anxiety severity level.";
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 loading-text">Analyzing your results...</p>
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
            onClick={() => navigate('/anxiety-prediction')}
          >
            Return to Assessment
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
          <p>We couldn't find your anxiety assessment results.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/anxiety-prediction')}
          >
            Take Assessment
          </button>
        </div>
      </div>
    </div>
  );

  const renderFactorIcon = (factorName) => {
    switch (factorName) {
      case 'Depression':
        return <i className="bi bi-cloud-rain factor-icon"></i>;
      case 'Excessive Worry':
        return <i className="bi bi-brain factor-icon"></i>;
      case 'Suicidal Ideation':
        return <i className="bi bi-exclamation-diamond factor-icon"></i>;
      case 'Sleep Disturbance':
        return <i className="bi bi-moon factor-icon"></i>;
      case 'Physical Health':
        return <i className="bi bi-heart-pulse factor-icon"></i>;
      default:
        return <i className="bi bi-bookmark-star factor-icon"></i>;
    }
  };

  return (
    <div className="anxiety-results-container">
      <motion.div 
        className="results-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Your Anxiety Analysis Results</h1>
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
            <i className="bi bi-clipboard-data"></i> Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'factors' ? 'active' : ''}`}
            onClick={() => setActiveTab('factors')}
          >
            <i className="bi bi-list-check"></i> Key Factors
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
              <div className="severity-gauge">
                <h3>Anxiety Severity</h3>
                <div className="gauge-container">
                  <div className="progress anxiety-progress">
                    <div 
                      className={`progress-bar bg-${getBadgeColor(resultData.anxietySeverity)}`}
                      role="progressbar" 
                      style={{ width: `${getProgressValue(resultData.anxietySeverity)}%` }}
                      aria-valuenow={getProgressValue(resultData.anxietySeverity)} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="gauge-levels">
                    <span className="gauge-label">Minimal</span>
                    <span className="gauge-label">Mild</span>
                    <span className="gauge-label">Moderate</span>
                    <span className="gauge-label">Severe</span>
                  </div>
                </div>
                <div className="severity-indicator">
                  <span className={`severity-badge bg-${getBadgeColor(resultData.anxietySeverity)}`}>
                    {resultData.anxietySeverity}
                  </span>
                </div>
                <p className="severity-description">{getSeverityDescription(resultData.anxietySeverity)}</p>
              </div>
              
              <div className="anxiety-type-section">
                <h3>Possible Anxiety Type</h3>
                <div className="anxiety-type-card">
                  <div className="anxiety-type-header">
                    <i className="bi bi-diagram-3"></i>
                    <h4>{resultData.anxietyType || 'No specific type identified'}</h4>
                  </div>
                  <p>{resultData.anxietyTypeDescription || 'A comprehensive clinical assessment is needed to determine specific anxiety disorder types.'}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'factors' && (
            <motion.div 
              className="tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Key Contributing Factors</h3>
              <p className="factors-intro">The following factors appear to be influencing your anxiety levels:</p>
              
              <div className="factors-grid">
                {resultData.keyFactors && resultData.keyFactors.length > 0 ? (
                  resultData.keyFactors.map((factor, idx) => (
                    <motion.div 
                      key={idx} 
                      className="factor-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <div className="factor-icon-container">
                        {renderFactorIcon(factor.name)}
                      </div>
                      <div className="factor-content">
                        <h4>{factor.name}</h4>
                        <span className={`impact-indicator impact-${factor.impact.toLowerCase()}`}>
                          {factor.impact} Impact
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="no-factors-message">
                    <i className="bi bi-emoji-smile"></i>
                    <p>No significant contributing factors identified.</p>
                  </div>
                )}
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
              <p className="recommendations-intro">Based on your assessment, we recommend:</p>
              
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
              
              {(resultData.anxietySeverity === 'Moderate' || resultData.anxietySeverity === 'Severe') && (
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
                    <h4>Professional Support Recommended</h4>
                    <p>Based on your results, we strongly recommend consulting with a mental health professional for a comprehensive evaluation and personalized treatment plan.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
        
        <div className="results-actions">
          <motion.button 
            className="action-button secondary"
            onClick={() => navigate('/anxiety-prediction')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-arrow-repeat"></i> Retake Assessment
          </motion.button>
          
          <motion.button 
            className="action-button primary"
            onClick={() => window.print()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-printer"></i> Print Results
          </motion.button>
          
          <motion.button 
            className="action-button accent"
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-graph-up"></i> View Dashboard
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
          <h5>Medical Disclaimer</h5>
          <p>This assessment is for informational purposes only and does not replace professional medical advice. 
          If you're experiencing severe symptoms, please contact a healthcare professional immediately.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnxietyResults;