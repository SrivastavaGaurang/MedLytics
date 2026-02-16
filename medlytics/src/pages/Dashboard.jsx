import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getBMIHistory } from '../services/bmiService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Dashboard.css';

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
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(userData.message || 'Failed to fetch user data');
        }
        setUser(userData);

        // Fetch sleep history - Don't fail on error
        try {
          const sleepResponse = await fetch('http://localhost:5000/api/sleep/history', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const sleepData = await sleepResponse.json();
          if (sleepResponse.ok && Array.isArray(sleepData)) {
            setSleepHistory(sleepData);
          } else {
            setSleepHistory([]);
          }
        } catch (sleepError) {
          console.log('No sleep history available');
          setSleepHistory([]);
        }

        // Fetch anxiety history - Don't fail on error
        try {
          const anxietyResponse = await fetch('http://localhost:5000/api/anxiety/history', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const anxietyData = await anxietyResponse.json();
          if (anxietyResponse.ok && Array.isArray(anxietyData)) {
            setAnxietyHistory(anxietyData);
          } else {
            setAnxietyHistory([]);
          }
        } catch (anxietyError) {
          console.log('No anxiety history available');
          setAnxietyHistory([]);
        }

        // Fetch BMI history - Don't fail on error
        try {
          const bmiData = await getBMIHistory(() => Promise.resolve(token));
          if (Array.isArray(bmiData)) {
            setBMIHistory(bmiData);
          } else {
            setBMIHistory([]);
          }
        } catch (bmiError) {
          console.log('No BMI history available');
          setBMIHistory([]);
        }
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
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="glass-card p-5 text-center max-w-md">
          <div className="text-danger mb-3">
            <i className="bi bi-exclamation-circle fs-1"></i>
          </div>
          <h3 className="h4 mb-3">Authentication Error</h3>
          <p className="text-muted mb-4">{error}</p>
          <Link to="/login" className="btn btn-primary px-4 py-2 rounded-pill">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5 position-relative overflow-hidden bg-light">
      {/* Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 z-n1 overflow-hidden">
        <div className="position-absolute top-0 end-0 bg-primary opacity-10 rounded-circle blur-3xl" style={{ width: '600px', height: '600px', transform: 'translate(30%, -30%)' }}></div>
        <div className="position-absolute bottom-0 start-0 bg-secondary opacity-10 rounded-circle blur-3xl" style={{ width: '500px', height: '500px', transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="container position-relative z-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="glass-card p-4 mb-5 border-0">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-6 fw-bold mb-2 text-gradient-primary">Welcome back, {user?.name}!</h1>
                <p className="lead text-muted mb-3">Here's your health overview for today.</p>
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className={`d-inline-flex align-items-center px-3 py-2 rounded-pill bg-white bg-opacity-50 border ${healthStatus.status === 'good' ? 'border-success text-success' : healthStatus.status === 'caution' ? 'border-warning text-warning' : 'border-danger text-danger'}`}
                >
                  <i className={`bi ${healthStatus.status === 'good' ? 'bi-check-circle-fill' :
                    healthStatus.status === 'caution' ? 'bi-exclamation-triangle-fill' :
                      healthStatus.status === 'attention' ? 'bi-exclamation-circle-fill' :
                        'bi-question-circle-fill'} me-2`}></i>
                  <span className="fw-medium">{healthStatus.message}</span>
                </motion.div>
              </div>
              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <div className="d-flex gap-2 justify-content-lg-end flex-wrap">
                  <Link to="/nutritional-prediction" className="btn btn-primary rounded-pill px-4 shadow-glow">
                    <i className="bi bi-clipboard2-pulse me-2"></i>New Analysis
                  </Link>
                  <Link to="/profile" className="btn btn-outline-primary rounded-pill px-4">
                    <i className="bi bi-person me-2"></i>Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="mb-4 overflow-auto">
            <div className="d-flex gap-2 pb-2">
              {['overview', 'bmi', 'sleep', 'anxiety', 'recommendations'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn rounded-pill px-4 py-2 fw-medium transition-all ${activeTab === tab
                    ? 'btn-primary shadow-glow'
                    : 'btn-light text-muted hover-lift'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

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
                <div className="row g-4 mb-5">
                  {[
                    { title: 'BMI', value: bmiHistory.length > 0 ? `${bmiHistory[bmiHistory.length - 1].result.bmi}` : '-', sub: bmiHistory.length > 0 ? bmiHistory[bmiHistory.length - 1].result.predictedCategory : 'No data', icon: 'bi-clipboard2-pulse', color: 'primary' },
                    { title: 'Sleep Quality', value: sleepHistory.length > 0 ? `${sleepHistory[sleepHistory.length - 1].qualityOfSleep}/10` : '-', sub: 'Last Night', icon: 'bi-moon-stars', color: 'info' },
                    { title: 'Sleep Duration', value: sleepHistory.length > 0 ? `${sleepHistory[sleepHistory.length - 1].sleepDuration}h` : '-', sub: 'Hours Slept', icon: 'bi-alarm', color: 'success' },
                    { title: 'Anxiety Score', value: anxietyHistory.length > 0 ? `${anxietyHistory[anxietyHistory.length - 1].anxietyScore}/10` : '-', sub: 'Recent Check', icon: 'bi-heart-pulse', color: 'warning' }
                  ].map((stat, idx) => (
                    <div key={stat.title} className="col-md-3">
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card p-4 h-100 position-relative overflow-hidden"
                      >
                        <div className={`position-absolute top-0 end-0 p-3 opacity-10 text-${stat.color}`}>
                          <i className={`bi ${stat.icon} display-1`}></i>
                        </div>
                        <div className="position-relative z-1">
                          <h6 className="text-muted mb-2 text-uppercase fs-7 fw-bold tracking-wider">{stat.title}</h6>
                          <div className="d-flex align-items-baseline">
                            <h3 className="display-6 fw-bold mb-0 text-dark">{stat.value}</h3>
                          </div>
                          <p className={`mb-0 mt-2 small text-${stat.color} fw-medium`}>
                            {stat.sub}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>

                {/* Health Overview Chart */}
                <div className="glass-card p-4 mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-bold">Health Trends</h5>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-light text-dark active">Week</button>
                      <button className="btn btn-sm btn-outline-light text-dark">Month</button>
                    </div>
                  </div>
                  <div style={{ height: '400px' }}>
                    {healthOverviewChart ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={healthOverviewChart}>
                          <defs>
                            <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6610f2" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6610f2" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6c757d' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6c757d' }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                          />
                          <Legend />
                          {bmiHistory.length > 0 && <Area type="monotone" dataKey="bmi" stroke="#0d6efd" strokeWidth={3} fillOpacity={1} fill="url(#colorBmi)" name="BMI" />}
                          {sleepHistory.length > 0 && <Area type="monotone" dataKey="sleepQuality" stroke="#6610f2" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" name="Sleep Quality" />}
                          {anxietyHistory.length > 0 && <Line type="monotone" dataKey="anxietyScore" stroke="#dc3545" strokeWidth={3} dot={{ r: 4 }} name="Anxiety Score" />}
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                        <div className="bg-light rounded-circle p-4 mb-3">
                          <i className="bi bi-bar-chart-line fs-1 text-muted"></i>
                        </div>
                        <h5 className="text-muted">No data available yet</h5>
                        <p className="text-muted small mb-3">Complete assessments to see your trends</p>
                        <Link to="/nutritional-prediction" className="btn btn-sm btn-primary rounded-pill px-3">
                          Start Assessment
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="row g-4">
                  <div className="col-lg-8">
                    <div className="glass-card p-0 h-100 overflow-hidden">
                      <div className="p-4 border-bottom border-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0 fw-bold">Recent Activity</h5>
                          <Link to="/health-history" className="btn btn-sm btn-light rounded-pill">View All</Link>
                        </div>
                      </div>
                      <div className="list-group list-group-flush">
                        {[...bmiHistory.slice(0, 2), ...sleepHistory.slice(0, 2), ...anxietyHistory.slice(0, 2)].map((assessment, idx) => (
                          <motion.div
                            key={assessment._id || idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="list-group-item border-light p-3 hover-bg-light transition-all"
                          >
                            {/* Logic to render different assessment types */}
                            {assessment.result ? (
                              <Link to={`/bmi-results/${assessment._id}`} className="d-flex align-items-center text-decoration-none text-dark">
                                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                  <i className="bi bi-clipboard2-pulse text-primary fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-0 fw-bold">BMI Assessment</h6>
                                  <small className="text-muted">{new Date(assessment.date).toLocaleDateString()}</small>
                                </div>
                                <div className="text-end">
                                  <span className={`badge rounded-pill ${assessment.result.healthRiskLevel >= 4 ? 'bg-danger' : 'bg-success'}`}>
                                    {assessment.result.predictedCategory}
                                  </span>
                                </div>
                              </Link>
                            ) : assessment.qualityOfSleep ? (
                              <Link to={`/sleep-results/${assessment._id}`} className="d-flex align-items-center text-decoration-none text-dark">
                                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                                  <i className="bi bi-moon-stars text-info fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-0 fw-bold">Sleep Analysis</h6>
                                  <small className="text-muted">{new Date(assessment.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="text-end">
                                  <span className={`badge rounded-pill ${assessment.hasDisorder ? 'bg-warning' : 'bg-success'}`}>
                                    {assessment.hasDisorder ? 'Risk Detected' : 'Healthy'}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <Link to={`/anxiety-results/${assessment._id}`} className="d-flex align-items-center text-decoration-none text-dark">
                                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                  <i className="bi bi-heart-pulse text-warning fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-0 fw-bold">Anxiety Check</h6>
                                  <small className="text-muted">{new Date(assessment.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="text-end">
                                  <span className={`badge rounded-pill ${assessment.anxietyScore > 7 ? 'bg-warning' : 'bg-success'}`}>
                                    Score: {assessment.anxietyScore}
                                  </span>
                                </div>
                              </Link>
                            )}
                          </motion.div>
                        ))}
                        {!bmiHistory.length && !sleepHistory.length && !anxietyHistory.length && (
                          <div className="p-5 text-center">
                            <p className="text-muted mb-0">No recent activity</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="glass-card p-4 h-100">
                      <h5 className="mb-4 fw-bold">Quick Actions</h5>
                      <div className="d-grid gap-3">
                        {[
                          { to: '/nutritional-prediction', text: 'BMI Analysis', icon: 'bi-clipboard2-pulse', color: 'primary' },
                          { to: '/sleep-disorder', text: 'Sleep Analysis', icon: 'bi-moon-stars', color: 'info' },
                          { to: '/anxiety-prediction', text: 'Anxiety Check', icon: 'bi-heart-pulse', color: 'warning' },
                          { to: '/depression-prediction', text: 'Depression Screen', icon: 'bi-emoji-frown', color: 'danger' }
                        ].map(action => (
                          <Link
                            key={action.to}
                            to={action.to}
                            className={`btn btn-outline-${action.color} text-start p-3 rounded-xl d-flex align-items-center hover-lift transition-all`}
                          >
                            <div className={`rounded-circle bg-${action.color} text-white p-2 me-3 d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                              <i className={`bi ${action.icon}`}></i>
                            </div>
                            <span className="fw-medium">{action.text}</span>
                            <i className="bi bi-chevron-right ms-auto"></i>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other Tabs (BMI, Sleep, Anxiety) - Using similar glassmorphism structure */}
            {activeTab === 'bmi' && (
              <motion.div
                key="bmi"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-4 mb-4">
                  <h5 className="mb-4 fw-bold">BMI History</h5>
                  <div style={{ height: '400px' }}>
                    {bmiChart ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bmiChart}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                          <Legend />
                          <Line type="monotone" dataKey="bmi" stroke="#0d6efd" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="BMI" />
                          <Line type="monotone" dataKey="healthRiskLevel" stroke="#dc3545" strokeWidth={2} strokeDasharray="5 5" name="Risk Level" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No BMI data available</p>
                        <Link to="/nutritional-prediction" className="btn btn-primary rounded-pill">Start Analysis</Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'sleep' && (
              <motion.div
                key="sleep"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-4 mb-4">
                  <h5 className="mb-4 fw-bold">Sleep Patterns</h5>
                  <div style={{ height: '400px' }}>
                    {sleepQualityChart ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sleepQualityChart}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                          <Legend />
                          <Line type="monotone" dataKey="qualityOfSleep" stroke="#6610f2" strokeWidth={3} dot={{ r: 4 }} name="Sleep Quality" />
                          <Line type="monotone" dataKey="sleepDuration" stroke="#198754" strokeWidth={3} dot={{ r: 4 }} name="Duration (hrs)" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No sleep data available</p>
                        <Link to="/sleep-disorder" className="btn btn-primary rounded-pill">Start Analysis</Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'anxiety' && (
              <motion.div
                key="anxiety"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-4 mb-4">
                  <h5 className="mb-4 fw-bold">Anxiety Trends</h5>
                  <div style={{ height: '400px' }}>
                    {anxietyChart ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={anxietyChart}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                          <Legend />
                          <Line type="monotone" dataKey="anxietyScore" stroke="#ffc107" strokeWidth={3} dot={{ r: 4 }} name="Anxiety Score" />
                          <Line type="monotone" dataKey="phq_score" stroke="#6f42c1" strokeWidth={3} dot={{ r: 4 }} name="PHQ-9 Score" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No anxiety data available</p>
                        <Link to="/anxiety-prediction" className="btn btn-primary rounded-pill">Start Analysis</Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-bold">Personalized Recommendations</h5>
                    <button onClick={downloadSummaryReport} className="btn btn-success rounded-pill px-4 shadow-glow">
                      <i className="bi bi-download me-2"></i>Download Report
                    </button>
                  </div>
                  <div className="row g-4">
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="col-md-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 rounded-xl bg-white border border-light shadow-sm h-100 position-relative overflow-hidden"
                        >
                          <div className={`position-absolute top-0 end-0 p-3 opacity-10`}>
                            <i className={`bi ${rec.icon} display-1 text-primary`}></i>
                          </div>
                          <div className="position-relative z-1">
                            <div className="d-flex align-items-center mb-3">
                              <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                <i className={`bi ${rec.icon} text-primary fs-5`}></i>
                              </div>
                              <h6 className="mb-0 fw-bold">{rec.title}</h6>
                            </div>
                            <p className="text-muted mb-0 small">{rec.description}</p>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                    {recommendations.length === 0 && (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted">Complete assessments to get personalized recommendations.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;