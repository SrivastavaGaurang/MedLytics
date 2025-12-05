// src/components/results/SeverityGauge.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SeverityGauge = ({ score, maxScore = 100, label, severity, color }) => {
    const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

    const getColor = (sev) => {
        if (color) return color;
        switch (sev?.toLowerCase()) {
            case 'minimal': return '#198754'; // Success
            case 'mild': return '#0dcaf0';    // Info
            case 'moderate': return '#ffc107'; // Warning
            case 'severe': return '#dc3545';   // Danger
            case 'extreme': return '#dc3545';  // Danger
            default: return '#6c757d';         // Secondary
        }
    };

    const badgeColor = getColor(severity);

    return (
        <div className="severity-gauge-card">
            <h3 className="h5 text-muted mb-3">{label || 'Severity Level'}</h3>

            <div className="severity-badge" style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}>
                {severity || 'Unknown'}
            </div>

            <div className="gauge-container">
                <div className="gauge-track">
                    <motion.div
                        className="gauge-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ backgroundColor: badgeColor }}
                    />
                </div>

                <div className="gauge-labels">
                    <span>Minimal</span>
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                </div>
            </div>

            <p className="mt-3 mb-0 text-muted small">
                Score: <strong>{score}</strong> / {maxScore}
            </p>
        </div>
    );
};

export default SeverityGauge;
