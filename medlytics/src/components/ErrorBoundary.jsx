// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card border-danger">
                                <div className="card-header bg-danger text-white">
                                    <h4 className="mb-0">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Something went wrong
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <p className="lead">We're sorry, but something unexpected happened.</p>
                                    <p className="text-muted">
                                        Please try refreshing the page or contact support if the problem persists.
                                    </p>

                                    {process.env.NODE_ENV !== 'production' && this.state.error && (
                                        <details className="mt-4">
                                            <summary className="text-danger fw-bold" style={{ cursor: 'pointer' }}>
                                                Error details (development only)
                                            </summary>
                                            <div className="mt-3 p-3 bg-light rounded">
                                                <p className="font-monospace text-danger mb-2">
                                                    {this.state.error.toString()}
                                                </p>
                                                {this.state.errorInfo && (
                                                    <pre className="small text-muted">{this.state.errorInfo.componentStack}</pre>
                                                )}
                                            </div>
                                        </details>
                                    )}

                                    <div className="mt-4">
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => window.location.reload()}
                                        >
                                            <i className="bi bi-arrow-clockwise me-1"></i>
                                            Refresh Page
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => window.location.href = '/'}
                                        >
                                            <i className="bi bi-house me-1"></i>
                                            Go to Home
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
