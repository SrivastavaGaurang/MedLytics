// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sleepHistory, setSleepHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }
        
        // Fetch user profile
        const userResponse = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'x-auth-token': token
          }
        });
        
        const userData = await userResponse.json();
        
        if (!userResponse.ok) {
          throw new Error(userData.message || 'Failed to fetch user data');
        }
        
        setUser(userData);
        
        // Fetch sleep history
        const sleepResponse = await fetch('http://localhost:5000/api/sleep/history', {
          headers: {
            'x-auth-token': token
          }
        });
        
        const sleepData = await sleepResponse.json();
        
        if (!sleepResponse.ok) {
          throw new Error(sleepData.message || 'Failed to fetch sleep history');
        }
        
        setSleepHistory(sleepData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'An error occurred while loading dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Generate chart data for sleep metrics
  const generateSleepQualityChart = () => {
    if (!sleepHistory || sleepHistory.length === 0) return null;
    
    const sortedHistory = [...sleepHistory].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    const labels = sortedHistory.map(item => new Date(item.createdAt).toLocaleDateString());
    
    return {
      labels,
      datasets: [
        {
          label: 'Sleep Quality',
          data: sortedHistory.map(item => item.qualityOfSleep),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3
        },
        {
          label: 'Sleep Duration',
          data: sortedHistory.map(item => item.sleepDuration),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.3
        }
      ]
    };
  };
  
  const sleepQualityChart = generateSleepQualityChart();
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your dashboard...</p>
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
          <Link to="/login" className="btn btn-primary">Log In</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="display-5 fw-bold mb-0">Welcome, {user?.name}!</h1>
          <p className="lead text-muted">Here's an overview of your health metrics</p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/sleep-disorder" className="btn btn-primary me-2">
            New Sleep Analysis
          </Link>
          <Link to="/profile" className="btn btn-outline-secondary">
            Profile
          </Link>
        </div>
      </div>
      
      {/* Quick Actions Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <i className="bi bi-moon-stars fs-3 text-primary"></i>
                </div>
                <h5 className="card-title mb-0">Sleep Analysis</h5>
              </div>
              <p className="card-text">
                Analyze your sleep patterns and get personalized recommendations to improve sleep quality.
              </p>
              <Link to="/sleep-disorder" className="btn btn-sm btn-outline-primary">Start Analysis</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <i className="bi bi-heart-pulse fs-3 text-success"></i>
                </div>
                <h5 className="card-title mb-0">Health Tracker</h5>
              </div>
              <p className="card-text">
                Track your vital signs, physical activity, and other health metrics over time.
              </p>
              <Link to="/health-tracker" className="btn btn-sm btn-outline-success">View Tracker</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <i className="bi bi-journal-text fs-3 text-warning"></i>
                </div>
                <h5 className="card-title mb-0">Health Insights</h5>
              </div>
              <p className="card-text">
                Get personalized insights and recommendations based on your health data.
              </p>
              <Link to="/insights" className="btn btn-sm btn-outline-warning">View Insights</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics Section */}
      <div className="row g-4">
        {/* Sleep History Chart */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Sleep History</h5>
            </div>
            <div className="card-body">
              {sleepQualityChart ? (
                <Line 
                  data={sleepQualityChart} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 12
                      }
                    }
                  }} 
                  height={300}
                />
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No sleep history data available</p>
                  <Link to="/sleep-disorder" className="btn btn-primary">Start Sleep Analysis</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Analysis */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Sleep Analysis</h5>
              <Link to="/sleep-history" className="text-decoration-none small">View All</Link>
            </div>
            <div className="card-body p-0">
              {sleepHistory.length > 0 ? (
                <div className="list-group list-group-flush">
                  {sleepHistory.slice(0, 5).map((analysis) => (
                    <Link 
                      key={analysis._id} 
                      to={`/sleep-results/${analysis._id}`} 
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">
                            {analysis.hasDisorder 
                              ? analysis.disorderType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Risk'
                              : 'No Disorder Detected'}
                          </div>
                          <small className="text-muted">
                            Quality: {analysis.qualityOfSleep}/10 · Duration: {analysis.sleepDuration}h
                          </small>
                        </div>
                        <span className={`badge ${analysis.hasDisorder ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                          {analysis.hasDisorder ? `${analysis.predictionConfidence.toFixed(0)}%` : 'Healthy'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No analysis results yet</p>
                  <Link to="/sleep-disorder" className="btn btn-primary">Start First Analysis</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;