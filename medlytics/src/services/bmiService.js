// src/services/bmiService.js
import axios from 'axios';
import apiClient from './api';

// Submit BMI prediction data
export const analyzeBMI = async (formData, token) => {
    try {
        const response = await axios.post('http://localhost:5000/api/bmi/analyze', formData, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting BMI data:', error);
        throw error;
    }
};  

// Get BMI result by ID
export const getBMIResult = async (id, token) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/bmi/results/${id}`, {
      headers: {
        'x-auth-token': token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching BMI result:', error);
    throw error;
  }
};

// Get BMI history - requires authentication token
export const getBMIHistory = async (token) => {
  try {
    const response = await axios.get('http://localhost:5000/api/bmi/history', {
      headers: {
        'x-auth-token': token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching BMI history:', error);
    throw error;
  }
};