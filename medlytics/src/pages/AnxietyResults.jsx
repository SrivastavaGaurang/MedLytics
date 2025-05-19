import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBMIResult } from '../services/bmiService';
import './BMIResult.css'; // make sure this file exists

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
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }
        
        const data = await getBMIResult(id, token);
        console.log("BMI result data received:", data);
        
        if (!data || !data.result) {
          throw new Error("Invalid data structure received");
        }
        
        setResultData(data);
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
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">BMI Analysis Results</h2>
          
          <div className="row mb-4">
            <div className="col-md-6">
              <h5>Personal Information</h5>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Age:</span> <strong>{resultData.age} years</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Gender:</span> <strong>{resultData.gender}</strong>
                </li>
              </ul>
            </div>
            
            <div className="col-md-6">
              <h5>Health Metrics</h5>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Sleep Duration:</span> <strong>{resultData.sleepDuration} hours</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Physical Activity:</span> <strong>{resultData.physicalActivityLevel}/100</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Stress Level:</span> <strong>{resultData.stressLevel}/10</strong>
                </li>
              </ul>
            </div>
          </div> 

          <div className="alert alert-info mb-4">
            <h5 className="alert-heading">
              Prediction Result: <span className={`badge bg-${getBadgeColor(resultData.result.predictedCategory)}`}>
                {resultData.result.predictedCategory}
              </span>
            </h5>
            <p>{resultData.result.explanation}</p>
            <p>Confidence: {resultData.result.confidence}%</p>
          </div>

          <h5>Recommendations</h5>
          {resultData.result.recommendations && resultData.result.recommendations.length > 0 ? (
            <ul className="list-group mb-4">
              {resultData.result.recommendations.map((rec, idx) => (
                <li key={idx} className="list-group-item">{rec}</li>
              ))}
            </ul>
          ) : (
            <p>No recommendations available.</p>
          )}

          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/dashboard')}>
              View Dashboard
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/nutritional-prediction')}>
              New Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMIResults;