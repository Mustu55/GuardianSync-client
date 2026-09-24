import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-cyber-bg">
          <div className="max-w-md w-full p-6 bg-cyber-card border border-red-500/30 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h1 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h1>
              <p className="text-gray-400 text-sm mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 text-xs text-gray-500">
                <summary className="cursor-pointer">Details</summary>
                <pre className="mt-2 overflow-auto max-h-40 bg-black/50 p-2 rounded">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
