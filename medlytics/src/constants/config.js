// src/config.js
export const API_NOTIFICATION_MESSAGES = {
    loading: {
        title: 'Loading...',
        message: 'Data is being loaded, please wait.',
    },
    success: {
        title: 'Success',
        message: 'Data loaded successfully!',
    },
    responseFailure: {
        title: 'Error',
        message: 'An error occurred while processing your request.',
    },
    requestFailure: {
        title: 'Error',
        message: 'An error occurred while sending your request.',
    },
    networkError: {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
    },
};

export const SERVICE_URL = {
    userSignup: { url: '/api/signup', method: 'POST' },
    contact: { url: '/api/contact', method: 'POST' },
};

// Server URL
export const SERVER_URL = 'http://localhost:5000'; // Matching the port in your server.js file