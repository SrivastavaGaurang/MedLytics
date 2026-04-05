// src/services/api.js — Axios client for Express analysis endpoints only
// Auth is now handled by Firebase directly; this client only calls analysis routes.
import axios from 'axios';

export const getApiBaseUrl = () => {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      if (import.meta.env.DEV) return '/api';
      return 'http://localhost:5000/api';
    }
    return `${protocol}//${hostname}/api`;
  }

  return import.meta.env.DEV ? '/api' : 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry on network errors (up to 3 times with exponential backoff)
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= 3) {
        const delay = Math.pow(2, originalRequest._retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return apiClient(originalRequest);
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400: console.error('Bad Request:', data.message || 'Invalid request'); break;
        case 404: console.error('Not Found:', data.message || 'Resource not found'); break;
        case 429: console.error('Rate Limited:', data.message || 'Too many requests'); break;
        case 500:
        case 502:
        case 503: console.error('Server Error:', data.message || 'Internal server error'); break;
        default: console.error('API Error:', data.message || 'An error occurred');
      }
    } else if (error.request) {
      console.error('Network Error: Unable to connect to Express analysis server');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
