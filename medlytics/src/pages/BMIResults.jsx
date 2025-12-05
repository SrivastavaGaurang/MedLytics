// src/pages/BMIResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBMIResult } from '../services/bmiService';
import ResultLayout from '../components/results/ResultLayout';
import SeverityGauge from '../components/results/SeverityGauge';
import RecommendationList from '../components/results/RecommendationList';
import DisclaimerSection from '../components/results/DisclaimerSection';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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
        setLoading(true);
        const data = await getBMIResult(id);

        if (!data || !data.result) {
          throw new Error("Invalid data structure received");
        }

        setResultData(data.result);
      } catch (err) {
        console.error("Error in fetchResult:", err);
        setError(err.message || 'Failed to fetch BMI analysis result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const calculateBMIValue = () => {
    if (!resultData || !resultData.explanation) return 0;
    const match = resultData.explanation.match(/Your BMI is (\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'underweight': return '#f39c12'; // Warning
      case 'normal': return '#2ecc71';      // Success
      case 'overweight': return '#e67e22';  // Warning
      case 'obesity': return '#e74c3c';     // Danger
      default: return '#95a5a6';            // Secondary
    }
  };

  const getSeverityScore = (category) => {
    switch (category?.toLowerCase()) {
      case 'underweight': return 25;
      case 'normal': return 50;
      case 'overweight': return 75;
      case 'obesity': return 95;
      default: return 0;
    }
  };

  if (loading || error) {
    return (
      <ResultLayout
        loading={loading}
        error={error}
        retakePath="/nutritional-prediction"
      />
    );
  }

  const bmiValue = calculateBMIValue();
  const categoryColor = getCategoryColor(resultData.predictedCategory);

  const chartData = {
    labels: ['Your BMI', 'Remaining'],
    datasets: [{
      data: [bmiValue, Math.max(0, 40 - bmiValue)],
      backgroundColor: [categoryColor, '#ecf0f1'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }],
  };

  return (
    <ResultLayout
      title="BMI & Nutritional Analysis"
      date={resultData.date || new Date()}
      onRetake={() => navigate('/nutritional-prediction')}
    >
      <div className="row g-4">
        {/* Main Gauge Section */}
        <div className="col-md-5 col-lg-4">
          <SeverityGauge
            score={getSeverityScore(resultData.predictedCategory)}
            maxScore={100}
            label="BMI Category"
            severity={resultData.predictedCategory}
            color={categoryColor}
          />

          <div className="card mt-4 border-0 shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted mb-3">Visual Representation</h6>
              <div style={{ height: '180px', position: 'relative' }}>
                <Doughnut
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { tooltip: { enabled: false }, legend: { display: false } },
                    cutout: '75%'
                  }}
                />
                <div className="position-absolute top-50 start-50 translate-middle mt-4">
                  <h2 className="fw-bold mb-0">{bmiValue.toFixed(1)}</h2>
                  <small className="text-muted">BMI Score</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis & Recommendations */}
        <div className="col-md-7 col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle p-2 me-3">
                  <i className="bi bi-info-circle text-primary"></i>
                </div>
                <h5 className="mb-0">Analysis Summary</h5>
              </div>
              <p className="text-muted mb-0">{resultData.explanation}</p>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded text-center bg-white h-100">
                <div className="mb-2" style={{ height: '4px', background: '#f39c12', width: '100%' }}></div>
                <small className="d-block text-muted">Underweight</small>
                <strong>&lt; 18.5</strong>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded text-center bg-white h-100">
                <div className="mb-2" style={{ height: '4px', background: '#2ecc71', width: '100%' }}></div>
                <small className="d-block text-muted">Normal</small>
                <strong>18.5 - 24.9</strong>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded text-center bg-white h-100">
                <div className="mb-2" style={{ height: '4px', background: '#e67e22', width: '100%' }}></div>
                <small className="d-block text-muted">Overweight</small>
                <strong>25 - 29.9</strong>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded text-center bg-white h-100">
                <div className="mb-2" style={{ height: '4px', background: '#e74c3c', width: '100%' }}></div>
                <small className="d-block text-muted">Obesity</small>
                <strong>&ge; 30</strong>
              </div>
            </div>
          </div>

          <RecommendationList items={resultData.recommendations} title="Nutritional Recommendations" />
        </div>
      </div>

      <DisclaimerSection />
    </ResultLayout>
  );
};

export default BMIResults;