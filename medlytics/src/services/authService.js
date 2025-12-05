// services/authService.js
import apiClient from './api';

const TOKEN_KEY = 'authToken';

/**
 * Get auth token from localStorage
 */
export const getAuthToken = () => {
    return localStorage.getItem(TOKEN_KEY) || '';
};

/**
 * Set auth token in localStorage
 */
export const setAuthToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Response with token and user data
 */
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Login with email
 * @param {Object} credentials - Email and password
 * @returns {Promise} Response with token and user data
 */
export const loginWithEmail = async ({ email, password }) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Login with phone
 * @param {Object} credentials - Phone and password
 * @returns {Promise} Response with token and user data
 */
export const loginWithPhone = async ({ phone, password }) => {
    try {
        const response = await apiClient.post('/auth/login/phone', { phone, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get current user data
 * @param {string} token - Auth token
 * @returns {Promise} User data
 */
export const getCurrentUser = async (token) => {
    try {
        const response = await apiClient.get('/auth/user', {
            headers: {
                'x-auth-token': token
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} Response
 */
export const forgotPassword = async (email) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Reset password with token
 * @param {string} resetToken - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise} Response
 */
export const resetPassword = async (resetToken, newPassword) => {
    try {
        const response = await apiClient.put(`/auth/reset-password/${resetToken}`, {
            password: newPassword
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Logout user
 */
export const logout = () => {
    removeAuthToken();
};
