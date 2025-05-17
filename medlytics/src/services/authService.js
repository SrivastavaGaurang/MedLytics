import { getAuthToken } from './services/authService';

// filepath: c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\services\authService.js

export const getAuthToken = () => {
    // Example logic to retrieve the authentication token
    // Replace this with your actual implementation
    return localStorage.getItem('authToken') || '';
};
