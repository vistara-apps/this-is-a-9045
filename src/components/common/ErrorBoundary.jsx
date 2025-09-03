import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
          <div className="glass-card rounded-lg max-w-md w-full p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-white/70 mb-6">
              We're sorry, but an error occurred while rendering this page.
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
              <p className="text-white/70 text-sm font-mono">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

