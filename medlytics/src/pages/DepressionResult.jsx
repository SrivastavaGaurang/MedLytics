// src/pages/DepressionResult.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDepressionResult } from '../services/depressionService';
import ResultLayout from '../components/results/ResultLayout';
import SeverityGauge from '../components/results/SeverityGauge';
import InsightCard from '../components/results/InsightCard';
import RecommendationList from '../components/results/RecommendationList';
import DisclaimerSection from '../components/results/DisclaimerSection';

const DepressionResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!id) {
          setError('No analysis ID provided.');
          setLoading(false);
          return;
        }

        const data = await getDepressionResult(id);
        setResult(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'An error occurred while fetching results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  // Map "Low", "Moderate", "High" risk levels to severity gauge values
  const getSeverityScore = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 20;
      case 'moderate': return 55;
      case 'high': return 85;
      default: return 0;
    }
  };

  // Map risk levels to standard severity labels
  const getSeverityLabel = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'Mild';
      case 'moderate': return 'Moderate';
      case 'high': return 'Severe';
      default: return 'Unknown';
    }
  };

  const getFactorIcon = (factorName) => {
    const name = factorName?.toLowerCase() || '';
    if (name.includes('sleep')) return 'bi-moon-stars';
    if (name.includes('stress') || name.includes('worry')) return 'bi-lightning';
    if (name.includes('diet') || name.includes('eating')) return 'bi-egg-fried';
    if (name.includes('activity') || name.includes('exercise')) return 'bi-person-walking';
    if (name.includes('social')) return 'bi-people';
    if (name.includes('mood') || name.includes('sadness')) return 'bi-emoji-frown';
    if (name.includes('suicid')) return 'bi-exclamation-diamond';
    return 'bi-activity';
  };

  if (loading || error) {
    return (
      <ResultLayout
        loading={loading}
        error={error}
        retakePath="/depression-prediction"
      />
    );
  }

  const riskLevel = result?.result?.riskLevel;
  const severityLabel = getSeverityLabel(riskLevel);

  return (
    <ResultLayout
      title="Depression Risk Analysis"
      date={result.date}
      onRetake={() => navigate('/depression-prediction')}
    >
      <div className="row g-4">
        {/* Severity Gauge Section */}
        <div className="col-md-5 col-lg-4">
          <SeverityGauge
            score={getSeverityScore(riskLevel)}
            maxScore={100}
            label="Depression Risk Level"
            severity={severityLabel}
          />

          <div className="card mt-4 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title h6 text-muted mb-3">Assessment Summary</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle p-2 me-3">
                  <i className="bi bi-person text-primary"></i>
                </div>
                <div>
                  <small className="text-muted d-block">Profile</small>
                  <strong>{result.age} years • {result.gender}</strong>
                </div>
              </div>

              {result.result?.depressionType && (
                <div className="mt-3 pt-3 border-top">
                  <h6 className="text-primary mb-2">{result.result.depressionType}</h6>
                  <p className="small text-muted mb-0">
                    {result.result.depressionTypeDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Factors & Insights */}
        <div className="col-md-7 col-lg-8">
          <h3 className="h4 mb-4">Key Contributing Factors</h3>
          <div className="row g-3">
            {result.result?.keyFactors && result.result.keyFactors.length > 0 ? (
              result.result.keyFactors.map((factor, idx) => (
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
                  No significant contributing factors identified.
                </div>
              </div>
            )}
          </div>

          <RecommendationList items={result.result?.recommendations} />

          {/* Crisis Resources for High Risk */}
          {(riskLevel === 'High' || riskLevel === 'high') && (
            <div className="alert alert-danger mt-4 shadow-sm border-danger">
              <div className="d-flex">
                <i className="bi bi-life-preserver fs-1 me-3 text-danger"></i>
                <div>
                  <h5 className="alert-heading h6 fw-bold">Immediate Support Available</h5>
                  <p className="mb-2 small">
                    If you are feeling overwhelmed or hopeless, you are not alone. Support is available right now.
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <a href="tel:988" className="btn btn-sm btn-danger">
                      <i className="bi bi-telephone-fill me-2"></i> Call 988
                    </a>
                    <a href="sms:741741" className="btn btn-sm btn-outline-danger">
                      Text HOME to 741741
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DisclaimerSection />
    </ResultLayout>
  );
};

export default DepressionResults;