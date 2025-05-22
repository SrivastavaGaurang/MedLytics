// src/services/sleepService.js
import axios from 'axios';
import { SERVER_URL } from '../constants/config';

/**
 * Send sleep data to the server for analysis
 * 
 * @param {Object} data - Sleep form data
 * @returns {Promise<Object>} - Analysis result
 */
export const analyzeSleep = async (data) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/sleep/analyze`, data);
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
    const response = await axios.get(`${SERVER_URL}/api/sleep/results/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sleep result:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sleep result');
  }
};

/**
 * Fetch sleep analysis history for current user
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - Array of sleep analysis results
 */
export const getSleepHistory = async (token) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/sleep/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
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