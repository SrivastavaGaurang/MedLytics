import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBMIResult } from '../services/bmiService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './BMIResult.css';

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
        const data = await getBMIResult(id);
        if (!data || !data.result) throw new Error("Invalid data structure received");
        setResultData(data.result);
      } catch (err) {
        setError(err.message || 'Failed to fetch result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const getBadgeColor = (category) => {
    switch (category) {
      case 'Underweight': return 'warning';
      case 'Normal': return 'success';
      case 'Overweight': return 'warning';
      case 'Obesity': return 'danger';
      default: return 'secondary';
    }
  };

  const calculateBMIValue = () => {
    if (!resultData || !resultData.explanation) return 0;
    const match = resultData.explanation.match(/Your BMI is (\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const chartData = {
    labels: ['BMI'],
    datasets: [{
      data: [calculateBMIValue(), 40 - calculateBMIValue()],
      backgroundColor: [`bg-${getBadgeColor(resultData?.predictedCategory)}`, '#e9ecef'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };

  const handleDownloadPDF = () => {
    const latexContent = `
\\documentclass[a4paper,12pt]{article}
\\usepackage{geometry}
\\geometry{margin=1in}
\\usepackage{amsmath}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\begin{document}
\\begin{center}
  \\textbf{\\large BMI Analysis Report}
\\end{center}
\\vspace{0.5cm}
\\textbf{Category:} ${resultData?.predictedCategory || 'N/A'}\\\\
\\textbf{Explanation:} ${resultData?.explanation || 'No explanation provided'}\\\\
\\textbf{Recommendations:}
\\begin{itemize}
${resultData?.recommendations?.map(rec => `  \\item ${rec}`).join('\n') || '  \\item No recommendations available'}
\\end{itemize}
\\end{document}
    `;
    const blob = new Blob([latexContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bmi_report.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center mt-5">Loading result...</div>;
  if (error) return <div className="alert alert-danger mt-4 mx-auto" style={{ maxWidth: '600px' }}>{error}</div>;
  if (!resultData) return <div className="alert alert-warning mt-4 mx-auto" style={{ maxWidth: '600px' }}>No result data available</div>;

  return (
    <div className="container-fluid bg-light py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card shadow result-card mx-auto"
        style={{ maxWidth: '800px' }}
      >
        <div className="card-body p-5">
          <h2 className="card-title mb-4">BMI Category Prediction Result</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <p className="lead mb-3">
                Predicted BMI Category: <span className={`badge bg-${getBadgeColor(resultData.predictedCategory)}`}>
                  {resultData.predictedCategory}
                </span>
              </p>
              <div style={{ height: '200px' }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="col-md-6">
              <h4 className="mb-3">What This Means</h4>
              <p className="text-muted mb-4">{resultData.explanation}</p>
              <h4 className="mb-3">Recommendations</h4>
              {resultData.recommendations && resultData.recommendations.length > 0 ? (
                <ul className="list-group mb-4">
                  {resultData.recommendations.map((rec, idx) => (
                    <li key={idx} className="list-group-item d-flex align-items-center">
                      <svg className="bi me-2" width="24" height="24" fill="currentColor">
                        <use xlinkHref="#check-circle-fill" />
                      </svg>
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No recommendations available.</p>
              )}
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-end mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/bmi-history')}
            >
              View History
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/nutritional-prediction')}
            >
              Try Again
            </button>
            <button
              className="btn btn-success"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>
            <button
              className="btn btn-info"
              onClick={() => alert('Share functionality not implemented')}
            >
              Share Result
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BMIResults;