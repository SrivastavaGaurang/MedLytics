// src/services/depressionService.js
import apiClient from './api';
import axios from 'axios';

// Submit depression analysis data - doesn't require token
export const analyzeDepression = async (formData) => {
    const response = await axios.post('http://localhost:5000/api/depression/predict', formData);
    return response.data;
};  

// Get depression result by ID - doesn't require token for now
export const getDepressionResult = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/depression/results/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching depression result:', error);
    throw error;
  }
};

// Get depression history - requires authentication token
export const getDepressionHistory = async (getAccessTokenSilently) => {
  try {
    const client = await apiClient(getAccessTokenSilently);
    const response = await client.get('/depression/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching depression history:', error);
    throw error;
  }
};