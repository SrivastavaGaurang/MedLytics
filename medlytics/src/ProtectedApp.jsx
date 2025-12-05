// ProtectedApp.jsx
import React from 'react';
import { useAuth } from './contexts/useAuth';
import LoadingFallback from './components/LoadingFallback';

const ProtectedApp = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback message="Checking authentication..." />;
  }

  // If not authenticated, the App.jsx routes will handle showing Login
  // This component just shows loading state during auth check
  return children;
};

export default ProtectedApp;
