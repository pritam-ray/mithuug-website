import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info, Loader2 } from 'lucide-react';

/**
 * Mobile Microinteractions Library
 * 
 * Premium interaction patterns for mobile UX:
 * - Button ripple effects
 * - Success/error animations
 * - Loading states
 * - Toast notifications
 * - Haptic feedback helpers
 */

// ============================================
// 1. BUTTON RIPPLE EFFECT
// ============================================

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  haptic?: boolean;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  haptic = true,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    // Haptic feedback
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Call original onClick
    onClick?.(event);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  const baseClasses = 'relative overflow-hidden font-semibold rounded-xl transition-all duration-200 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-ochre text-white hover:bg-ochre-600 disabled:bg-stone-300',
    secondary: 'bg-stone-700 text-white hover:bg-stone-800 disabled:bg-stone-300',
    outline: 'border-2 border-ochre text-ochre hover:bg-ochre hover:text-white disabled:border-stone-300 disabled:text-stone-300',
    ghost: 'text-ochre hover:bg-ochre/10 disabled:text-stone-300',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={addRipple}
      disabled={disabled}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
    </button>
  );
};

// ============================================
// 2. SUCCESS ANIMATION
// ============================================

interface SuccessAnimationProps {
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  message = 'Success!',
  onComplete,
  duration = 2000,
}) => {
  useEffect(() => {
    // Haptic feedback pattern: short-long-short
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-stone-800 rounded-3xl p-8 shadow-2xl max-w-sm mx-4">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-lg font-semibold text-stone-900 dark:text-white"
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};

// ============================================
// 3. LOADING BUTTON
// ============================================

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  loadingText,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'relative font-semibold rounded-xl transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-ochre text-white hover:bg-ochre-600 disabled:bg-stone-300',
    secondary: 'bg-stone-700 text-white hover:bg-stone-800 disabled:bg-stone-300',
    outline: 'border-2 border-ochre text-ochre hover:bg-ochre hover:text-white disabled:border-stone-300',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm touch-target',
    md: 'px-6 py-3 text-base touch-target',
    lg: 'px-8 py-4 text-lg touch-target-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </span>
      )}
    </button>
  );
};

// ============================================
// 4. MOBILE TOAST NOTIFICATION
// ============================================

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface MobileToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const MobileToast: React.FC<MobileToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      // Haptic feedback
      if ('vibrate' in navigator) {
        const pattern = type === 'error' ? [50, 50, 50] : [30];
        navigator.vibrate(pattern);
      }

      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, type]);

  const icons = {
    success: <Check className="w-6 h-6" />,
    error: <X className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
    warning: <AlertCircle className="w-6 h-6" />,
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-amber-500 text-white',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`fixed top-safe left-4 right-4 z-50 ${colors[type]} rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-md mx-auto`}
        >
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <p className="flex-1 font-medium">{message}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// 5. HAPTIC FEEDBACK HELPER
// ============================================

export const haptic = {
  /**
   * Light tap (10ms)
   * Use for: Button taps, selections
   */
  light: () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
  },

  /**
   * Medium tap (25ms)
   * Use for: Toggle switches, important actions
   */
  medium: () => {
    if ('vibrate' in navigator) navigator.vibrate(25);
  },

  /**
   * Heavy tap (50ms)
   * Use for: Confirmations, errors
   */
  heavy: () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
  },

  /**
   * Success pattern (short-pause-short)
   * Use for: Successful operations
   */
  success: () => {
    if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
  },

  /**
   * Error pattern (long-long)
   * Use for: Errors, warnings
   */
  error: () => {
    if ('vibrate' in navigator) navigator.vibrate([50, 100, 50]);
  },

  /**
   * Notification pattern (short bursts)
   * Use for: New messages, updates
   */
  notification: () => {
    if ('vibrate' in navigator) navigator.vibrate([25, 50, 25, 50, 25]);
  },
};

// ============================================
// 6. INLINE SPINNER
// ============================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'text-ochre' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={`${sizeClasses[size]} ${color} animate-spin`} />
  );
};

// ============================================
// 7. SKELETON PULSE
// ============================================

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg ${className}`}
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      ))}
    </>
  );
};

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example: Ripple Button
 * 
 * <RippleButton variant="primary" size="lg" onClick={handleClick}>
 *   Add to Cart
 * </RippleButton>
 */

/**
 * Example: Loading Button
 * 
 * <LoadingButton loading={isSubmitting} loadingText="Submitting...">
 *   Submit Order
 * </LoadingButton>
 */

/**
 * Example: Success Animation
 * 
 * {showSuccess && (
 *   <SuccessAnimation 
 *     message="Added to cart!" 
 *     onComplete={() => setShowSuccess(false)}
 *   />
 * )}
 */

/**
 * Example: Mobile Toast
 * 
 * <MobileToast
 *   type="success"
 *   message="Product added to wishlist"
 *   isVisible={showToast}
 *   onClose={() => setShowToast(false)}
 * />
 */

/**
 * Example: Haptic Feedback
 * 
 * import { haptic } from './MobileInteractions';
 * 
 * const handleDelete = () => {
 *   haptic.heavy();
 *   deleteItem();
 * };
 */
