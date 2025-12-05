// src/components/DepressionHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { getDepressionHistory } from '../services/depressionService';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const DepressionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {, isAuthenticated, loginWithRedirect } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await getDepressionHistory();
        setHistory(data);
      } catch (err) {
        console.error('Error fetching depression history:', err);
        setError('Failed to load your depression analysis history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated]);

  const handleLoginRedirect = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
  };

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

  if (!isAuthenticated) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center py-4">
          <h4 className="mb-3">Depression Analysis History</h4>
          <p>Sign in to view your depression analysis history and track changes over time.</p>
          <button onClick={handleLoginRedirect} className="btn btn-primary">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your depression analysis history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="alert alert-danger mb-0" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center py-4">
          <h4 className="mb-3">Depression Analysis History</h4>
          <p>You haven't completed any depression assessments yet.</p>
          <Link to="/depression-prediction" className="btn btn-primary">
            Take Depression Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white">
        <h4 className="mb-0">Depression Analysis History</h4>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Risk Level</th>
                <th>Depression Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>
                    <FaCalendarAlt className="text-muted me-2" />
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td>{renderRiskBadge(item.result.riskLevel)}</td>
                  <td>{item.result.depressionType || 'N/A'}</td>
                  <td>
                    <Link 
                      to={`/depression-results/${item._id}`} 
                      className="btn btn-sm btn-outline-primary"
                    >
                      <FaChartLine className="me-1" /> View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer bg-white">
        <Link to="/depression-prediction" className="btn btn-primary">
          Take New Assessment
        </Link>
      </div>
    </div>
  );
};

export default DepressionHistory;