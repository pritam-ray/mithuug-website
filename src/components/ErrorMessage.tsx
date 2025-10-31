import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Oops! Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  onRetry,
  showHomeButton = true,
  fullScreen = false
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-ivory-50 flex items-center justify-center z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="max-w-md mx-auto px-4 text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-3">
          {title}
        </h2>

        {/* Error Message */}
        <p className="text-chocolate-600 mb-8">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-6 py-3 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          )}
          
          {showHomeButton && (
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 border-2 border-ochre-300 text-ochre-700 px-6 py-3 rounded-full hover:bg-ochre-50 transition-all font-bold"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
          )}
        </div>

        {/* Support Message */}
        <p className="text-sm text-chocolate-500 mt-8">
          If the problem persists, please{' '}
          <Link to="/contact" className="text-ochre-600 hover:text-ochre-700 underline">
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
