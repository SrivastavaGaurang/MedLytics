// services/bmiService.js — Express analysis + Firestore persistence
import apiClient from './api';
import {
  collection, addDoc, getDocs, getDoc, doc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const COLLECTION = 'bmiAnalyses';

/**
 * Analyze BMI data via Express server, then save to Firestore
 */
export const analyzeBMI = async (bmiData) => {
  try {
    const response = await apiClient.post('/bmi/analyze', bmiData);
    const result = response.data;

    const user = auth.currentUser;
    if (user) {
      const docRef = await addDoc(
        collection(db, 'users', user.uid, COLLECTION),
        {
          ...bmiData,
          result: result.result,
          createdAt: serverTimestamp(),
        }
      );
      return { ...result, id: docRef.id, _id: docRef.id };
    }

    return result;
  } catch (error) {
    console.error('Error analyzing BMI data:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze BMI data');
  }
};

/**
 * Get a single BMI result from Firestore by doc ID
 */
export const getBMIResult = async (id) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const snap = await getDoc(doc(db, 'users', user.uid, COLLECTION, id));
    if (!snap.exists()) throw new Error('BMI result not found');
    return { id: snap.id, _id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('Error fetching BMI result:', error);
    throw new Error('Failed to fetch BMI result');
  }
};

/**
 * Get all BMI history for current user from Firestore
 */
export const getBMIHistory = async () => {
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
    console.error('Error fetching BMI history:', error);
    throw new Error('Failed to fetch BMI history');
  }
};

export default { analyzeBMI, getBMIResult, getBMIHistory };