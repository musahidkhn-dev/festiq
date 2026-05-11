import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-white text-3xl font-bold mb-4 font-['Bebas_Neue'] tracking-wider">Something went wrong</h1>
          <p className="text-gray-400 max-w-md mb-8">
            An unexpected error occurred in the application. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
