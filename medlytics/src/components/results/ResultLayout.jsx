// src/components/results/ResultLayout.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ResultStyles.css';

const ResultLayout = ({
    title,
    date,
    children,
    onPrint,
    onRetake,
    retakePath,
    loading = false,
    error = null
}) => {
    if (loading) {
        return (
            <div className="result-loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Analyzing your health data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="result-error-container">
                <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-3 fs-3"></i>
                    <div>
                        <h4 className="alert-heading">Unable to Load Results</h4>
                        <p className="mb-0">{error}</p>
                    </div>
                </div>
                <Link to={retakePath || '/dashboard'} className="btn btn-outline-primary mt-3">
                    <i className="bi bi-arrow-left me-2"></i> Return to Assessment
                </Link>
            </div>
        );
    }

    return (
        <div className="result-page-wrapper">
            <motion.div
                className="result-header-section"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h1 className="result-title">{title}</h1>
                            <p className="result-date text-muted">
                                <i className="bi bi-calendar3 me-2"></i>
                                {new Date(date || Date.now()).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="result-actions d-print-none">
                            <button onClick={onPrint || (() => window.print())} className="btn btn-outline-secondary me-2">
                                <i className="bi bi-printer me-2"></i> Print
                            </button>
                            <Link to="/dashboard" className="btn btn-primary">
                                <i className="bi bi-speedometer2 me-2"></i> Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="container py-4">
                {children}
            </div>

            <div className="container pb-5 d-print-none">
                <div className="d-flex justify-content-center gap-3">
                    {onRetake && (
                        <button onClick={onRetake} className="btn btn-outline-primary">
                            <i className="bi bi-arrow-repeat me-2"></i> Retake Assessment
                        </button>
                    )}
                    {retakePath && !onRetake && (
                        <Link to={retakePath} className="btn btn-outline-primary">
                            <i className="bi bi-arrow-repeat me-2"></i> Retake Assessment
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultLayout;
