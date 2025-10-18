import React from 'react';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 rounded-full bg-status-error bg-opacity-10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={48} className="text-status-error" />
            </div>
            
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-text-secondary mb-8">
              We're sorry for the inconvenience. The error has been logged and we'll look into it.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-dark-bg-secondary border border-status-error rounded-lg p-4 mb-6 text-left">
                <p className="text-status-error text-sm font-mono overflow-auto">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button variant="primary" onClick={this.handleReset}>
                Go to Homepage
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;