import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  fullScreen = false,
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-ivory-50 flex items-center justify-center z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="relative inline-block mb-4">
          <div className={`${sizeClasses[size]} animate-spin text-ochre-500`}>
            <Loader2 className="w-full h-full" />
          </div>
          <Sparkles className="absolute top-0 right-0 w-4 h-4 text-gold-500 animate-pulse" />
        </div>
        
        {/* Loading Message */}
        <p className="text-chocolate-700 font-medium">{message}</p>
        <p className="text-chocolate-500 text-sm mt-2">Spreading GUD vibes...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
