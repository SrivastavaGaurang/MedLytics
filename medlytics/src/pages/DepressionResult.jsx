// src/pages/DepressionResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDepressionResult } from '../services/depressionService';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';

const DepressionResults = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getDepressionResult(id);
        setResult(data);
      } catch (err) {
        setError('Error fetching depression analysis results. Please try again later.');
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  // Function to render risk level badge with appropriate color
  const renderRiskBadge = (level) => {
    const badges = {
      low: { bg: 'bg-success', icon: <FaCheckCircle className="me-1" />, text: 'Low Risk' },
      moderate: { bg: 'bg-warning', icon: <FaInfoCircle className="me-1" />, text: 'Moderate Risk' },
      high: { bg: 'bg-danger', icon: <FaExclamationTriangle className="me-1" />, text: 'High Risk' }
    };

    const badge = badges[level] || badges.low;

    return (
      <span className={`badge ${badge.bg} d-flex align-items-center p-2`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your depression analysis results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <div className="text-center mt-4">
          <Link to="/depression-prediction" className="btn btn-primary">
            <FaArrowLeft className="me-2" /> Back to Depression Analysis
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Results not found. The analysis ID may be invalid or the results may have expired.
        </div>
        <div className="text-center mt-4">
          <Link to="/depression-prediction" className="btn btn-primary">
            <FaArrowLeft className="me-2" /> Back to Depression Analysis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Depression Analysis Results</h2>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <h4>Risk Assessment</h4>
                <div className="d-inline-block">
                  {renderRiskBadge(result.result.riskLevel)}
                </div>
                <p className="text-muted mt-2">
                  Analysis date: {new Date(result.date).toLocaleDateString()}
                </p>
              </div>

              {result.result.depressionType && (
                <div className="mb-4">
                  <h4>Depression Type</h4>
                  <div className="card border-primary mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{result.result.depressionType}</h5>
                      <p className="card-text">{result.result.depressionTypeDescription}</p>
                    </div>
                  </div>
                </div>
              )}

              {result.result.keyFactors && result.result.keyFactors.length > 0 && (
                <div className="mb-4">
                  <h4>Key Contributing Factors</h4>
                  <div className="list-group">
                    {result.result.keyFactors.map((factor, index) => (
                      <div key={index} className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">{factor.name}</h5>
                          <span className={`badge ${factor.impact === 'High' ? 'bg-danger' : 'bg-warning'}`}>
                            {factor.impact} Impact
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.result.recommendations && result.result.recommendations.length > 0 && (
                <div className="mb-4">
                  <h4>Personalized Recommendations</h4>
                  <div className="card border-success">
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        {result.result.recommendations.map((recommendation, index) => (
                          <li key={index} className="list-group-item">
                            <FaCheckCircle className="text-success me-2" /> 
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="alert alert-info" role="alert">
                <h5 className="alert-heading">Important Note</h5>
                <p>
                  This assessment is meant for informational purposes only and is not a substitute 
                  for professional medical advice, diagnosis, or treatment. Always seek the advice 
                  of a qualified healthcare provider with any questions you may have regarding a 
                  medical condition.
                </p>
                <hr />
                <p className="mb-0">
                  If you're experiencing a mental health emergency or having thoughts of harming yourself, 
                  please call the National Suicide Prevention Lifeline at 988, or text HOME to 741741 to 
                  connect with a Crisis Counselor.
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <Link to="/depression-prediction" className="btn btn-primary">
              <FaArrowLeft className="me-2" /> Back to Depression Analysis
            </Link>
            <Link to="/dashboard" className="btn btn-outline-secondary">
              View Your Health Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressionResults;