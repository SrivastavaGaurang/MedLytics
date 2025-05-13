// src/services/anxietyService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Analyze anxiety data by sending it to the backend API
 * @param {Object} anxietyData - User's anxiety assessment data
 * @param {string|null} token - Optional Auth0 access token
 * @returns {Promise<Object>} - Analyzed anxiety data from the server
 */
export const analyzeAnxiety = async (anxietyData, token = null) => {
  try {
    let headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(`${API_URL}/anxiety/analyze`, anxietyData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error analyzing anxiety data:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze anxiety data');
  }
};

/**
 * Get anxiety result by ID
 * @param {string} id - The ID of the anxiety analysis result
 * @returns {Promise<Object>} - Anxiety analysis result
 */
export const getAnxietyResult = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/anxiety/results/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching anxiety result:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch anxiety result');
  }
};

/**
 * Get anxiety history for the current user
 * @param {string} token - Auth0 access token
 * @returns {Promise<Array>} - Array of anxiety analysis results
 */
export const getAnxietyHistory = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/anxiety/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching anxiety history:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch anxiety history');
  }
};

export default {
  analyzeAnxiety,
  getAnxietyResult,
  getAnxietyHistory
};
