// src/services/bmiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Analyze BMI data by sending it to the backend API
 * @param {Object} bmiData - User's BMI assessment data
 * @param {string|null} token - Optional Auth0 access token
 * @returns {Promise<Object>} - Analyzed BMI data from the server
 */
export const analyzeBMI = async (bmiData, token = null) => {
  try {
    let headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(`${API_URL}/bmi/analyze`, bmiData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error analyzing BMI data:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze BMI data');
  }
};

/**
 * Get BMI result by ID
 * @param {string} id - The ID of the BMI analysis result
 * @returns {Promise<Object>} - BMI analysis result
 */
export const getBMIResult = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/bmi/results/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching BMI result:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch BMI result');
  }
};

/**
 * Get BMI history for the current user
 * @param {string} token - Auth0 access token
 * @returns {Promise<Array>} - Array of BMI analysis results
 */
export const getBMIHistory = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/bmi/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching BMI history:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch BMI history');
  }
};

export default {
  analyzeBMI,
  getBMIResult,
  getBMIHistory
};