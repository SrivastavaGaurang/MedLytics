// src/services/depressionService.js
import apiClient from './api';
import axios from 'axios';

// Use window.location to determine the API base URL, or fallback to localhost
const getApiBaseUrl = () => {
    // Try to get from environment variable first
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    
    // Fallback logic based on current location
    if (typeof window !== 'undefined') {
        const { protocol, hostname } = window.location;
        
        // If we're running on localhost, use localhost:5000
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:5000';
        }
        
        // For production, construct the API URL
        return `${protocol}//${hostname}`;
    }
    
    // Final fallback
    return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

// Submit depression analysis data - doesn't require token
export const analyzeDepression = async (formData) => {
    try {
        console.log('Submitting depression analysis data:', formData);
        
        const response = await axios.post(`${API_BASE_URL}/api/depression/predict`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
        });
        
        console.log('Depression analysis response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error submitting depression analysis:', error);
        
        if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data?.message || 
                               error.response.data?.errors?.[0]?.msg || 
                               'Server error occurred';
            throw new Error(errorMessage);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Unable to connect to server. Please check your connection.');
        } else {
            // Something else happened
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};  

// Get depression result by ID - doesn't require token for now
export const getDepressionResult = async (id) => {
    try {
        console.log('Fetching depression result for ID:', id);
        
        if (!id) {
            throw new Error('Analysis ID is required');
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/depression/results/${id}`, {
            timeout: 15000, // 15 second timeout
        });
        
        console.log('Depression result response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching depression result:', error);
        
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Analysis results not found. The ID may be invalid or results may have expired.');
            } else {
                const errorMessage = error.response.data?.message || 'Server error occurred';
                throw new Error(errorMessage);
            }
        } else if (error.request) {
            throw new Error('Unable to connect to server. Please check your connection.');
        } else {
            throw new Error('An unexpected error occurred while fetching results.');
        }
    }
};

// Get depression history - requires authentication token
export const getDepressionHistory = async (getAccessTokenSilently) => {
    try {
        console.log('Fetching depression history...');
        
        const client = await apiClient(getAccessTokenSilently);
        const response = await client.get('/depression/history');
        
        console.log('Depression history response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching depression history:', error);
        
        if (error.response) {
            const errorMessage = error.response.data?.message || 'Server error occurred';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Unable to connect to server. Please check your connection.');
        } else {
            throw new Error('An unexpected error occurred while fetching depression history. Please try again later.');
        }
    }
};

// Delete depression analysis - requires authentication token
export const deleteDepressionAnalysis = async (id, getAccessTokenSilently) => {
    try {
        console.log('Deleting depression analysis with ID:', id);
        
        if (!id) {
            throw new Error('Analysis ID is required');
        }
        
        const client = await apiClient(getAccessTokenSilently);
        const response = await client.delete(`/depression/analysis/${id}`);
        
        console.log('Delete depression analysis response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting depression analysis:', error);
        
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Analysis not found or already deleted.');
            } else if (error.response.status === 403) {
                throw new Error('You do not have permission to delete this analysis.');
            } else {
                const errorMessage = error.response.data?.message || 'Server error occurred';
                throw new Error(errorMessage);
            }
        } else if (error.request) {
            throw new Error('Unable to connect to server. Please check your connection.');
        } else {
            throw new Error('An unexpected error occurred while deleting the analysis.');
        }
    }
};

// Update depression analysis - requires authentication token
export const updateDepressionAnalysis = async (id, formData, getAccessTokenSilently) => {
    try {
        console.log('Updating depression analysis with ID:', id, 'Data:', formData);
        
        if (!id) {
            throw new Error('Analysis ID is required');
        }
        
        const client = await apiClient(getAccessTokenSilently);
        const response = await client.put(`/depression/analysis/${id}`, formData);
        
        console.log('Update depression analysis response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating depression analysis:', error);
        
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Analysis not found.');
            } else if (error.response.status === 403) {
                throw new Error('You do not have permission to update this analysis.');
            } else {
                const errorMessage = error.response.data?.message || 
                                   error.response.data?.errors?.[0]?.msg || 
                                   'Server error occurred';
                throw new Error(errorMessage);
            }
        } else if (error.request) {
            throw new Error('Unable to connect to server. Please check your connection.');
        } else {
            throw new Error('An unexpected error occurred while updating the analysis.');
        }
    }
};

// Get user's depression statistics - requires authentication token
export const getDepressionStats = async (getAccessTokenSilently) => {
    try {
        console.log('Fetching depression statistics...');
        
        const client = await apiClient(getAccessTokenSilently);
        const response = await client.get('/depression/stats');
        
        console.log('Depression stats response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching depression stats:', error);
        
        if (error.response) {
            const errorMessage = error.response.data?.message || 'Server error occurred';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Unable to connect to server. Please check your connection.');
        } else {
            throw new Error('An unexpected error occurred while fetching statistics.');
        }
    }
};

// Export individual analysis to PDF - doesn't require token
export const exportDepressionAnalysisToPDF = async (id) => {
    try {
        console.log('Exporting depression analysis to PDF for ID:', id);
        
        if (!id) {
            throw new Error('Analysis ID is required');
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/depression/export/${id}`, {
            responseType: 'blob', // Important for file downloads
            timeout: 30000,
        });
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `depression-analysis-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        console.log('Depression analysis PDF exported successfully');
        return { success: true, message: 'PDF exported successfully' };
    } catch (error) {
        console.error('Error exporting depression analysis to PDF:', error);
        
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Analysis not found for PDF export.');
            } else {
                const errorMessage = error.response.data?.message || 'Server error occurred during export';
                throw new Error(errorMessage);
            }
        } else if (error.request) {
            throw new Error('Unable to connect to server for PDF export. Please check your connection.');
        } else {
            throw new Error('An unexpected error occurred during PDF export.');
        }
    }
};

// Share depression analysis results - generates shareable link
export const shareDepressionAnalysis = async (id) => {
    try {
        console.log('Creating shareable link for depression analysis ID:', id);
        
        if (!id) {
            throw new Error('Analysis ID is required');
        }
        
        const response = await axios.post(`${API_BASE_URL}/api/depression/share/${id}`, {}, {
            timeout: 15000,
        });
        
        console.log('Share depression analysis response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating shareable link:', error);
        
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Analysis not found for sharing.');
            } else {
                const errorMessage = error.response.data?.message || 'Server error occurred while creating share link';
                throw new Error(errorMessage);
            }
        } else if (error.request) {
            throw new Error('Unable to connect to server. Please check your connection.');
        } else {
            throw new Error('An unexpected error occurred while creating share link.');
        }
    }
};

// Validate depression form data before submission
export const validateDepressionFormData = (formData) => {
    const errors = [];
    
    // Check required fields
    if (!formData.age || formData.age < 13 || formData.age > 100) {
        errors.push('Age must be between 13 and 100');
    }
    
    if (!formData.gender || !['male', 'female', 'other'].includes(formData.gender)) {
        errors.push('Please select a valid gender');
    }
    
    if (!formData.maritalStatus || !['single', 'married', 'divorced', 'widowed'].includes(formData.maritalStatus)) {
        errors.push('Please select a valid marital status');
    }
    
    if (!formData.employmentStatus || !['employed', 'unemployed', 'student', 'retired'].includes(formData.employmentStatus)) {
        errors.push('Please select a valid employment status');
    }
    
    // Check numeric ranges
    if (formData.stressLevel < 1 || formData.stressLevel > 10) {
        errors.push('Stress level must be between 1 and 10');
    }
    
    if (formData.sleepQuality < 1 || formData.sleepQuality > 10) {
        errors.push('Sleep quality must be between 1 and 10');
    }
    
    if (formData.socialSupport < 1 || formData.socialSupport > 10) {
        errors.push('Social support must be between 1 and 10');
    }
    
    if (formData.physicalActivity < 0 || formData.physicalActivity > 100) {
        errors.push('Physical activity must be between 0 and 100 minutes per week');
    }
    
    if (formData.dietQuality < 1 || formData.dietQuality > 10) {
        errors.push('Diet quality must be between 1 and 10');
    }
    
    if (typeof formData.geneticHistory !== 'boolean') {
        errors.push('Genetic history must be specified');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Get depression assessment recommendations based on risk level
export const getDepressionRecommendations = (riskLevel) => {
    const recommendations = {
        low: [
            'Continue maintaining healthy lifestyle habits',
            'Stay connected with supportive friends and family',
            'Keep up regular physical activity and good sleep schedule',
            'Practice mindfulness or relaxation techniques',
            'Monitor your mental health regularly'
        ],
        moderate: [
            'Consider speaking with a healthcare provider about your mental health',
            'Increase social support and connection with others',
            'Prioritize stress management techniques',
            'Ensure adequate sleep (7-9 hours per night)',
            'Consider counseling or therapy as a preventive measure',
            'Limit alcohol and caffeine consumption'
        ],
        high: [
            'Seek immediate professional help from a mental health specialist',
            'Contact your doctor or a mental health crisis line if feeling unsafe',
            'Consider therapy options such as Cognitive Behavioral Therapy (CBT)',
            'Discuss medication options with a psychiatrist',
            'Build a strong support network of family and friends',
            'Avoid isolation and maintain social connections',
            'Focus on basic self-care: regular meals, sleep, and hygiene'
        ]
    };
    
    return recommendations[riskLevel] || recommendations.low;
};

// Emergency resources for high-risk situations
export const getEmergencyResources = () => {
    return {
        crisis: {
            phone: '988',
            name: 'National Suicide Prevention Lifeline',
            description: 'Free, confidential crisis support 24/7'
        },
        text: {
            number: '741741',
            keyword: 'HOME',
            name: 'Crisis Text Line',
            description: 'Text HOME to 741741 for crisis support'
        },
        emergency: {
            phone: '911',
            name: 'Emergency Services',
            description: 'For immediate life-threatening emergencies'
        },
        online: {
            url: 'https://suicidepreventionlifeline.org',
            name: 'Suicide Prevention Lifeline Website',
            description: 'Online resources and chat support'
        }
    };
};