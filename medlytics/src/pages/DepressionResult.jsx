import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDepressionResult } from '../services/depressionService';

const DepressionResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getDepressionResult(id);
        setResult(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch depression analysis result');
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <p>{error}</p>
          <Link to="/depression-prediction" className="btn btn-outline-primary">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <p>Depression analysis result not found</p>
          <Link to="/depression-prediction" className="btn btn-outline-primary">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const getRiskLevelClass = (level) => {
    switch (level) {
      case 'low':
        return 'text-success';
      case 'moderate':
        return 'text-warning';
      case 'high':
        return 'text-danger';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Depression Analysis Results</h2>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h3 className="mb-3">Your Risk Assessment</h3>
                <div className="alert alert-light border">
                  <h4 className={`alert-heading ${getRiskLevelClass(result.result.riskLevel)}`}>
                    {result.result.riskLevel.charAt(0).toUpperCase() + result.result.riskLevel.slice(1)} Risk
                  </h4>
                  <p>
                    Based on your responses, you are at a <strong>{result.result.riskLevel}</strong> risk for depression.
                  </p>
                </div>
              </div>

              {result.result.possibleDepressionTypes && result.result.possibleDepressionTypes.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-3">Potential Depression Types</h3>
                  <ul className="list-group">
                    {result.result.possibleDepressionTypes.map((type, index) => (
                      <li key={index} className="list-group-item">
                        <i className="fas fa-exclamation-triangle me-2 text-warning"></i> {type}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <h3 className="mb-3">Recommendations</h3>
                <div className="card">
                  <ul className="list-group list-group-flush">
                    {result.result.recommendations.map((recommendation, index) => (
                      <li key={index} className="list-group-item">
                        <i className="fas fa-check-circle me-2 text-success"></i> {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-3">Next Steps</h3>
                <div className="alert alert-info">
                  <h5 className="alert-heading">Important Note</h5>
                  <p>
                    This analysis is not a clinical diagnosis. It is based on the information you provided and is meant to be informative only.
                  </p>
                  <hr />
                  <p className="mb-0">
                    If you are experiencing symptoms of depression, please consult with a qualified healthcare provider for a proper evaluation and treatment plan.
                  </p>
                </div>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to="/depression-prediction" className="btn btn-outline-primary">
                  Take Another Assessment
                </Link>
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressionResult;