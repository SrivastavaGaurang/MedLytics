// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import LoadingFallback from './LoadingFallback';

const PrivateRoute = ({ children, requiredRole = null }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <LoadingFallback message="Checking authentication..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
