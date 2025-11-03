import React from 'react';
import { motion } from 'framer-motion';

interface PageLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

/**
 * Page Loader Component
 * 
 * Shown during lazy-loaded route transitions
 * Features:
 * - Animated MitthuuG logo/brand element
 * - Smooth fade-in/out
 * - Optional full-screen or inline
 * - Configurable loading message
 */
const PageLoader: React.FC<PageLoaderProps> = ({ 
  fullScreen = true,
  message = 'Loading...'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col items-center justify-center ${
        fullScreen 
          ? 'fixed inset-0 z-50 bg-ivory' 
          : 'py-20'
      }`}
    >
      {/* Animated Logo/Brand */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="mb-6"
      >
        {/* MitthuuG Brand Circle */}
        <div className="relative w-20 h-20">
          {/* Outer spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-full border-4 border-ochre/20 border-t-ochre"
          />
          
          {/* Inner pulsing circle */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-3 rounded-full bg-gradient-to-br from-ochre to-gold flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-bold text-2xl font-playfair">M</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-stone-600 dark:text-stone-400 font-medium"
      >
        {message}
      </motion.p>

      {/* Loading Dots */}
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className="w-2 h-2 rounded-full bg-ochre"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PageLoader;

/**
 * Inline Content Loader
 * 
 * Smaller loader for content sections (not full page)
 */
export const ContentLoader: React.FC<{ message?: string }> = ({ message }) => (
  <PageLoader fullScreen={false} message={message} />
);

/**
 * Skeleton Loader for Cards
 * 
 * Product card skeleton during loading
 */
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-sm">
    {/* Image skeleton */}
    <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl mb-4 animate-shimmer bg-[length:200%_100%]" />
    
    {/* Title skeleton */}
    <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg mb-2 w-3/4 animate-shimmer bg-[length:200%_100%]" />
    
    {/* Price skeleton */}
    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg mb-4 w-1/2 animate-shimmer bg-[length:200%_100%]" />
    
    {/* Button skeleton */}
    <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl w-full animate-shimmer bg-[length:200%_100%]" />
  </div>
);

/**
 * List Skeleton Loader
 * 
 * For product grids
 */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
