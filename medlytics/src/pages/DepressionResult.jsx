import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDepressionResult } from '../services/depressionService';
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaArrowLeft, 
  FaUser, 
  FaCalendarAlt,
  FaChartLine,
  FaLightbulb
} from 'react-icons/fa';

const DepressionResults = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log('Fetching results for ID:', id);
        
        if (!id) {
          setError('No analysis ID provided.');
          setLoading(false);
          return;
        }

        const data = await getDepressionResult(id);
        console.log('Received depression result data:', data);
        setResult(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'An error occurred while fetching results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const renderRiskBadge = (level) => {
    const badges = {
      low: { 
        bg: 'success', 
        icon: <FaCheckCircle className="me-2" />, 
        text: 'Low Risk',
        textColor: 'text-success'
      },
      moderate: { 
        bg: 'warning', 
        icon: <FaInfoCircle className="me-2" />, 
        text: 'Moderate Risk',
        textColor: 'text-warning'
      },
      high: { 
        bg: 'danger', 
        icon: <FaExclamationTriangle className="me-2" />, 
        text: 'High Risk',
        textColor: 'text-danger'
      }
    };

    const badge = badges[level] || badges.low;

    return (
      <div className="text-center mb-4">
        <div className={`alert alert-${badge.bg} d-inline-block px-4 py-3`}>
          <h4 className="mb-0">
            {badge.icon}
            {badge.text}
          </h4>
        </div>
      </div>
    );
  };

  const renderFactorBadge = (impact) => {
    const impacts = {
      High: 'danger',
      Moderate: 'warning',
      Low: 'info'
    };
    return `badge bg-${impacts[impact] || 'secondary'}`;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Analyzing Your Results...</h4>
            <p className="text-muted">Please wait while we fetch your depression analysis results.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <FaExclamationTriangle className="me-3" size={24} />
              <div>
                <h5 className="alert-heading mb-1">Unable to Load Results</h5>
                <p className="mb-0">{error}</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <Link to="/depression-prediction" className="btn btn-primary btn-lg">
                <FaArrowLeft className="me-2" /> Take New Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <FaInfoCircle className="me-3" size={24} />
              <div>
                <h5 className="alert-heading mb-1">No Results Found</h5>
                <p className="mb-0">The analysis results could not be found. This may be due to an invalid ID or expired results.</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <Link to="/depression-prediction" className="btn btn-primary btn-lg">
                <FaArrowLeft className="me-2" /> Take New Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Main Results Card */}
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex align-items-center">
                <FaChartLine className="me-3" size={24} />
                <h2 className="mb-0">Depression Risk Analysis Results</h2>
              </div>
            </div>
            <div className="card-body p-4">
              {/* Risk Assessment Section */}
              {result.result && renderRiskBadge(result.result.riskLevel)}
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center text-muted mb-2">
                    <FaCalendarAlt className="me-2" />
                    <span>Analysis Date: {new Date(result.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center text-muted mb-2">
                    <FaUser className="me-2" />
                    <span>Age: {result.age} | Gender: {result.gender}</span>
                  </div>
                </div>
              </div>

              {/* Depression Type Section */}
              {result.result && result.result.depressionType && (
                <div className="mb-4">
                  <h4 className="text-primary mb-3">
                    <FaInfoCircle className="me-2" />
                    Assessment Summary
                  </h4>
                  <div className="card border-primary">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{result.result.depressionType}</h5>
                      <p className="card-text">{result.result.depressionTypeDescription}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Contributing Factors */}
              {result.result && result.result.keyFactors && result.result.keyFactors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-primary mb-3">
                    <FaExclamationTriangle className="me-2" />
                    Key Contributing Factors
                  </h4>
                  <div className="row">
                    {result.result.keyFactors.map((factor, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <h6 className="card-title mb-1">{factor.name}</h6>
                              <span className={renderFactorBadge(factor.impact)}>
                                {factor.impact} Impact
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations Section */}
              {result.result && result.result.recommendations && result.result.recommendations.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-success mb-3">
                    <FaLightbulb className="me-2" />
                    Personalized Recommendations
                  </h4>
                  <div className="card border-success">
                    <div className="card-body">
                      <div className="row">
                        {result.result.recommendations.map((recommendation, index) => (
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

              {/* Important Disclaimer */}
              <div className="alert alert-info border-info" role="alert">
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
                  <strong>Crisis Resources:</strong> If you're experiencing a mental health emergency or having thoughts of harming yourself, 
                  please call the National Suicide Prevention Lifeline at <strong>988</strong>, or text <strong>HOME</strong> to <strong>741741</strong> to 
                  connect with a Crisis Counselor immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
            <Link to="/depression-prediction" className="btn btn-primary btn-lg">
              <FaArrowLeft className="me-2" /> Take New Assessment
            </Link>
            <div className="d-flex gap-2">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressionResults;