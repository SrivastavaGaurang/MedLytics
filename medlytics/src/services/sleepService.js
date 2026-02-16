// src/services/sleepService.js
import apiClient from './api';

/**
 * Send sleep data to the server for analysis
 * 
 * @param {Object} data - Sleep form data
 * @returns {Promise<Object>} - Analysis result
 */
export const analyzeSleep = async (data) => {
  try {
    const response = await apiClient.post('/sleep/analyze', data);
    return response.data;
  } catch (error) {
    console.error('Error in sleep analysis service:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze sleep data');
  }
};

/**
 * Fetch sleep analysis result by ID
 * 
 * @param {string} id - Sleep analysis ID
 * @returns {Promise<Object>} - Sleep analysis result
 */
export const getSleepResult = async (id) => {
  try {
    const response = await apiClient.get(`/sleep/results/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sleep result:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sleep result');
  }
};

/**
 * Fetch sleep analysis history for current user
 * 
 * @param {Function} getAccessTokenSilently - Auth0 token getter
 * @returns {Promise<Array>} - Array of sleep analysis results
 */
export const getSleepHistory = async () => {
  try {
    // apiClient already includes auth token via interceptor
    const response = await apiClient.get('/sleep/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching sleep history:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sleep history');
  }
};

export default {
  analyzeSleep,
  getSleepResult,
  getSleepHistory
};