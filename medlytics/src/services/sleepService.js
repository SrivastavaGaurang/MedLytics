// src/services/sleepService.js
import apiClient from './api';
import axios from 'axios';

// Submit sleep analysis data - doesn't require token
export const analyzeSleep = async (formData) => {
  console.log('Submitting sleep analysis:', formData);
  const response = await axios.post('http://localhost:5000/api/sleep/analyze', formData);
  console.log('Server response:', response.data);
  return response.data;
};

// Get sleep result by ID - doesn't require token for now
export const getSleepResult = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/sleep/results/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sleep result:', error);
    throw error;
  }
};

// Get sleep history - requires authentication token
export const getSleepHistory = async (getAccessTokenSilently) => {
  try {
    const client = await apiClient(getAccessTokenSilently);
    const response = await client.get('/sleep/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching sleep history:', error);
    throw error;
  }
};