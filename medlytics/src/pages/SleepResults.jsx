import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SleepResults = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`/api/sleep/results/${id}`);
        setResult(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sleep results:', err);
        setError('Could not load sleep analysis results. Please try again later.');
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <div className="mt-4">
          <Link to="/sleep" className="text-blue-500 hover:text-blue-700">
            Go back to Sleep Analysis
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No results found!</strong>
          <span className="block sm:inline"> The requested analysis doesn't exist.</span>
        </div>
        <div className="mt-4">
          <Link to="/sleep" className="text-blue-500 hover:text-blue-700">
            Try another analysis
          </Link>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: ['Sleep Duration', 'Sleep Quality', 'Physical Activity', 'Stress Level', 'BMI', 'Heart Rate'],
    datasets: [
      {
        label: 'Your Metrics',
        data: [
          result.sleepDuration,
          result.qualityOfSleep,
          result.physicalActivity,
          result.stressLevel,
          result.bmi,
          result.heartRate,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Health Metrics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Get risk level color
  const getRiskLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const riskLevelColor = getRiskLevelColor(result.result.riskLevel);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Sleep Analysis Results</h1>
      
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Your Health Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Age</p>
              <p className="text-lg font-medium">{result.age} years</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="text-lg font-medium">{result.gender.charAt(0).toUpperCase() + result.gender.slice(1)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Daily Steps</p>
              <p className="text-lg font-medium">{result.dailySteps} steps</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Blood Pressure</p>
              <p className="text-lg font-medium">{result.bloodPressure.systolic}/{result.bloodPressure.diastolic} mmHg</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Heart Rate</p>
              <p className="text-lg font-medium">{result.heartRate} bpm</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">BMI</p>
              <p className="text-lg font-medium">{result.bmi}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Health Metrics Visualization</h2>
          <div className="bg-white p-4 rounded shadow">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1">
          <div className={`p-6 rounded-lg border ${riskLevelColor}`}>
            <h3 className="text-xl font-bold mb-2">Sleep Disorder Risk</h3>
            <div className="text-3xl font-bold mb-2">{result.result.riskLevel}</div>
            <p className="text-sm">
              {result.result.riskLevel === 'Low' && 'Your sleep metrics indicate a low risk for sleep disorders.'}
              {result.result.riskLevel === 'Moderate' && 'You have some risk factors that may contribute to sleep disorders.'}
              {result.result.riskLevel === 'High' && 'Several risk factors suggest you may be at high risk for sleep disorders.'}
            </p>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Possible Sleep Disorders</h3>
            {result.result.possibleDisorders.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {result.result.possibleDisorders.map((disorder, index) => (
                  <li key={index} className="text-gray-700">{disorder}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No specific sleep disorders detected.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Recommendations</h3>
        <ul className="list-disc list-inside space-y-2">
          {result.result.recommendations.map((recommendation, index) => (
            <li key={index} className="text-gray-700">{recommendation}</li>
          ))}
        </ul>
      </div>
      
      <div className="text-center mt-8">
        <Link
          to="/sleep"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
        >
          New Analysis
        </Link>
      </div>
    </div>
  );
};

export default SleepResults;