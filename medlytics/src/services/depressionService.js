// services/depressionService.js — Express analysis + Firestore persistence
import apiClient from './api';
import {
  collection, addDoc, getDocs, getDoc, doc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const COLLECTION = 'depressionAnalyses';

/**
 * Submit depression analysis via Express, save result to Firestore
 */
export const analyzeDepression = async (formData) => {
  try {
    const response = await apiClient.post('/depression/predict', formData);
    const result = response.data;

    const user = auth.currentUser;
    if (user) {
      const docRef = await addDoc(
        collection(db, 'users', user.uid, COLLECTION),
        {
          ...formData,
          result: result.result,
          createdAt: serverTimestamp(),
        }
      );
      return { ...result, id: docRef.id, _id: docRef.id };
    }

    return result;
  } catch (error) {
    console.error('Error submitting depression analysis:', error);
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.errors?.[0]?.msg ||
        'Server error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

/**
 * Get a single depression result from Firestore by doc ID
 */
export const getDepressionResult = async (id) => {
  try {
    if (!id) throw new Error('Analysis ID is required');
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const snap = await getDoc(doc(db, 'users', user.uid, COLLECTION, id));
    if (!snap.exists()) throw new Error('Analysis results not found. The ID may be invalid.');
    return { id: snap.id, _id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('Error fetching depression result:', error);
    throw error;
  }
};

/**
 * Get all depression history for current user from Firestore
 */
export const getDepressionHistory = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, 'users', user.uid, COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching depression history:', error);
    throw new Error('Failed to fetch depression history');
  }
};

/**
 * Delete a depression analysis record
 */
export const deleteDepressionAnalysis = async (id) => {
  try {
    if (!id) throw new Error('Analysis ID is required');
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'users', user.uid, COLLECTION, id));
    return { message: 'Analysis deleted successfully' };
  } catch (error) {
    console.error('Error deleting depression analysis:', error);
    throw error;
  }
};

// ─── Utility functions (kept from original) ───────────────────────────────

export const validateDepressionFormData = (formData) => {
  const errors = [];
  if (!formData.age || formData.age < 13 || formData.age > 100)
    errors.push('Age must be between 13 and 100');
  if (!formData.gender || !['male', 'female', 'other'].includes(formData.gender))
    errors.push('Please select a valid gender');
  if (!formData.maritalStatus || !['single', 'married', 'divorced', 'widowed'].includes(formData.maritalStatus))
    errors.push('Please select a valid marital status');
  if (!formData.employmentStatus || !['employed', 'unemployed', 'student', 'retired'].includes(formData.employmentStatus))
    errors.push('Please select a valid employment status');
  if (formData.stressLevel < 1 || formData.stressLevel > 10)
    errors.push('Stress level must be between 1 and 10');
  if (formData.sleepQuality < 1 || formData.sleepQuality > 10)
    errors.push('Sleep quality must be between 1 and 10');
  if (formData.socialSupport < 1 || formData.socialSupport > 10)
    errors.push('Social support must be between 1 and 10');
  if (formData.physicalActivity < 0 || formData.physicalActivity > 100)
    errors.push('Physical activity must be between 0 and 100');
  if (formData.dietQuality < 1 || formData.dietQuality > 10)
    errors.push('Diet quality must be between 1 and 10');
  if (typeof formData.geneticHistory !== 'boolean')
    errors.push('Genetic history must be specified');
  return { isValid: errors.length === 0, errors };
};

export const getDepressionRecommendations = (riskLevel) => {
  const recommendations = {
    low: [
      'Continue maintaining healthy lifestyle habits',
      'Stay connected with supportive friends and family',
      'Keep up regular physical activity and good sleep schedule',
      'Practice mindfulness or relaxation techniques',
    ],
    moderate: [
      'Consider speaking with a healthcare provider about your mental health',
      'Increase social support and connection with others',
      'Prioritize stress management techniques',
      'Ensure adequate sleep (7-9 hours per night)',
    ],
    high: [
      'Seek immediate professional help from a mental health specialist',
      'Contact your doctor or a mental health crisis line if feeling unsafe',
      'Consider therapy options such as Cognitive Behavioral Therapy (CBT)',
      'Build a strong support network of family and friends',
    ],
  };
  return recommendations[riskLevel] || recommendations.low;
};

export const getEmergencyResources = () => ({
  crisis: { phone: '988', name: 'National Suicide Prevention Lifeline', description: 'Free, confidential crisis support 24/7' },
  text: { number: '741741', keyword: 'HOME', name: 'Crisis Text Line', description: 'Text HOME to 741741 for crisis support' },
  emergency: { phone: '911', name: 'Emergency Services', description: 'For immediate life-threatening emergencies' },
  online: { url: 'https://suicidepreventionlifeline.org', name: 'Suicide Prevention Lifeline Website', description: 'Online resources and chat support' },
});