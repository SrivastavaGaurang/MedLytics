// src/components/SkeletonLoader.jsx
import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const renderCardSkeleton = () => (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <div className="placeholder-glow">
                    <div className="placeholder col-6 mb-3" style={{ height: '24px' }}></div>
                    <div className="placeholder col-12 mb-2" style={{ height: '16px' }}></div>
                    <div className="placeholder col-12 mb-2" style={{ height: '16px' }}></div>
                    <div className="placeholder col-8" style={{ height: '16px' }}></div>
                </div>
            </div>
        </div>
    );

    const renderStatSkeleton = () => (
        <div className="col-md-3 col-6">
            <div className="card shadow-sm h-100">
                <div className="card-body">
                    <div className="placeholder-glow">
                        <div className="placeholder col-12 mb-2" style={{ height: '20px' }}></div>
                        <div className="placeholder col-8" style={{ height: '32px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderChartSkeleton = () => (
        <div className="card shadow-sm mb-4">
            <div className="card-body" style={{ height: '400px' }}>
                <div className="placeholder-glow d-flex align-items-end h-100 gap-2">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="placeholder"
                            style={{
                                width: 'calc(12.5% - 8px)',
                                height: `${Math.random() * 60 + 40}%`,
                                backgroundColor: '#e9ecef',
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderListSkeleton = () => (
        <div className="list-group-item">
            <div className="placeholder-glow">
                <div className="d-flex justify-content-between align-items-center">
                    <div style={{ width: '70%' }}>
                        <div className="placeholder col-8 mb-2" style={{ height: '18px' }}></div>
                        <div className="placeholder col-6" style={{ height: '14px' }}></div>
                    </div>
                    <div className="placeholder col-2" style={{ height: '30px' }}></div>
                </div>
            </div>
        </div>
    );

    const skeletonTypes = {
        card: renderCardSkeleton,
        stat: renderStatSkeleton,
        chart: renderChartSkeleton,
        list: renderListSkeleton,
    };

    const renderSkeleton = skeletonTypes[type] || renderCardSkeleton;

    return (
        <>
            {[...Array(count)].map((_, index) => (
                <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
            ))}
        </>
    );
};

export default SkeletonLoader;
