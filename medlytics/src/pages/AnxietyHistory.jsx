// src/pages/AnxietyHistory.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getAnxietyHistory } from '../services/anxietyService';

const AnxietyHistory = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await getAnxietyHistory();
        setHistory(data);
      } catch (err) {
        console.error('Error fetching anxiety history:', err);
        setError(err.message || 'Failed to fetch anxiety history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, loginWithRedirect]);

  const getBadgeColor = (severity) => {
    switch (severity) {
      case 'Minimal': return 'success';
      case 'Mild': return 'info';
      case 'Moderate': return 'warning';
      case 'Severe': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  
  if (error) return (
    <div className="container my-5">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
      <button className="btn btn-primary" onClick={() => navigate('/anxiety-prediction')}>
        Try Again
      </button>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Your Anxiety Assessment History</h2>
        </div>
        <div className="card-body">
          {history.length === 0 ? (
            <div className="text-center my-4">
              <p>You haven't completed any anxiety assessments yet.</p>
              <Link to="/anxiety-prediction" className="btn btn-primary">
                Take Your First Assessment
              </Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Anxiety Level</th>
                      <th>Anxiety Type</th>
                      <th>Key Factors</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id}>
                        <td>{formatDate(item.date)}</td>
                        <td>
                          <span className={`badge bg-${getBadgeColor(item.result.anxietySeverity)}`}>
                            {item.result.anxietySeverity}
                          </span>
                        </td>
                        <td>{item.result.anxietyType || 'Not specified'}</td>
                        <td>
                          {item.result.keyFactors && item.result.keyFactors.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {item.result.keyFactors.slice(0, 2).map((factor, idx) => (
                                <li key={idx} className="small">
                                  • {factor.name}
                                </li>
                              ))}
                              {item.result.keyFactors.length > 2 && (
                                <li className="small text-muted">• ...</li>
                              )}
                            </ul>
                          ) : (
                            <span className="text-muted">None identified</span>
                          )}
                        </td>
                        <td>
                          <Link 
                            to={`/anxiety-results/${item._id}`} 
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="d-flex justify-content-between mt-4">
                <Link to="/dashboard" className="btn btn-outline-secondary">
                  Back to Dashboard
                </Link>
                <Link to="/anxiety-prediction" className="btn btn-primary">
                  New Assessment
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Understanding Your Results</h5>
          <p className="card-text">
            Your anxiety assessment history shows patterns in your mental health over time.
            Tracking these changes can help you identify triggers and measure progress.
          </p>
          <p className="card-text text-muted small">
            <strong>Note:</strong> This tool is for informational purposes only and does not replace professional medical advice.
            Always consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnxietyHistory;