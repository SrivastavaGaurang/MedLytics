// src/components/results/RecommendationList.jsx
import React from 'react';
import { motion } from 'framer-motion';

const RecommendationList = ({ items, title = "Personalized Recommendations" }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="recommendations-section mt-4">
            <h3 className="h4 mb-4">
                <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                {title}
            </h3>

            <div className="recommendation-list">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className="recommendation-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <div className="rec-number">{index + 1}</div>
                        <div className="rec-content">
                            <p className="mb-0">{item}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationList;
