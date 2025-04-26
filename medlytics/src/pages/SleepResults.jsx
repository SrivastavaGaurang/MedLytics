// src/pages/SleepResults.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const SleepResults = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`http://localhost:5000/api/sleep/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch results');
        }
        
        setAnalysis(data);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err.message || 'An error occurred while fetching your analysis');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [id]);
  
  // Generate chart data based on analysis
  const generateChartData = () => {
    if (!analysis) return null;
    
    return {
      labels: ['Disorder Risk', 'Sleep Quality', 'Physical Activity', 'Stress Level'],
      datasets: [
        {
          label: 'Sleep Health Metrics',
          data: [
            analysis.predictionConfidence,
            analysis.qualityOfSleep * 10,
            analysis.physicalActivity,
            analysis.stressLevel * 10
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your analysis results...</p>
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
          <Link to="/login" className="btn btn-primary me-3">Log In</Link>
          <Link to="/sleep-disorder" className="btn btn-outline-secondary">Back to Analysis</Link>
        </div>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Analysis not found. Please try again.
        </div>
        <div className="text-center mt-4">
          <Link to="/sleep-disorder" className="btn btn-primary">Start New Analysis</Link>
        </div>
      </div>
    );
  }
  
  const chartData = generateChartData();
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow mb-4">
            <div className={`card-header ${analysis.hasDisorder ? 'bg-warning' : 'bg-success'} text-white`}>
              <h2 className="mb-0">Sleep Analysis Results</h2>
            </div>
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div className={`display-6 fw-bold ${analysis.hasDisorder ? 'text-warning' : 'text-success'}`}>
                  {analysis.hasDisorder 
                    ? `${analysis.disorderType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Risk`
                    : 'No Significant Sleep Disorder Risk'}
                </div>
                <p className="lead mt-2">
                  {analysis.hasDisorder 
                    ? `Risk Level: ${analysis.predictionConfidence.toFixed(1)}%`
                    : 'Your sleep metrics appear to be within normal ranges.'}
                </p>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
                    {chartData && <Chart type="pie" data={chartData} />}
                  </div>
                </div>
                <div className="col-md-6">
                  <h4 className="mb-3">Key Metrics</h4>
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Sleep Duration
                      <span className={`badge ${analysis.sleepDuration < 6 || analysis.sleepDuration > 9 ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                        {analysis.sleepDuration} hours
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Sleep Quality
                      <span className={`badge ${analysis.qualityOfSleep < 6 ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                        {analysis.qualityOfSleep}/10
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Physical Activity
                      <span className={`badge ${analysis.physicalActivity < 30 ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                        {analysis.physicalActivity}/100
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Stress Level
                      <span className={`badge ${analysis.stressLevel > 7 ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                        {analysis.stressLevel}/10
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      BMI
                      <span className={`badge ${analysis.bmi < 18.5 || analysis.bmi > 25 ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                        {analysis.bmi}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="mb-3">Recommendations</h4>
                <div className="card">
                  <ul className="list-group list-group-flush">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="list-group-item">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {analysis.hasDisorder && (
                <div className="alert alert-warning" role="alert">
                  <h5 className="alert-heading">Important Note</h5>
                  <p>
                    This analysis suggests you may be at risk for {analysis.disorderType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}.
                    This is not a medical diagnosis. We recommend consulting with a healthcare provider for proper evaluation.
                  </p>
                </div>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                <Link to="/sleep-disorder" className="btn btn-outline-primary">
                  New Analysis
                </Link>
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
          
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">What's Next?</h5>
              <p className="card-text">
                Track your sleep health over time to identify patterns and improvements.
                Our dashboard provides historical views of your metrics and progress.
              </p>
              <p className="card-text small text-muted">
                Analysis date: {new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepResults;