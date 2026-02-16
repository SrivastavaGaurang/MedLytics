
// src/pages/SleepHistory.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSleepHistory } from '../services/sleepService';
import { useAuth } from '../contexts/AuthContext';
import './SleepResult.css';

const SleepHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching sleep history for user:', user?.sub);
        const data = await getSleepHistory();
        console.log('Sleep history response:', data);
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sortedData);
      } catch (err) {
        console.error('Error fetching sleep history:', err);
        setError(
          err.response?.status === 401
            ? 'Authentication failed. Please log out and log in again.'
            : err.message || 'Failed to load your sleep history. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchHistory();
    }
  }, [isAuthenticated, authLoading, user]);

  const getBadgeColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'high':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid Date';
    }
  };

  const calculateSleepChange = () => {
    if (history.length < 2) return null;

    const oldestEntry = history[history.length - 1];
    const newestEntry = history[0];

    const durationChange = (newestEntry.sleepDuration - oldestEntry.sleepDuration).toFixed(1);
    const qualityChange = (newestEntry.qualityOfSleep - oldestEntry.qualityOfSleep).toFixed(1);

    return {
      durationChange,
      qualityChange,
      durationImproved: durationChange > 0,
      qualityImproved: qualityChange > 0,
    };
  };

  if (authLoading) {
    return (
      <div className="container py-5">
        <div className="card shadow">
          <div className="card-body text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="card shadow">
          <div className="card-body text-center p-5">
            <h3>Please log in to view your sleep history</h3>
            <p className="mb-4">Login to access your personal sleep analysis history and track your progress over time.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="card shadow">
          <div className="card-body text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your sleep history...</p>
          </div>
        </div>
      </div>
    );
  }

  const progressData = calculateSleepChange();

  return (
    <section className="sleep-results-container py-5" aria-labelledby="sleep-history-title">
      <div className="container">
        <div className="card shadow-lg mb-4">
          <div className="card-header bg-primary text-white">
            <h2 id="sleep-history-title" className="mb-0">Your Sleep Analysis History</h2>
          </div>
          <div className="card-body">
            <p className="lead">Track your sleep health patterns over time and monitor improvements.</p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-success" onClick={() => navigate('/sleep-disorder')}>
                New Analysis
              </button>
            </div>

            {history.length === 0 ? (
              <div className="alert alert-info" role="alert">
                You haven't completed any sleep analyses yet. Take your first analysis to start tracking your sleep health.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Sleep Duration</th>
                      <th scope="col">Quality</th>
                      <th scope="col">Risk Level</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id}>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.sleepDuration ? `${item.sleepDuration} hrs` : 'N/A'}</td>
                        <td>{item.qualityOfSleep ? `${item.qualityOfSleep}/10` : 'N/A'}</td>
                        <td>
                          <span
                            className={`badge bg-${getBadgeColor(item.result?.riskLevel)}`}
                            aria-label={`Risk level: ${item.result?.riskLevel || 'Unknown'}`}
                          >
                            {item.result?.riskLevel || 'Unknown'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => navigate(`/sleep-results/${item._id}`)}
                            aria-label={`View details for analysis from ${formatDate(item.date)}`}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="card shadow-lg">
            <div className="card-body">
              <h3>Sleep Health Trends</h3>
              <div className="row mt-4">
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Average Sleep Duration</h5>
                    </div>
                    <div className="card-body">
                      <h3 className="text-center">
                        {(history.reduce((sum, item) => sum + Number(item.sleepDuration || 0), 0) / history.length).toFixed(1)} hrs
                      </h3>
                      <div className="text-center text-muted">Recommended: 7-9 hours</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Average Sleep Quality</h5>
                    </div>
                    <div className="card-body">
                      <h3 className="text-center">
                        {(history.reduce((sum, item) => sum + Number(item.qualityOfSleep || 0), 0) / history.length).toFixed(1)}/10
                      </h3>
                      <div className="text-center text-muted">Target: {'>'} 7/10</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Risk Assessment Distribution</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Low Risk
                          <span className="badge bg-success rounded-pill">
                            {history.filter((item) => item.result?.riskLevel?.toLowerCase() === 'low').length}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Moderate Risk
                          <span className="badge bg-warning rounded-pill">
                            {history.filter((item) => item.result?.riskLevel?.toLowerCase() === 'moderate').length}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          High Risk
                          <span className="badge bg-danger rounded-pill">
                            {history.filter((item) => item.result?.riskLevel?.toLowerCase() === 'high').length}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Your Progress</h5>
                    </div>
                    <div className="card-body">
                      {progressData ? (
                        <div>
                          <p>
                            Sleep duration change:
                            <span className={progressData.durationImproved ? 'text-success' : 'text-danger'}>
                              {' '}
                              {progressData.durationChange > 0 ? '+' : ''}
                              {progressData.durationChange} hrs
                              {' '}
                              <i className={`bi bi-arrow-${progressData.durationImproved ? 'up' : 'down'}`}></i>
                            </span>
                          </p>
                          <p>
                            Sleep quality change:
                            <span className={progressData.qualityImproved ? 'text-success' : 'text-danger'}>
                              {' '}
                              {progressData.qualityChange > 0 ? '+' : ''}
                              {progressData.qualityChange} points
                              {' '}
                              <i className={`bi bi-arrow-${progressData.qualityImproved ? 'up' : 'down'}`}></i>
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-center">Complete more analyses to track your progress over time.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SleepHistory;
