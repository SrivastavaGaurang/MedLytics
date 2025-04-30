// ProtectedApp.jsx or .tsx if you're using TypeScript
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedApp = ({ children }) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>; // You can replace this with a spinner or splash screen
  }

  return children;
};

export default ProtectedApp;
