import { useState, useEffect, useCallback, useRef } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // Pixels to pull before refresh triggers
  resistance?: number; // Pull resistance (higher = harder to pull)
  enabled?: boolean;
}

interface PullToRefreshReturn {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  pullProgress: number; // 0 to 1
}

/**
 * Custom Hook for Pull-to-Refresh
 * 
 * Implements native-like pull-to-refresh behavior for mobile
 * 
 * @param options - Configuration options
 * @returns State and handlers for pull-to-refresh
 */
export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: PullToRefreshOptions): PullToRefreshReturn => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const scrollableElement = useRef<HTMLElement | null>(null);

  // Calculate pull progress (0 to 1)
  const pullProgress = Math.min(pullDistance / threshold, 1);

  // Check if element is at the top and can be pulled
  const canPull = useCallback(() => {
    if (!enabled || isRefreshing) return false;
    
    // Check if at top of page
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return scrollTop === 0;
  }, [enabled, isRefreshing]);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!canPull()) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    scrollableElement.current = document.documentElement;
  }, [canPull]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!canPull() || !startY.current) return;
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    // Only pull down (positive diff)
    if (diff > 0) {
      // Apply resistance
      const distance = diff / resistance;
      setPullDistance(distance);
      setIsPulling(true);
      
      // Prevent default scroll when pulling
      if (distance > 5) {
        e.preventDefault();
      }
    }
  }, [canPull, resistance]);

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    // Trigger refresh if pulled beyond threshold
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      
      // Add haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 50, 10]);
      }
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        // Smooth reset
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 300);
      }
    } else {
      // Animate back to 0
      setPullDistance(0);
    }
    
    startY.current = 0;
    currentY.current = 0;
  }, [isPulling, pullDistance, threshold, onRefresh]);

  // Add event listeners
  useEffect(() => {
    if (!enabled) return;

    const element = document.documentElement;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Reset distance when not pulling
  useEffect(() => {
    if (!isPulling && !isRefreshing && pullDistance > 0) {
      const animation = setInterval(() => {
        setPullDistance(prev => {
          const newDistance = prev - 5;
          if (newDistance <= 0) {
            clearInterval(animation);
            return 0;
          }
          return newDistance;
        });
      }, 16); // 60fps

      return () => clearInterval(animation);
    }
  }, [isPulling, isRefreshing, pullDistance]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress,
  };
};
