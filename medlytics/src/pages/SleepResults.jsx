import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';
import './SleepResult.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale);

const SleepResults = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const defaultData = {
    sleepDuration: 7.2,
    sleepQuality: 85,
    remSleep: 22,
    deepSleep: 18,
    sleepEfficiency: 90,
    heartRate: 65,
    stressLevel: 30,
  };

  const sleepData = { ...defaultData, ...data };

  const barData = {
    labels: ['Sleep Duration', 'Sleep Quality', 'REM Sleep', 'Deep Sleep'],
    datasets: [{
      label: 'Sleep Metrics',
      data: [sleepData.sleepDuration, sleepData.sleepQuality, sleepData.remSleep, sleepData.deepSleep],
      backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
    }],
  };

  const radarData = {
    labels: ['Sleep Efficiency', 'Heart Rate', 'Stress Level'],
    datasets: [{
      label: 'Health Profile',
      data: [sleepData.sleepEfficiency, sleepData.heartRate, sleepData.stressLevel],
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      borderColor: '#4f46e5',
      pointBackgroundColor: '#4f46e5',
    }],
  };

  const doughnutData = {
    labels: ['REM Sleep', 'Deep Sleep', 'Light Sleep'],
    datasets: [{
      data: [sleepData.remSleep, sleepData.deepSleep, 100 - sleepData.remSleep - sleepData.deepSleep],
      backgroundColor: ['#10b981', '#f59e0b', '#d1d5db'],
    }],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  const radarOptions = {
    maintainAspectRatio: false,
    scales: { r: { beginAtZero: true, max: 100 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  const handlePrint = () => {
    window.print();
  };

  const MetricCard = ({ title, value, icon, delay }) => (
    <div className="col-md-4">
      <div className="card shadow-sm h-100 animate__animated animate__fadeInUp" style={{ animationDelay: `${delay}s` }}>
        <div className="card-body text-center">
          <i className={`${icon} text-primary mb-3`} style={{ fontSize: '2rem' }} aria-hidden="true"></i>
          <h6 className="card-title">{title}</h6>
          <p className="card-text fw-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="sleep-results-container animate__animated animate__fadeIn" aria-labelledby="sleep-report-title">
      <div className="container py-5">
        <h1 id="sleep-report-title" className="display-4 fw-bold mb-4 text-center">Sleep Analysis Report</h1>
        <p className="lead text-center mb-5">Your personalized sleep insights</p>

        <ul className="nav nav-pills mb-4 justify-content-center" role="tablist" aria-label="Sleep report navigation">
          {['overview', 'health', 'recommendations'].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="tab-pane fade show active" role="tabpanel">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card shadow-sm h-100 animate__animated animate__zoomIn">
                    <div className="card-body">
                      <h5 className="card-title">Sleep Metrics</h5>
                      <div className="chart-container">
                        <Bar data={barData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card shadow-sm h-100 animate__animated animate__zoomIn">
                    <div className="card-body">
                      <h5 className="card-title">Sleep Composition</h5>
                      <div className="chart-container">
                        <Doughnut data={doughnutData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="tab-pane fade show active" role="tabpanel">
              <div className="card shadow-sm animate__animated animate__fadeInUp">
                <div className="card-body">
                  <h5 className="card-title">Health Profile</h5>
                  <div className="chart-container" style={{ height: '400px' }}>
                    <Radar data={radarData} options={radarOptions} />
                  </div>
                </div>
              </div>
              <div className="row g-4 mt-4">
                {[
                  { title: 'Sleep Efficiency', value: `${sleepData.sleepEfficiency}%`, icon: 'bi bi-check-circle-fill' },
                  { title: 'Average Heart Rate', value: `${sleepData.heartRate} bpm`, icon: 'bi bi-heart-fill' },
                  { title: 'Stress Level', value: `${sleepData.stressLevel}%`, icon: 'bi bi-lightning-fill' },
                ].map((metric, idx) => (
                  <MetricCard key={idx} {...metric} delay={idx * 0.2} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="tab-pane fade show active" role="tabpanel">
              <div className="card shadow-sm animate__animated animate__fadeInUp">
                <div className="card-body">
                  <h5 className="card-title">Personalized Recommendations</h5>
                  <ul className="list-group list-group-flush">
                    {[
                      'Maintain a consistent sleep schedule to improve sleep quality.',
                      'Reduce screen time 1-2 hours before bed to enhance REM sleep.',
                      'Practice relaxation techniques to lower stress levels.',
                      'Ensure your bedroom is cool, dark, and quiet for optimal sleep.',
                    ].map((rec, idx) => (
                      <li className="list-group-item" key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-5">
          <button className="btn btn-primary btn-lg" onClick={handlePrint} aria-label="Print sleep report">
            <i className="bi bi-printer-fill me-2" aria-hidden="true"></i>Print Report
          </button>
        </div>
      </div>
    </section>
  );
};

SleepResults.propTypes = {
  data: PropTypes.shape({
    sleepDuration: PropTypes.number,
    sleepQuality: PropTypes.number,
    remSleep: PropTypes.number,
    deepSleep: PropTypes.number,
    sleepEfficiency: PropTypes.number,
    heartRate: PropTypes.number,
    stressLevel: PropTypes.number,
  }),
};

SleepResults.defaultProps = {
  data: {},
};

export default SleepResults;