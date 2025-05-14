// src/pages/BMIResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBMIResult } from '../services/bmiService';
import './BMIResult.css'; // we'll create this file next

const BMIResults = () => {
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
        console.log("Fetching BMI result for ID:", id);
        
        const data = await getBMIResult(id);
        console.log("BMI result data received:", data);
        
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

  const getBadgeColor = (category) => {
    switch (category) {
      case 'Underweight': return 'warning';
      case 'Normal': return 'success';
      case 'Overweight': return 'warning';
      case 'Obesity': return 'danger';
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
          <h2 className="card-title">BMI Category Prediction Result</h2>
          <p className="lead mb-3">
            Predicted BMI Category: <span className={`badge bg-${getBadgeColor(resultData.predictedCategory)}`}>
              {resultData.predictedCategory}
            </span>
          </p>

          <h5>What This Means</h5>
          <div className="mb-4">
            <p>{resultData.explanation}</p>
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

          <div className="d-flex justify-content-end">
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/bmi-history')}>View History</button>
            <button className="btn btn-primary" onClick={() => navigate('/nutritional-prediction')}>Try Again</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMIResults;