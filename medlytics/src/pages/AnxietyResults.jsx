// src/pages/AnxietyResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnxietyResult } from '../services/anxietyService';
import ResultLayout from '../components/results/ResultLayout';
import SeverityGauge from '../components/results/SeverityGauge';
import InsightCard from '../components/results/InsightCard';
import RecommendationList from '../components/results/RecommendationList';
import DisclaimerSection from '../components/results/DisclaimerSection';

const AnxietyResults = () => {
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
        const data = await getAnxietyResult(id);

        if (!data || !data.result) {
          throw new Error("Invalid data structure received");
        }

        setResultData(data.result);
      } catch (err) {
        console.error("Error in fetchResult:", err);
        setError(err.message || 'Failed to fetch anxiety analysis result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const getSeverityScore = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'minimal': return 15;
      case 'mild': return 40;
      case 'moderate': return 65;
      case 'severe': return 90;
      default: return 0;
    }
  };

  const getFactorIcon = (factorName) => {
    const icons = {
      'Depression': 'bi-cloud-rain',
      'Excessive Worry': 'bi-brain',
      'Suicidal Ideation': 'bi-exclamation-diamond',
      'Sleep Disturbance': 'bi-moon-stars',
      'Physical Health': 'bi-heart-pulse',
      'Social Anxiety': 'bi-person-x',
      'Panic Attacks': 'bi-lightning',
      'Generalized Anxiety': 'bi-infinity'
    };
    return icons[factorName] || 'bi-activity';
  };

  if (loading || error) {
    return (
      <ResultLayout
        loading={loading}
        error={error}
        retakePath="/anxiety-prediction"
      />
    );
  }

  return (
    <ResultLayout
      title="Anxiety Assessment Report"
      date={resultData.date || new Date()}
      onRetake={() => navigate('/anxiety-prediction')}
    >
      <div className="row g-4">
        {/* Severity Gauge Section */}
        <div className="col-md-5 col-lg-4">
          <SeverityGauge
            score={getSeverityScore(resultData.anxietySeverity)}
            maxScore={100}
            label="Anxiety Severity Level"
            severity={resultData.anxietySeverity}
          />

          <div className="card mt-4 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title h6 text-muted mb-3">Assessment Summary</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle p-2 me-3">
                  <i className="bi bi-diagram-3 text-primary"></i>
                </div>
                <div>
                  <small className="text-muted d-block">Identified Type</small>
                  <strong>{resultData.anxietyType || 'General Anxiety'}</strong>
                </div>
              </div>
              <p className="small text-muted mb-0">
                {resultData.anxietyTypeDescription || 'Based on your responses, this assessment indicates patterns consistent with the identified anxiety type.'}
              </p>
            </div>
          </div>
        </div>

        {/* Key Factors & Insights */}
        <div className="col-md-7 col-lg-8">
          <h3 className="h4 mb-4">Key Contributing Factors</h3>
          <div className="row g-3">
            {resultData.keyFactors && resultData.keyFactors.length > 0 ? (
              resultData.keyFactors.map((factor, idx) => (
                <div key={idx} className="col-sm-6">
                  <InsightCard
                    title={factor.name}
                    impact={factor.impact}
                    icon={getFactorIcon(factor.name)}
                    delay={idx * 0.1}
                  />
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-light border">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  No significant risk factors identified.
                </div>
              </div>
            )}
          </div>

          <RecommendationList items={resultData.recommendations} />

          {(resultData.anxietySeverity === 'Moderate' || resultData.anxietySeverity === 'Severe') && (
            <div className="alert alert-warning mt-4 d-flex align-items-start">
              <i className="bi bi-exclamation-triangle-fill fs-4 me-3 mt-1"></i>
              <div>
                <h5 className="alert-heading h6 fw-bold">Professional Support Recommended</h5>
                <p className="mb-0 small">
                  Your results indicate significant anxiety symptoms. We strongly recommend consulting with a mental health professional
                  for a comprehensive evaluation and personalized treatment plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <DisclaimerSection />
    </ResultLayout>
  );
};

export default AnxietyResults;