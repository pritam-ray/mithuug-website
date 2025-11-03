import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean; // Load immediately without lazy loading
  onLoad?: () => void;
  onError?: () => void;
  showLoadingSpinner?: boolean; // Show spinner during load
  blurAmount?: 'sm' | 'md' | 'lg'; // Blur intensity for placeholder
}

/**
 * Progressive Image Component
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Blur-up effect from tiny placeholder
 * - Smooth fade-in transition
 * - WebP support with fallback
 * - Loading skeleton
 * - Error handling with fallback
 * - Aspect ratio preservation
 */
const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  placeholder,
  className = '',
  aspectRatio = '1/1',
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError,
  showLoadingSpinner = true,
  blurAmount = 'lg',
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(placeholder || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Intersection Observer for lazy loading
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    skip: priority, // Skip lazy loading if priority
    rootMargin: '50px', // Start loading 50px before entering viewport
  });

  // Load the full image when in view or if priority
  useEffect(() => {
    if (!inView && !priority) return;

    const img = new Image();
    
    // Try WebP first, fallback to original
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Check if browser supports WebP
    const checkWebP = () => {
      const elem = document.createElement('canvas');
      if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    };

    const supportsWebP = checkWebP();
    const imageSrc = supportsWebP && webpSrc !== src ? webpSrc : src;

    img.src = imageSrc;
    
    img.onload = () => {
      setImgSrc(imageSrc);
      setLoading(false);
      setError(false);
      onLoad?.();
    };

    img.onerror = () => {
      // If WebP fails, try original format
      if (imageSrc === webpSrc) {
        img.src = src;
      } else {
        setError(true);
        setLoading(false);
        onError?.();
      }
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [inView, priority, src, onLoad, onError]);

  // Determine blur class based on prop
  const blurClass = 
    blurAmount === 'sm' ? 'blur-sm' :
    blurAmount === 'md' ? 'blur-md' :
    'blur-lg';

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
      style={{ aspectRatio }}
    >
      {/* Loading skeleton - only show if no placeholder */}
      {loading && !imgSrc && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Placeholder image with blur */}
      {placeholder && loading && (
        <img
          src={placeholder}
          alt={`${alt} placeholder`}
          className={`absolute inset-0 w-full h-full ${
            objectFit === 'cover' ? 'object-cover' :
            objectFit === 'contain' ? 'object-contain' :
            objectFit === 'fill' ? 'object-fill' :
            objectFit === 'none' ? 'object-none' :
            'object-scale-down'
          } ${blurClass} scale-110 opacity-70`}
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      {imgSrc && !error && (
        <img
          src={imgSrc}
          alt={alt}
          className={`relative w-full h-full transition-all duration-700 ease-out ${
            objectFit === 'cover' ? 'object-cover' :
            objectFit === 'contain' ? 'object-contain' :
            objectFit === 'fill' ? 'object-fill' :
            objectFit === 'none' ? 'object-none' :
            'object-scale-down'
          } ${
            loading
              ? `opacity-0 ${blurClass} scale-105`
              : 'opacity-100 blur-0 scale-100'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">Image unavailable</p>
        </div>
      )}

      {/* Loading spinner - only show if enabled and loading main image */}
      {loading && imgSrc && showLoadingSpinner && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 backdrop-blur-sm">
          <div className="w-8 h-8 border-3 border-ochre border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;

// Custom shimmer animation for skeleton
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .animate-shimmer {
    animation: shimmer 1.5s infinite;
  }
`;
document.head.appendChild(style);
