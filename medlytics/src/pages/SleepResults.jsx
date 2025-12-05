// src/pages/SleepResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import ResultLayout from '../components/results/ResultLayout';
import InsightCard from '../components/results/InsightCard';
import RecommendationList from '../components/results/RecommendationList';
import DisclaimerSection from '../components/results/DisclaimerSection';
import { getSleepResult } from '../services/sleepService';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale);

const SleepResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("No result ID provided");
        }

        const data = await getSleepResult(id);

        if (!data || !data.result) {
          throw new Error("Invalid data structure received");
        }

        // Map backend data to frontend structure
        const backendResult = data.result;
        const mappedData = {
          date: new Date(data.date),
          sleepDuration: data.sleepDuration,
          sleepQuality: (data.qualityOfSleep / 10) * 100, // Convert 1-10 to percentage
          remSleep: backendResult.sleepStages?.remSleep || 20,
          deepSleep: backendResult.sleepStages?.deepSleep || 15,
          lightSleep: backendResult.sleepStages?.lightSleep || 65,
          sleepEfficiency: backendResult.sleepEfficiency || 80,
          heartRate: data.heartRate,
          stressLevel: (data.stressLevel / 10) * 100,
          riskLevel: backendResult.riskLevel,
          riskDescription: backendResult.riskDescription,
          recommendations: backendResult.recommendations || []
        };

        setResultData(mappedData);
      } catch (err) {
        console.error("Error fetching sleep result:", err);
        setError(err.message || "Failed to load sleep analysis results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading || error) {
    return (
      <ResultLayout
        loading={loading}
        error={error}
        retakePath="/sleep-disorder"
      />
    );
  }

  // Chart Data Configuration
  const barData = {
    labels: ['Duration (hrs)', 'Quality (%)', 'Efficiency (%)'],
    datasets: [{
      label: 'Your Sleep Metrics',
      data: [resultData.sleepDuration, resultData.sleepQuality, resultData.sleepEfficiency],
      backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
      borderRadius: 8,
    }],
  };

  const doughnutData = {
    labels: ['REM Sleep', 'Deep Sleep', 'Light Sleep'],
    datasets: [{
      data: [resultData.remSleep, resultData.deepSleep, resultData.lightSleep],
      backgroundColor: ['#8b5cf6', '#3b82f6', '#e5e7eb'],
      borderWidth: 0,
    }],
  };

  const radarData = {
    labels: ['Duration', 'Quality', 'Efficiency', 'Relaxation', 'Regularity'],
    datasets: [{
      label: 'Sleep Health Profile',
      data: [
        (resultData.sleepDuration / 9) * 100,
        resultData.sleepQuality,
        resultData.sleepEfficiency,
        100 - resultData.stressLevel,
        80 // Mock regularity
      ],
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      borderColor: '#4f46e5',
      pointBackgroundColor: '#4f46e5',
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <ResultLayout
      title="Sleep Quality Analysis"
      date={resultData.date}
      onRetake={() => navigate('/sleep-disorder')}
    >
      <div className="row g-4">
        {/* Main Metrics Cards */}
        <div className="col-12">
          <div className="row g-3">
            <div className="col-md-4">
              <InsightCard
                title="Sleep Duration"
                value={`${resultData.sleepDuration} hrs`}
                icon="bi-clock"
                impact={resultData.sleepDuration < 7 ? 'Moderate' : 'Low'}
                description="Recommended: 7-9 hours"
              />
            </div>
            <div className="col-md-4">
              <InsightCard
                title="Sleep Quality"
                value={`${resultData.sleepQuality.toFixed(0)}%`}
                icon="bi-stars"
                impact={resultData.sleepQuality < 75 ? 'Moderate' : 'Low'}
                description="Based on depth and continuity"
              />
            </div>
            <div className="col-md-4">
              <InsightCard
                title="Sleep Efficiency"
                value={`${resultData.sleepEfficiency}%`}
                icon="bi-graph-up-arrow"
                impact={resultData.sleepEfficiency < 85 ? 'Moderate' : 'Low'}
                description="Time asleep vs. time in bed"
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title h6 text-muted mb-4">Sleep Architecture & Metrics</h5>
              <div className="row">
                <div className="col-md-6 mb-4 mb-md-0" style={{ height: '250px' }}>
                  <Bar data={barData} options={chartOptions} />
                </div>
                <div className="col-md-6" style={{ height: '250px' }}>
                  <div className="position-relative h-100 w-100 d-flex justify-content-center">
                    <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '70%' }} />
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <small className="text-muted">Stages</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart & Insights */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title h6 text-muted mb-4">Health Profile</h5>
              <div style={{ height: '250px' }}>
                <Radar data={radarData} options={{ ...chartOptions, scales: { r: { beginAtZero: true, max: 100 } } }} />
              </div>
              <div className="mt-3 text-center">
                <span className="badge bg-light text-dark border me-2">
                  <i className="bi bi-heart-pulse me-1 text-danger"></i>
                  HR: {resultData.heartRate} bpm
                </span>
                <span className="badge bg-light text-dark border">
                  <i className="bi bi-lightning me-1 text-warning"></i>
                  Stress: {resultData.stressLevel.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="col-12">
          <RecommendationList items={resultData.recommendations} title="Sleep Hygiene Recommendations" />
        </div>
      </div>

      <DisclaimerSection />
    </ResultLayout>
  );
};

export default SleepResults;