// src/components/results/InsightCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const InsightCard = ({ title, value, impact, icon, description, delay = 0 }) => {
    const getImpactColor = (imp) => {
        switch (imp?.toLowerCase()) {
            case 'high': return { bg: '#dc3545', light: '#ffe6e6' };
            case 'moderate': return { bg: '#ffc107', light: '#fff3cd' };
            case 'low': return { bg: '#198754', light: '#d1e7dd' };
            default: return { bg: '#6c757d', light: '#f8f9fa' };
        }
    };

    const colors = getImpactColor(impact);

    return (
        <motion.div
            className={`insight-card impact-${impact?.toLowerCase() || 'neutral'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="insight-header">
                <div className="insight-icon" style={{ backgroundColor: colors.light, color: colors.bg }}>
                    <i className={`bi ${icon || 'bi-activity'}`}></i>
                </div>
                <div className="flex-grow-1">
                    <h5 className="mb-0">{title}</h5>
                    {impact && (
                        <span className="badge rounded-pill mt-1" style={{ backgroundColor: colors.bg }}>
                            {impact} Impact
                        </span>
                    )}
                </div>
            </div>

            {value && <h4 className="fw-bold mb-2">{value}</h4>}
            {description && <p className="text-muted mb-0 small">{description}</p>}
        </motion.div>
    );
};

export default InsightCard;
