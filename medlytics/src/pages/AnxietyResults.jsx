// src/pages/AnxietyResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnxietyResult } from '../services/anxietyService';
import './SleepResult.css'; // Reusing the existing styles

const AnxietyResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!id) {
      setError("No result ID provided");
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        console.log("Fetching anxiety result for ID:", id);
        
        const data = await getAnxietyResult(id);
        console.log("Anxiety result data received:", data);
        
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

  if (loading) return <div className="text-center mt-5">Loading anxiety analysis result...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!resultData) return <div className="alert alert-warning mt-4">No result data available</div>;

  return (
    <div className="container py-5">
      <div className="card shadow-lg result-card">
        <div className="card-body">
          <h2 className="card-title">Anxiety Analysis Result</h2>
          <p className="lead mb-3">
            Anxiety Severity: <span className={`badge bg-${getBadgeColor(resultData.anxietySeverity)}`}>{resultData.anxietySeverity}</span>
          </p>

          <div className="row mt-4">
            <div className="col-md-6">
              <h5>Key Factors</h5>
              <ul className="list-group mb-4">
                {resultData.keyFactors && resultData.keyFactors.map((factor, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    {factor.name}
                    <span className={`badge bg-${factor.impact === 'High' ? 'danger' : factor.impact === 'Medium' ? 'warning' : 'info'} rounded-pill`}>
                      {factor.impact}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="col-md-6">
              <h5>Possible Anxiety Type</h5>
              {resultData.anxietyType ? (
                <div className="card mb-3 bg-light">
                  <div className="card-body">
                    <h6 className="card-title">{resultData.anxietyType}</h6>
                    <p className="card-text small">{resultData.anxietyTypeDescription}</p>
                  </div>
                </div>
              ) : (
                <p>No specific anxiety type identified.</p>
              )}
            </div>
          </div>

          <h5>Recommendations</h5>
          {resultData.recommendations && resultData.recommendations.length > 0 ? (
            <ul className="list-group mb-4">
              {resultData.recommendations.map((rec, idx) => (
                <li key={idx} className="list-group-item">{rec}</li>
              ))}
            </ul>
          ) : (
            <p>No recommendations available.</p>
          )}
          
          {resultData.anxietySeverity === 'Moderate' || resultData.anxietySeverity === 'Severe' ? (
            <div className="alert alert-warning mt-3">
              <strong>Important:</strong> Based on your results, we recommend consulting with a mental health professional for a comprehensive evaluation and personalized treatment plan.
            </div>
          ) : null}

          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/anxiety-history')}>View History</button>
            <button className="btn btn-primary" onClick={() => navigate('/anxiety-prediction')}>Try Again</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnxietyResults;