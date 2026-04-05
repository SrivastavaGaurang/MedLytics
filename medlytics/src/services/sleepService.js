// services/sleepService.js — Express analysis + Firestore persistence
import apiClient from './api';
import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const COLLECTION = 'sleepAnalyses';

/**
 * Analyze sleep data via Express server, then save result to Firestore
 */
export const analyzeSleep = async (data) => {
  try {
    // 1. Get analysis result from Express
    const response = await apiClient.post('/sleep/analyze', data);
    const result = response.data;

    // 2. Save to Firestore under the user's sub-collection (if logged in)
    const user = auth.currentUser;
    if (user) {
      const docRef = await addDoc(
        collection(db, 'users', user.uid, COLLECTION),
        {
          ...data,
          result: result.result,
          createdAt: serverTimestamp(),
        }
      );
      return { ...result, id: docRef.id, _id: docRef.id };
    }

    return result;
  } catch (error) {
    console.error('Error in sleep analysis service:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze sleep data');
  }
};

/**
 * Fetch a single sleep result from Firestore by doc ID
 */
export const getSleepResult = async (id) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const snap = await getDoc(doc(db, 'users', user.uid, COLLECTION, id));
    if (!snap.exists()) throw new Error('Sleep result not found');
    return { id: snap.id, _id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('Error fetching sleep result:', error);
    throw new Error('Failed to fetch sleep result');
  }
};

/**
 * Fetch all sleep analysis history for the current user from Firestore
 */
export const getSleepHistory = async () => {
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
    console.error('Error fetching sleep history:', error);
    throw new Error('Failed to fetch sleep history');
  }
};

export default { analyzeSleep, getSleepResult, getSleepHistory };