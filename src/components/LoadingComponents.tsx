import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-ochre border-t-transparent rounded-full animate-spin`}
      />
      {text && (
        <p className="text-chocolate-600 dark:text-gray-400 text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <SkeletonLoader className="h-64 w-full" />
      <div className="p-6 space-y-3">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-4">
          <SkeletonLoader className="h-6 w-20" />
          <SkeletonLoader className="h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <SkeletonLoader key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ochre-50 to-olive-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Outer rotating circle */}
          <div className="w-24 h-24 border-4 border-ochre/30 rounded-full animate-spin" />
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-ochre rounded-full animate-pulse opacity-50" />
          </div>
          
          {/* Center logo or icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-chocolate rounded-full" />
          </div>
        </div>
        
        <p className="mt-6 text-chocolate-600 dark:text-gray-300 text-lg font-playfair font-semibold">
          {text}
        </p>
        
        {/* Loading dots animation */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-ochre rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-ochre rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-ochre rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export const InlineLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="w-6 h-6 border-3 border-ochre border-t-transparent rounded-full animate-spin" />
      <span className="text-chocolate-600 dark:text-gray-400 font-medium">{text}</span>
    </div>
  );
};

export const ButtonLoader: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Processing...</span>
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen pt-4 bg-ivory animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <SkeletonLoader className="h-4 w-12" />
          <span className="text-gray-300">/</span>
          <SkeletonLoader className="h-4 w-16" />
          <span className="text-gray-300">/</span>
          <SkeletonLoader className="h-4 w-32" />
        </div>

        {/* Detail Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery Skeleton */}
          <div className="space-y-4">
            <SkeletonLoader className="w-full aspect-square rounded-2xl" />
            <div className="flex gap-4">
              <SkeletonLoader className="w-20 h-20 rounded-xl" />
              <SkeletonLoader className="w-20 h-20 rounded-xl" />
              <SkeletonLoader className="w-20 h-20 rounded-xl" />
            </div>
          </div>

          {/* Right Column: Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <SkeletonLoader className="h-10 w-3/4 rounded-xl" />
              <SkeletonLoader className="h-6 w-1/3 rounded-lg" />
            </div>
            
            <div className="flex items-center gap-4">
              <SkeletonLoader className="h-8 w-24 rounded-lg" />
              <SkeletonLoader className="h-5 w-32 rounded-md" />
            </div>

            <SkeletonLoader className="h-20 w-full rounded-xl" />

            <div className="space-y-4 pt-4 border-t border-ochre-100">
              <div className="flex items-center gap-4">
                <SkeletonLoader className="h-12 w-28 rounded-xl" />
                <SkeletonLoader className="h-12 flex-1 rounded-xl" />
              </div>
              <SkeletonLoader className="h-12 w-full rounded-xl" />
            </div>

            {/* Accordion Skeletons */}
            <div className="space-y-3 pt-6 border-t border-ochre-100">
              <SkeletonLoader className="h-14 w-full rounded-xl" />
              <SkeletonLoader className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen pt-4 bg-stone-50 dark:bg-gray-900 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-2">
          <SkeletonLoader className="h-10 w-48 rounded-lg" />
          <SkeletonLoader className="h-5 w-32 rounded" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 shadow-sm">
              <SkeletonLoader className="h-10 w-full rounded-lg" />
              <SkeletonLoader className="h-10 w-full rounded-lg" />
              <SkeletonLoader className="h-10 w-full rounded-lg" />
              <SkeletonLoader className="h-10 w-full rounded-lg" />
              <SkeletonLoader className="h-10 w-full rounded-lg" />
            </div>
          </aside>

          {/* Main Pane Skeletons */}
          <main className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm space-y-4">
              <SkeletonLoader className="h-7 w-48 rounded-lg" />
              <div className="space-y-3">
                <SkeletonLoader className="h-5 w-1/3 rounded" />
                <SkeletonLoader className="h-5 w-1/2 rounded" />
                <SkeletonLoader className="h-5 w-1/4 rounded" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm space-y-4">
              <SkeletonLoader className="h-7 w-48 rounded-lg" />
              <div className="space-y-3">
                <SkeletonLoader className="h-14 w-full rounded-lg" />
                <SkeletonLoader className="h-14 w-full rounded-lg" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
