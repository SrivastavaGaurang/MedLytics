// services/anxietyService.js — Express analysis + Firestore persistence
import apiClient from './api';
import {
  collection, addDoc, getDocs, getDoc, doc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const COLLECTION = 'anxietyAnalyses';

/**
 * Analyze anxiety data via Express server, then save to Firestore
 */
export const analyzeAnxiety = async (anxietyData) => {
  try {
    const response = await apiClient.post('/anxiety/analyze', anxietyData);
    const result = response.data;

    const user = auth.currentUser;
    if (user) {
      const docRef = await addDoc(
        collection(db, 'users', user.uid, COLLECTION),
        {
          ...anxietyData,
          result: result.result,
          createdAt: serverTimestamp(),
        }
      );
      return { ...result, id: docRef.id, _id: docRef.id };
    }

    return result;
  } catch (error) {
    console.error('Error analyzing anxiety data:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze anxiety data');
  }
};

/**
 * Get a single anxiety result from Firestore by doc ID
 */
export const getAnxietyResult = async (id) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const snap = await getDoc(doc(db, 'users', user.uid, COLLECTION, id));
    if (!snap.exists()) throw new Error('Anxiety result not found');
    return { id: snap.id, _id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('Error fetching anxiety result:', error);
    throw new Error('Failed to fetch anxiety result');
  }
};

/**
 * Get all anxiety history for current user from Firestore
 */
export const getAnxietyHistory = async () => {
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
    console.error('Error fetching anxiety history:', error);
    throw new Error('Failed to fetch anxiety history');
  }
};

export default { analyzeAnxiety, getAnxietyResult, getAnxietyHistory };
