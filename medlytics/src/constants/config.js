export const API_NOTIFICATION_MESSAGES = {
    loading: {
        title: 'Loading...',
        message: 'Data is being loaded, please wait.',
    },
    success: {
        title: 'Success',
        message: 'Data loaded successfully!',
    },
    responseFailure: { // Fixed typo from 'resposeFailure'
        title: 'Error',
        message: 'An error occurred while processing your request.',
    },
    requestFailure: { // Fixed typo from 'requsestFailure'
        title: 'Error',
        message: 'An error occurred while sending your request.',
    },
    networkError: {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
    },
};

export const SERVICE_URL = {
    userSignup: { url: '/api/signup', method: 'POST' }, // Fixed duplicate key
};

// Add SERVER_URL
export const SERVER_URL = 'http://localhost:8000'; // Replace with your server's base URL