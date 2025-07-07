"use client";

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return React.createElement(FallbackComponent, {
        error: this.state.error,
        resetError: this.resetError
      });
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error: _error, resetError }: ErrorFallbackProps) {
  return React.createElement('div', {
    className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  },
    React.createElement('div', {
      className: "max-w-md w-full mx-auto p-6"
    },
      React.createElement('div', {
        className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
      },
        React.createElement('div', {
          className: "w-16 h-16 mx-auto mb-4 text-red-500"
        },
          React.createElement('svg', {
            className: "w-full h-full",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          },
            React.createElement('path', {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            })
          )
        ),
        React.createElement('h2', {
          className: "text-xl font-semibold text-gray-900 dark:text-white mb-2"
        }, "Something went wrong"),
        React.createElement('p', {
          className: "text-gray-600 dark:text-gray-400 mb-4"
        }, "We're sorry, but something unexpected happened."),
        React.createElement('button', {
          onClick: resetError,
          className: "inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        }, "Try again")
      )
    )
  );
}

export { ErrorBoundary, DefaultErrorFallback };
export default ErrorBoundary;
