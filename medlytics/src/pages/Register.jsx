import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaHeartbeat } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const { register, error } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
            setPasswordError('');
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        const result = await register(name, email, password);

        if (result.success) {
            navigate('/dashboard');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="register-page">
            <div className="register-background"></div>

            <div className="register-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="register-card"
                >
                    {/* Logo and Branding */}
                    <div className="register-header">
                        <div className="logo-badge">
                            <FaHeartbeat />
                        </div>
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-subtitle">Join MedLytics for better health insights</p>
                    </div>

                    {/* Alert */}
                    {(error || passwordError) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="alert-error"
                        >
                            <strong>Error!</strong> {error || passwordError}
                        </motion.div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={onSubmit} className="register-form">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <FaUser />
                                </div>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="John Doe"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>

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
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Create a password (min 6 characters)"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    minLength="6"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                            <small className="input-hint">Minimum 6 characters required</small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            className="btn-register"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <FaUserPlus /> Create Account
                                </>
                            )}
                        </motion.button>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <div className="login-prompt">
                            <p>Already have an account?</p>
                            <Link to="/login" className="login-link">
                                Sign In →
                            </Link>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="register-footer">
                        <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
