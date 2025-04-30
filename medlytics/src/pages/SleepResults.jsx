// src/pages/SleepResult.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSleepResult } from '../services/sleepService';
import './SleepResult.css'; // for custom styles

const SleepResult = () => {
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
        // Debug logging
        console.log("Fetching result for ID:", id);
        
        const data = await getSleepResult(id);
        console.log("Result data received:", data);
        
        if (!data || !data.result) {
          throw new Error("Invalid data structure received");
        }
        
        setResultData(data.result);
      } catch (err) {
        console.error("Error in fetchResult:", err);
        setError(err.message || 'Failed to fetch result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const getBadgeColor = (risk) => {
    switch (risk) {
      case 'low': return 'success';
      case 'moderate': return 'warning';
      case 'high': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) return <div className="text-center mt-5">Loading result...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!resultData) return <div className="alert alert-warning mt-4">No result data available</div>;

  return (
    <div className="container py-5">
      <div className="card shadow-lg result-card">
        <div className="card-body">
          <h2 className="card-title">Sleep Disorder Analysis Result</h2>
          <p className="lead mb-3">
            Risk Level: <span className={`badge bg-${getBadgeColor(resultData.riskLevel)}`}>{resultData.riskLevel}</span>
          </p>

          <h5>Possible Disorders</h5>
          {resultData.possibleDisorders && resultData.possibleDisorders.length > 0 ? (
            <ul className="list-group mb-4">
              {resultData.possibleDisorders.map((disorder, idx) => (
                <li key={idx} className="list-group-item">{disorder}</li>
              ))}
            </ul>
          ) : (
            <p>No sleep disorders detected.</p>
          )}

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

          <div className="d-flex justify-content-end">
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/sleep-history')}>View History</button>
            <button className="btn btn-primary" onClick={() => navigate('/sleep-disorder')}>Try Again</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepResult;