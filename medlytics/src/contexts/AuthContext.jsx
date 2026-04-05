// contexts/AuthContext.jsx — Firebase Auth
import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          _id: firebaseUser.uid,        // backwards-compat alias
          id: firebaseUser.uid,          // backwards-compat alias
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register with Firebase
  const register = async (name, email, password) => {
    try {
      setError(null);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name
      await updateProfile(firebaseUser, { displayName: name });

      // Refresh user object with display name
      setUser({
        uid: firebaseUser.uid,
        _id: firebaseUser.uid,
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const msg = mapFirebaseError(err.code);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Login with Firebase
  const login = async (email, password) => {
    try {
      setError(null);
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        uid: firebaseUser.uid,
        _id: firebaseUser.uid,
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const msg = mapFirebaseError(err.code);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        // token is no longer used, kept for compatibility
        token: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Map Firebase error codes to human-readable messages
function mapFirebaseError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}
