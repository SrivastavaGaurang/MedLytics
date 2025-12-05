// src/components/results/DisclaimerSection.jsx
import React from 'react';

const DisclaimerSection = () => {
    return (
        <div className="mt-5 pt-4 border-top">
            <div className="alert alert-light border shadow-sm">
                <div className="d-flex">
                    <i className="bi bi-info-circle-fill text-muted fs-4 me-3"></i>
                    <div>
                        <h5 className="h6 fw-bold text-muted text-uppercase mb-2">Medical Disclaimer</h5>
                        <p className="mb-0 small text-muted">
                            This assessment is for informational and educational purposes only. It is not intended to be a substitute
                            for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or
                            other qualified health provider with any questions you may have regarding a medical condition.
                            If you think you may have a medical emergency, call your doctor or emergency services immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerSection;
