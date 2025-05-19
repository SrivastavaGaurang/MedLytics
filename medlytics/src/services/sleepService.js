// src/services/sleepService.js
import axios from 'axios';
import { SERVER_URL } from '../constants/config';

const API_URL = SERVER_URL || 'http://localhost:5000';

export const analyzeSleep = async (formData) => {
  try {
    console.log('Submitting sleep analysis to:', `${API_URL}/api/sleep/analyze`);
    console.log('Payload:', formData);
    const response = await axios.post(`${API_URL}/api/sleep/analyze`, formData);
    console.log('Analyze response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting sleep analysis:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Failed to analyze sleep data');
  }
};

export const getSleepResult = async (id) => {
  try {
    console.log('Fetching sleep result:', `${API_URL}/api/sleep/results/${id}`);
    const response = await axios.get(`${API_URL}/api/sleep/results/${id}`);
    console.log('Result response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching sleep result:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch sleep result');
  }
};

export const getSleepHistory = async (getAccessTokenSilently) => {
  try {
    console.log('Attempting to fetch access token');
    const token = await getAccessTokenSilently();
    console.log('Access token retrieved successfully');
    console.log('Fetching sleep history from:', `${API_URL}/api/sleep/history`);
    const response = await axios.get(`${API_URL}/api/sleep/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('History response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching sleep history:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error; // Preserve original error for status code handling
  }
};