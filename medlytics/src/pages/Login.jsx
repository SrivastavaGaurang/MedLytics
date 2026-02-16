import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaHeartbeat } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            navigate(from, { replace: true });
        }

        setIsSubmitting(false);
    };

    return (
        <div className="login-page">
            <div className="login-background"></div>

            <div className="login-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="login-card"
                >
                    {/* Logo and Branding */}
                    <div className="login-header">
                        <div className="logo-badge">
                            <FaHeartbeat />
                        </div>
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to continue to MedLytics</p>
                    </div>

                    {/* Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="alert-error"
                        >
                            <strong>Error!</strong> {error}
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={onSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="your.email@example.com"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label className="form-label">Password</label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            className="btn-login"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt /> Sign In
                                </>
                            )}
                        </motion.button>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <div className="register-prompt">
                            <p>Don't have an account?</p>
                            <Link to="/register" className="register-link">
                                Create Account →
                            </Link>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="login-footer">
                        <p>© 2024 MedLytics. Your health, our priority.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
