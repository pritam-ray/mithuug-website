import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowDown, Check } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  pullProgress: number;
}

/**
 * Pull-to-Refresh Visual Indicator
 * 
 * Displays the refresh status and provides visual feedback
 * during pull-to-refresh interactions
 */
const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  isPulling,
  isRefreshing,
  pullDistance,
  pullProgress,
}) => {
  // Determine which icon and message to show
  const getContent = () => {
    if (isRefreshing) {
      return {
        icon: RefreshCw,
        message: 'Refreshing...',
        iconClass: 'animate-spin text-ochre',
      };
    }
    
    if (pullProgress >= 1) {
      return {
        icon: Check,
        message: 'Release to refresh',
        iconClass: 'text-green-500',
      };
    }
    
    return {
      icon: ArrowDown,
      message: 'Pull to refresh',
      iconClass: 'text-gray-400',
    };
  };

  const { icon: Icon, message, iconClass } = getContent();

  // Calculate opacity and scale based on pull progress
  const opacity = Math.min(pullProgress * 2, 1);
  const scale = 0.5 + (pullProgress * 0.5);
  const rotation = pullProgress * 180;

  return (
    <AnimatePresence>
      {(isPulling || isRefreshing) && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ 
            opacity: 1, 
            y: 0,
          }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-safe"
          style={{
            transform: `translateY(${Math.min(pullDistance, 100)}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg px-6 py-3 flex items-center gap-3 mt-4">
            {/* Icon with rotation and scale */}
            <motion.div
              animate={{
                scale: isRefreshing ? 1 : scale,
                rotate: isRefreshing ? 0 : rotation,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Icon 
                className={`w-5 h-5 ${iconClass}`}
                strokeWidth={2.5}
              />
            </motion.div>
            
            {/* Message */}
            <motion.span
              animate={{ opacity }}
              className="text-sm font-medium text-chocolate-900 dark:text-gray-100"
            >
              {message}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PullToRefreshIndicator;
