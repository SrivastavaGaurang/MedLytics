import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getBMIHistory } from '../services/bmiService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sleepHistory, setSleepHistory] = useState([]);
  const [anxietyHistory, setAnxietyHistory] = useState([]);
  const [bmiHistory, setBMIHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
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
          headers: { 'x-auth-token': token }
        });
        const userData = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(userData.message || 'Failed to fetch user data');
        }
        setUser(userData);

        // Fetch sleep history
        const sleepResponse = await fetch('http://localhost:5000/api/sleep/history', {
          headers: { 'x-auth-token': token }
        });
        const sleepData = await sleepResponse.json();
        if (!sleepResponse.ok) {
          throw new Error(sleepData.message || 'Failed to fetch sleep history');
        }
        setSleepHistory(sleepData);

        // Fetch anxiety history
        const anxietyResponse = await fetch('http://localhost:5000/api/anxiety/history', {
          headers: { 'x-auth-token': token }
        });
        const anxietyData = await anxietyResponse.json();
        if (!anxietyResponse.ok) {
          throw new Error(anxietyData.message || 'Failed to fetch anxiety history');
        }
        setAnxietyHistory(anxietyData);

        // Fetch BMI history
        const bmiData = await getBMIHistory(() => Promise.resolve(token));
        setBMIHistory(bmiData);
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
    return sortedHistory.map(item => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      qualityOfSleep: item.qualityOfSleep,
      sleepDuration: item.sleepDuration
    }));
  };

  // Generate chart data for anxiety metrics
  const generateAnxietyChart = () => {
    if (!anxietyHistory || anxietyHistory.length === 0) return null;
    const sortedHistory = [...anxietyHistory].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return sortedHistory.map(item => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      anxietyScore: item.anxietyScore,
      phq_score: item.phq_score
    }));
  };

  // Generate chart data for BMI metrics
  const generateBMIChart = () => {
    if (!bmiHistory || bmiHistory.length === 0) return null;
    const sortedHistory = [...bmiHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sortedHistory.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      bmi: item.result.bmi || 0,
      healthRiskLevel: item.result.healthRiskLevel || 0
    }));
  };

  // Generate combined chart for health metrics
  const generateHealthOverviewChart = () => {
    if (!sleepHistory.length && !anxietyHistory.length && !bmiHistory.length) return null;

    const sleepDates = sleepHistory.map(item => new Date(item.createdAt).toLocaleDateString());
    const anxietyDates = anxietyHistory.map(item => new Date(item.createdAt).toLocaleDateString());
    const bmiDates = bmiHistory.map(item => new Date(item.date).toLocaleDateString());
    const allDates = [...new Set([...sleepDates, ...anxietyDates, ...bmiDates])].sort((a, b) => new Date(a) - new Date(b));

    return allDates.map(date => {
      const sleepMatch = sleepHistory.find(item => new Date(item.createdAt).toLocaleDateString() === date);
      const anxietyMatch = anxietyHistory.find(item => new Date(item.createdAt).toLocaleDateString() === date);
      const bmiMatch = bmiHistory.find(item => new Date(item.date).toLocaleDateString() === date);
      return {
        date,
        sleepQuality: sleepMatch ? sleepMatch.qualityOfSleep : null,
        anxietyScore: anxietyMatch ? anxietyMatch.anxietyScore : null,
        bmi: bmiMatch ? bmiMatch.result.bmi : null
      };
    });
  };

  const sleepQualityChart = generateSleepQualityChart();
  const anxietyChart = generateAnxietyChart();
  const bmiChart = generateBMIChart();
  const healthOverviewChart = generateHealthOverviewChart();

  // Generate recommendations
  const generateRecommendations = () => {
    const recommendations = [];

    // BMI recommendations
    if (bmiHistory.length > 0) {
      const recentBMI = bmiHistory[bmiHistory.length - 1];
      if (recentBMI.result.healthRiskLevel >= 4) {
        recommendations.push({
          type: 'bmi',
          title: 'Address High Health Risk',
          description: 'Your BMI indicates a high health risk. Consult a healthcare provider and consider lifestyle changes.',
          icon: 'bi-clipboard2-pulse'
        });
      } else if (recentBMI.result.predictedCategory === 'Underweight' || recentBMI.result.predictedCategory === 'Obesity') {
        recommendations.push({
          type: 'bmi',
          title: 'Optimize Weight',
          description: `Your BMI category (${recentBMI.result.predictedCategory}) suggests consulting a nutritionist.`,
          icon: 'bi-egg-fried'
        });
      }
    }

    // Sleep recommendations
    if (sleepHistory.length > 0) {
      const recentSleep = sleepHistory[sleepHistory.length - 1];
      if (recentSleep.qualityOfSleep < 5) {
        recommendations.push({
          type: 'sleep',
          title: 'Improve Sleep Quality',
          description: 'Your sleep quality is below average. Try a consistent sleep schedule and reduce screen time.',
          icon: 'bi-moon-stars'
        });
      }
      if (recentSleep.sleepDuration < 6) {
        recommendations.push({
          type: 'sleep',
          title: 'Increase Sleep Duration',
          description: 'You’re sleeping less than 7-8 hours. Try going to bed 30 minutes earlier.',
          icon: 'bi-alarm'
        });
      }
    }

    // Anxiety recommendations
    if (anxietyHistory.length > 0) {
      const recentAnxiety = anxietyHistory[anxietyHistory.length - 1];
      if (recentAnxiety.anxietyScore > 7) {
        recommendations.push({
          type: 'anxiety',
          title: 'Manage Anxiety Levels',
          description: 'Your anxiety levels are elevated. Practice mindfulness or deep breathing exercises.',
          icon: 'bi-heart-pulse'
        });
      }
      if (recentAnxiety.phq_score > 10) {
        recommendations.push({
          type: 'anxiety',
          title: 'Depression Symptoms',
          description: 'Your PHQ-9 score indicates moderate depression. Consider professional help.',
          icon: 'bi-clipboard2-pulse'
        });
      }
    }

    // General recommendations
    if (recommendations.length < 2) {
      recommendations.push({
        type: 'general',
        title: 'Regular Exercise',
        description: 'Aim for 30 minutes of moderate exercise most days.',
        icon: 'bi-activity'
      });
      recommendations.push({
        type: 'general',
        title: 'Balanced Diet',
        description: 'Maintain a balanced diet rich in fruits and vegetables.',
        icon: 'bi-egg-fried'
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  // Determine health status
  const determineHealthStatus = () => {
    if (!sleepHistory.length && !anxietyHistory.length && !bmiHistory.length) {
      return { status: 'unknown', message: 'Complete your first health assessment', color: 'text-secondary' };
    }

    let issues = 0;
    if (bmiHistory.length > 0 && bmiHistory[bmiHistory.length - 1].result.healthRiskLevel >= 4) issues++;
    if (sleepHistory.length > 0) {
      const recentSleep = sleepHistory[sleepHistory.length - 1];
      if (recentSleep.qualityOfSleep < 5 || recentSleep.sleepDuration < 6 || recentSleep.hasDisorder) issues++;
    }
    if (anxietyHistory.length > 0) {
      const recentAnxiety = anxietyHistory[anxietyHistory.length - 1];
      if (recentAnxiety.anxietyScore > 7 || recentAnxiety.phq_score > 10) issues++;
    }

    if (issues >= 2) {
      return { status: 'attention', message: 'Your health metrics need attention', color: 'text-danger' };
    } else if (issues === 1) {
      return { status: 'caution', message: 'Some health metrics need improvement', color: 'text-warning' };
    } else {
      return { status: 'good', message: 'Your health metrics look good', color: 'text-success' };
    }
  };

  const healthStatus = determineHealthStatus();

  // Download summary report
  const downloadSummaryReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Health Dashboard Summary', 20, 20);
    doc.setFontSize(12);
    doc.text(`User: ${user?.name || 'N/A'}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Health Status: ${healthStatus.message}`, 20, 50);

    doc.autoTable({
      startY: 60,
      head: [['Metric', 'Latest Value', 'Status']],
      body: [
        [
          'BMI',
          bmiHistory.length > 0 ? `${bmiHistory[bmiHistory.length - 1].result.bmi} (${bmiHistory[bmiHistory.length - 1].result.predictedCategory})` : '-',
          bmiHistory.length > 0 && bmiHistory[bmiHistory.length - 1].result.healthRiskLevel >= 4 ? 'High Risk' : 'Normal'
        ],
        [
          'Sleep Quality',
          sleepHistory.length > 0 ? `${sleepHistory[sleepHistory.length - 1].qualityOfSleep}/10` : '-',
          sleepHistory.length > 0 && sleepHistory[sleepHistory.length - 1].qualityOfSleep < 5 ? 'Poor' : 'Good'
        ],
        [
          'Anxiety Score',
          anxietyHistory.length > 0 ? `${anxietyHistory[anxietyHistory.length - 1].anxietyScore}/10` : '-',
          anxietyHistory.length > 0 && anxietyHistory[anxietyHistory.length - 1].anxietyScore > 7 ? 'Elevated' : 'Normal'
        ]
      ]
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Recommendation', 'Description']],
      body: recommendations.map(rec => [rec.title, rec.description])
    });

    doc.save(`health_summary_${user?.name || 'user'}.pdf`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold mb-2">Welcome, {user?.name}!</h1>
            <p className="lead text-muted">Your health metrics at a glance</p>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`fs-5 fw-bold ${healthStatus.color} d-flex align-items-center mt-2`}
            >
              <i className={`bi ${healthStatus.status === 'good' ? 'bi-check-circle-fill' : 
                                  healthStatus.status === 'caution' ? 'bi-exclamation-triangle-fill' : 
                                  healthStatus.status === 'attention' ? 'bi-exclamation-circle-fill' : 
                                  'bi-question-circle-fill'} me-2`}></i>
              Health Status: {healthStatus.message}
            </motion.div>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <Link to="/nutritional-prediction" className="btn btn-primary me-2">
              <i className="bi bi-clipboard2-pulse me-1"></i> BMI Analysis
            </Link>
            <Link to="/profile" className="btn btn-outline-secondary">
              <i className="bi bi-person me-1"></i> Profile
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <ul className="nav nav-tabs mb-4">
          {['overview', 'bmi', 'sleep', 'anxiety', 'recommendations'].map(tab => (
            <li key={tab} className="nav-item">
              <button
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quick Stats Cards */}
              <div className="row g-4 mb-4">
                {[
                  { title: 'BMI', value: bmiHistory.length > 0 ? `${bmiHistory[bmiHistory.length - 1].result.bmi} (${bmiHistory[bmiHistory.length - 1].result.predictedCategory})` : '-', icon: 'bi-clipboard2-pulse', color: 'border-primary', updated: bmiHistory.length > 0 ? new Date(bmiHistory[bmiHistory.length - 1].date).toLocaleDateString() : null },
                  { title: 'Sleep Quality', value: sleepHistory.length > 0 ? `${sleepHistory[sleepHistory.length - 1].qualityOfSleep}/10` : '-', icon: 'bi-moon-stars', color: 'border-info', updated: sleepHistory.length > 0 ? new Date(sleepHistory[sleepHistory.length - 1].createdAt).toLocaleDateString() : null },
                  { title: 'Sleep Duration', value: sleepHistory.length > 0 ? `${sleepHistory[sleepHistory.length - 1].sleepDuration} hrs` : '-', icon: 'bi-alarm', color: 'border-success', updated: sleepHistory.length > 0 ? new Date(sleepHistory[sleepHistory.length - 1].createdAt).toLocaleDateString() : null },
                  { title: 'Anxiety Score', value: anxietyHistory.length > 0 ? `${anxietyHistory[anxietyHistory.length - 1].anxietyScore}/10` : '-', icon: 'bi-heart-pulse', color: 'border-warning', updated: anxietyHistory.length > 0 ? new Date(anxietyHistory[anxietyHistory.length - 1].createdAt).toLocaleDateString() : null }
                ].map((stat, idx) => (
                  <div key={stat.title} className="col-md-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`card shadow-sm h-100 border-left-${stat.color.split('-')[1]}`}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="text-muted mb-0">{stat.title}</h6>
                          <div className={`rounded-circle bg-${stat.color.split('-')[1]} bg-opacity-10 p-2`}>
                            <i className={`bi ${stat.icon} text-${stat.color.split('-')[1]}`}></i>
                          </div>
                        </div>
                        <div className="h3 mb-0">{stat.value}</div>
                        <div className="small text-muted mt-2">{stat.updated ? `Last updated: ${stat.updated}` : 'No data available'}</div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Health Overview Chart */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Health Metrics Overview</h5>
                  <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary active">Week</button>
                    <button type="button" className="btn btn-outline-secondary">Month</button>
                    <button type="button" className="btn btn-outline-secondary">Year</button>
                  </div>
                </div>
                <div className="card-body" style={{ height: '400px' }}>
                  {healthOverviewChart ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthOverviewChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 12]} />
                        <Tooltip />
                        <Legend />
                        {bmiHistory.length > 0 && <Line type="monotone" dataKey="bmi" stroke="#0d6efd" name="BMI" />}
                        {sleepHistory.length > 0 && <Line type="monotone" dataKey="sleepQuality" stroke="#6610f2" name="Sleep Quality" />}
                        {anxietyHistory.length > 0 && <Line type="monotone" dataKey="anxietyScore" stroke="#dc3545" name="Anxiety Score" />}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-bar-chart-line fs-1 text-muted mb-3 d-block"></i>
                      <p className="text-muted mb-3">No health data available yet</p>
                      <div className="d-flex justify-content-center gap-2">
                        <Link to="/nutritional-prediction" className="btn btn-primary">BMI Analysis</Link>
                        <Link to="/sleep-disorder" className="btn btn-success">Sleep Analysis</Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions & Recent Assessments */}
              <div className="row g-4">
                <div className="col-lg-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Quick Actions</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        {[
                          { to: '/nutritional-prediction', text: 'BMI Analysis', icon: 'bi-clipboard2-pulse', color: 'btn-primary' },
                          { to: '/sleep-disorder', text: 'Sleep Analysis', icon: 'bi-moon-stars', color: 'btn-success' },
                          { to: '/anxiety-prediction', text: 'Anxiety Assessment', icon: 'bi-heart-pulse', color: 'btn-warning' },
                          { to: '/depression-prediction', text: 'Depression Screening', icon: 'bi-emoji-frown', color: 'btn-danger' }
                        ].map(action => (
                          <Link
                            key={action.to}
                            to={action.to}
                            className={`btn ${action.color} d-flex align-items-center justify-content-between`}
                          >
                            <span>
                              <i className={`bi ${action.icon} me-2`}></i>
                              {action.text}
                            </span>
                            <i className="bi bi-chevron-right"></i>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Recent Assessments</h5>
                      <Link to="/health-history" className="text-decoration-none small">View All</Link>
                    </div>
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        {[...bmiHistory.slice(0, 2), ...sleepHistory.slice(0, 2), ...anxietyHistory.slice(0, 2)].map(assessment => (
                          <motion.div
                            key={assessment._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="list-group-item list-group-item-action"
                          >
                            {assessment.result ? (
                              <Link to={`/bmi-results/${assessment._id}`} className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                                    <i className="bi bi-clipboard2-pulse text-primary"></i>
                                  </div>
                                  <div>
                                    <span className="fw-bold text-primary">BMI Assessment</span>
                                    <small className="text-muted d-block">{new Date(assessment.date).toLocaleDateString()}</small>
                                  </div>
                                </div>
                                <div className="text-end">
                                  <span className={`badge ${assessment.result.healthRiskLevel >= 4 ? 'bg-danger' : 'bg-success'} rounded-pill`}>
                                    {assessment.result.predictedCategory}
                                  </span>
                                  <small className="d-block text-muted mt-1">BMI: {assessment.result.bmi}</small>
                                </div>
                              </Link>
                            ) : assessment.qualityOfSleep ? (
                              <Link to={`/sleep-results/${assessment._id}`} className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div className="rounded-circle bg-success bg-opacity-10 p-2 me-2">
                                    <i className="bi bi-moon-stars text-success"></i>
                                  </div>
                                  <div>
                                    <span className="fw-bold text-success">Sleep Assessment</span>
                                    <small className="text-muted d-block">{new Date(assessment.createdAt).toLocaleDateString()}</small>
                                  </div>
                                </div>
                                <div className="text-end">
                                  <span className={`badge ${assessment.hasDisorder ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                                    {assessment.hasDisorder ? `${assessment.predictionConfidence.toFixed(0)}% Risk` : 'Healthy'}
                                  </span>
                                  <small className="d-block text-muted mt-1">Quality: {assessment.qualityOfSleep}/10</small>
                                </div>
                              </Link>
                            ) : (
                              <Link to={`/anxiety-results/${assessment._id}`} className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-2">
                                    <i className="bi bi-heart-pulse text-warning"></i>
                                  </div>
                                  <div>
                                    <span className="fw-bold text-warning">Anxiety Assessment</span>
                                    <small className="text-muted d-block">{new Date(assessment.createdAt).toLocaleDateString()}</small>
                                  </div>
                                </div>
                                <div className="text-end">
                                  <span className={`badge ${assessment.anxietyScore > 7 ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                                    {assessment.anxietyScore > 7 ? 'Elevated' : 'Normal'}
                                  </span>
                                  <small className="d-block text-muted mt-1">Score: {assessment.anxietyScore}/10</small>
                                </div>
                              </Link>
                            )}
                          </motion.div>
                        ))}
                        {!bmiHistory.length && !sleepHistory.length && !anxietyHistory.length && (
                          <div className="text-center py-4">
                            <p className="text-muted mb-3">No assessments completed yet</p>
                            <div className="d-flex justify-content-center gap-2">
                              <Link to="/nutritional-prediction" className="btn btn-primary">BMI Analysis</Link>
                              <Link to="/sleep-disorder" className="btn btn-success">Sleep Analysis</Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BMI Tab */}
          {activeTab === 'bmi' && (
            <motion.div
              key="bmi"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">BMI History</h5>
                  <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary active">Week</button>
                    <button type="button" className="btn btn-outline-secondary">Month</button>
                    <button type="button" className="btn btn-outline-secondary">Year</button>
                  </div>
                </div>
                <div className="card-body" style={{ height: '400px' }}>
                  {bmiChart ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bmiChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 40]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="bmi" stroke="#0d6efd" name="BMI" />
                        <Line type="monotone" dataKey="healthRiskLevel" stroke="#dc3545" name="Health Risk Level" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-bar-chart-line fs-1 text-muted mb-3 d-block"></i>
                      <p className="text-muted mb-3">No BMI data available yet</p>
                      <Link to="/nutritional-prediction" className="btn btn-primary">Start BMI Analysis</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Recent BMI Assessments</h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {bmiHistory.slice(0, 5).map(assessment => (
                      <motion.div
                        key={assessment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="list-group-item list-group-item-action"
                      >
                        <Link to={`/bmi-results/${assessment._id}`} className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                              <i className="bi bi-clipboard2-pulse text-primary"></i>
                            </div>
                            <div>
                              <span className="fw-bold text-primary">BMI Assessment</span>
                              <small className="text-muted d-block">{new Date(assessment.date).toLocaleDateString()}</small>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className={`badge ${assessment.result.healthRiskLevel >= 4 ? 'bg-danger' : 'bg-success'} rounded-pill`}>
                              {assessment.result.predictedCategory}
                            </span>
                            <small className="d-block text-muted mt-1">BMI: {assessment.result.bmi}</small>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                    {!bmiHistory.length && (
                      <div className="text-center py-4">
                        <p className="text-muted mb-3">No BMI assessments yet</p>
                        <Link to="/nutritional-prediction" className="btn btn-primary">Start BMI Analysis</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sleep Tab */}
          {activeTab === 'sleep' && (
            <motion.div
              key="sleep"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Sleep History</h5>
                  <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary active">Week</button>
                    <button type="button" className="btn btn-outline-secondary">Month</button>
                    <button type="button" className="btn btn-outline-secondary">Year</button>
                  </div>
                </div>
                <div className="card-body" style={{ height: '400px' }}>
                  {sleepQualityChart ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sleepQualityChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 12]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="qualityOfSleep" stroke="#6610f2" name="Sleep Quality" />
                        <Line type="monotone" dataKey="sleepDuration" stroke="#198754" name="Sleep Duration" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-bar-chart-line fs-1 text-muted mb-3 d-block"></i>
                      <p className="text-muted mb-3">No sleep data available yet</p>
                      <Link to="/sleep-disorder" className="btn btn-success">Start Sleep Analysis</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Recent Sleep Assessments</h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {sleepHistory.slice(0, 5).map(assessment => (
                      <motion.div
                        key={assessment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="list-group-item list-group-item-action"
                      >
                        <Link to={`/sleep-results/${assessment._id}`} className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-2 me-2">
                              <i className="bi bi-moon-stars text-success"></i>
                            </div>
                            <div>
                              <span className="fw-bold text-success">Sleep Assessment</span>
                              <small className="text-muted d-block">{new Date(assessment.createdAt).toLocaleDateString()}</small>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className={`badge ${assessment.hasDisorder ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                              {assessment.hasDisorder ? `${assessment.predictionConfidence.toFixed(0)}% Risk` : 'Healthy'}
                            </span>
                            <small className="d-block text-muted mt-1">Quality: {assessment.qualityOfSleep}/10</small>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                    {!sleepHistory.length && (
                      <div className="text-center py-4">
                        <p className="text-muted mb-3">No sleep assessments yet</p>
                        <Link to="/sleep-disorder" className="btn btn-success">Start Sleep Analysis</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Anxiety Tab */}
          {activeTab === 'anxiety' && (
            <motion.div
              key="anxiety"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Anxiety History</h5>
                  <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary active">Week</button>
                    <button type="button" className="btn btn-outline-secondary">Month</button>
                    <button type="button" className="btn btn-outline-secondary">Year</button>
                  </div>
                </div>
                <div className="card-body" style={{ height: '400px' }}>
                  {anxietyChart ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={anxietyChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 27]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="anxietyScore" stroke="#ffc107" name="Anxiety Score" />
                        <Line type="monotone" dataKey="phq_score" stroke="#6f42c1" name="PHQ-9 Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-bar-chart-line fs-1 text-muted mb-3 d-block"></i>
                      <p className="text-muted mb-3">No anxiety data available yet</p>
                      <Link to="/anxiety-prediction" className="btn btn-warning">Start Anxiety Assessment</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Recent Anxiety Assessments</h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {anxietyHistory.slice(0, 5).map(assessment => (
                      <motion.div
                        key={assessment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="list-group-item list-group-item-action"
                      >
                        <Link to={`/anxiety-results/${assessment._id}`} className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-2">
                              <i className="bi bi-heart-pulse text-warning"></i>
                            </div>
                            <div>
                              <span className="fw-bold text-warning">Anxiety Assessment</span>
                              <small className="text-muted d-block">{new Date(assessment.createdAt).toLocaleDateString()}</small>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className={`badge ${assessment.anxietyScore > 7 ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                              {assessment.anxietyScore > 7 ? 'Elevated' : 'Normal'}
                            </span>
                            <small className="d-block text-muted mt-1">Score: {assessment.anxietyScore}/10</small>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                    {!anxietyHistory.length && (
                      <div className="text-center py-4">
                        <p className="text-muted mb-3">No anxiety assessments yet</p>
                        <Link to="/anxiety-prediction" className="btn btn-warning">Start Anxiety Assessment</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Personalized Recommendations</h5>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-success"
                    onClick={downloadSummaryReport}
                  >
                    Download Summary
                  </motion.button>
                </div>
                <div className="card-body">
                  <div className="row row-cols-1 row-cols-md-2 g-4">
                    {recommendations.map((rec, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="col"
                      >
                        <div className="card h-100 bg-light">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                              <i className={`bi ${rec.icon} me-2 text-primary`}></i>
                              <h6 className="card-title mb-0">{rec.title}</h6>
                            </div>
                            <p className="card-text small">{rec.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dashboard;