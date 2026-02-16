import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    // Check if user is logged in on mount
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/auth/me');
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Error loading user:', err);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
                delete axios.defaults.headers.common['Authorization'];
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return { success: false, error: err.response?.data?.message || 'Login failed' };
        }
    };

    // Register function
    const register = async (name, email, password) => {
        try {
            setError(null);
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });

            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            return { success: false, error: err.response?.data?.message || 'Registration failed' };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                error,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
