// src/services/api.js
import axios from 'axios';

// Determine API base URL from environment or fallback
const getApiBaseUrl = () => {
  // Check Vite environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback logic based on current location
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;

    // If we're running on localhost, use localhost:5000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }

    // For production, construct the API URL
    return `${protocol}//${hostname}/api`;
  }

  // Final fallback
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Track pending requests to prevent duplicates
const pendingRequests = new Map();

/**
 * Generate a unique key for request deduplication
 */
const generateRequestKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
};

/**
 * Create axios instance with optimized configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * - Add auth token
 * - Implement request deduplication
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }

    // Request deduplication for GET requests
    if (config.method === 'get') {
      const requestKey = generateRequestKey(config);

      if (pendingRequests.has(requestKey)) {
        // Return existing pending request
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort('Duplicate request');
        return config;
      }

      // Track this request
      pendingRequests.set(requestKey, true);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handle common errors
 * - Implement retry logic
 * - Clear pending requests
 */
apiClient.interceptors.response.use(
  (response) => {
    // Clear from pending requests
    if (response.config.method === 'get') {
      const requestKey = generateRequestKey(response.config);
      pendingRequests.delete(requestKey);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Clear from pending requests
    if (originalRequest && originalRequest.method === 'get') {
      const requestKey = generateRequestKey(originalRequest);
      pendingRequests.delete(requestKey);
    }

    // Don't retry if request was aborted (duplicate)
    if (error.message === 'Duplicate request') {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Implement retry logic for network errors
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Retry up to 3 times with exponential backoff
      if (originalRequest._retryCount <= 3) {
        const delay = Math.pow(2, originalRequest._retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return apiClient(originalRequest);
      }
    }

    // Handle common error responses
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error('Bad Request:', data.message || 'Invalid request');
          break;
        case 403:
          console.error('Forbidden:', data.message || 'Access denied');
          break;
        case 404:
          console.error('Not Found:', data.message || 'Resource not found');
          break;
        case 429:
          console.error('Too Many Requests:', data.message || 'Rate limit exceeded');
          break;
        case 500:
        case 502:
        case 503:
          console.error('Server Error:', data.message || 'Internal server error');
          break;
        default:
          console.error('API Error:', data.message || 'An error occurred');
      }
    } else if (error.request) {
      console.error('Network Error: Unable to connect to server');
    } else {
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API client factory for Auth0 authenticated requests
 */
export const createAuthenticatedClient = async (getAccessTokenSilently) => {
  const token = await getAccessTokenSilently();

  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  });
};

export default apiClient;
export { API_BASE_URL };
