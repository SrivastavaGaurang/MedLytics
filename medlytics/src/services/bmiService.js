// src/services/bmiService.js
import axios from 'axios';
import apiClient from './api';

// Submit BMI prediction data
export const analyzeBMI = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/bmi/analyze', formData);
        return response.data;
    } catch (error) {
        console.error('Error submitting BMI data:', error);
        throw error;
    }
};  

// Get BMI result by ID
export const getBMIResult = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/bmi/results/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching BMI result:', error);
    throw error;
  }
};

// Get BMI history - requires authentication token
export const getBMIHistory = async (getAccessTokenSilently) => {
  try {
    const client = await apiClient(getAccessTokenSilently);
    const response = await client.get('/bmi/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching BMI history:', error);
    throw error;
  }
};