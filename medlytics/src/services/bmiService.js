// src/services/bmiService.js
import apiClient, { createAuthenticatedClient } from './api';

/**
 * Analyze BMI data by sending it to the backend API
 * @param {Object} bmiData - User's BMI assessment data
 * @returns {Promise<Object>} - Analyzed BMI data from the server
 */
export const analyzeBMI = async (bmiData) => {
  try {
    const response = await apiClient.post('/bmi/analyze', bmiData);
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
    const response = await apiClient.get(`/bmi/results/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching BMI result:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch BMI result');
  }
};

/**
 * Get BMI history for the current user
 * @param {Function} getAccessTokenSilently - Auth0 token getter
 * @returns {Promise<Array>} - Array of BMI analysis results
 */
export const getBMIHistory = async (getAccessTokenSilently) => {
  try {
    const client = await createAuthenticatedClient(getAccessTokenSilently);
    const response = await client.get('/bmi/history');
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