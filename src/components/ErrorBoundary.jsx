import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="glass-panel p-8 max-w-lg w-full text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-text-main mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-text-secondary mb-6">
                            An unexpected error occurred. Don't worry, your data is safe.
                        </p>

                        {this.state.error && (
                            <details className="text-left mb-6 bg-surface-highlight rounded-lg p-4 border border-border">
                                <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-text-main">
                                    Error Details
                                </summary>
                                <pre className="mt-2 text-xs text-red-500 overflow-auto max-h-40 font-mono">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="glass-button flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                            <Link
                                to="/app"
                                onClick={this.handleReset}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Home size={16} />
                                Go to Library
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
