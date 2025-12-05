// contexts/AuthProvider.jsx
import { useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext';
import * as authService from '../services/authService';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = authService.getAuthToken();

                if (storedToken) {
                    setToken(storedToken);

                    // Validate token and fetch user data
                    const userData = await authService.getCurrentUser(storedToken);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                // Clear invalid token
                authService.removeAuthToken();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = useCallback(async (credentials, loginMethod = 'email') => {
        try {
            const response = loginMethod === 'email'
                ? await authService.loginWithEmail(credentials)
                : await authService.loginWithPhone(credentials);

            const { token: newToken, user: userData } = response;

            authService.setAuthToken(newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true, user: userData };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.errors?.[0]?.msg || error.response?.data?.msg || 'Login failed'
            };
        }
    }, []);

    // Register function
    const register = useCallback(async (userData) => {
        try {
            const response = await authService.registerUser(userData);
            const { token: newToken, user: newUser } = response;

            authService.setAuthToken(newToken);
            setToken(newToken);
            setUser(newUser);

            return { success: true, user: newUser };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.errors?.[0]?.msg || error.response?.data?.msg || 'Registration failed'
            };
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        authService.removeAuthToken();
        setToken(null);
        setUser(null);
    }, []);

    // Update user function
    const updateUser = useCallback((updatedUser) => {
        setUser(updatedUser);
    }, []);

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
