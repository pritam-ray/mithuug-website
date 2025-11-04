import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Zap } from 'lucide-react';
import { Product } from '../../types/database';
import { useCart } from '../../context/CartContext';

interface StickyAddToCartProps {
  product: Product;
  showThreshold?: number; // Scroll distance in pixels before showing
}

const StickyAddToCart: React.FC<StickyAddToCartProps> = ({ 
  product, 
  showThreshold = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Show/hide based on scroll position
  useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolled past threshold and scrolling down
      if (currentScrollY > showThreshold) {
        setIsVisible(true);
      } 
      // Hide when scrolled back to top
      else if (currentScrollY < showThreshold - 50) {
        setIsVisible(false);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showThreshold]);

  // Haptic feedback
  const hapticFeedback = (pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    // Add product multiple times for quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowSuccess(true);
    hapticFeedback([10, 50, 10]);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  // Handle buy now
  const handleBuyNow = () => {
    // Add product to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    hapticFeedback([10, 50, 10]);
    
    // Navigate to checkout
    navigate('/checkout');
  };

  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < (product.stock_quantity || 99)) {
      setQuantity(quantity + 1);
      hapticFeedback(10);
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      hapticFeedback(10);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t-2 border-ochre-200 dark:border-ochre-700 shadow-2xl pb-safe"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Product Image & Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={(product as any).images?.[0] || product.image_url}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-chocolate dark:text-gray-200 truncate text-sm">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-ochre">
                    ₹{product.price}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 bg-ivory dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 text-chocolate dark:text-gray-200 hover:bg-ochre hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-chocolate dark:text-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.stock_quantity || 99)}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 text-chocolate dark:text-gray-200 hover:bg-ochre hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Buy Now Button */}
                <motion.button
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all shadow-md ${
                    product.stock_quantity === 0
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-ochre to-ochre-600 hover:from-ochre-600 hover:to-ochre-700 text-white active:shadow-lg'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  <span className="hidden sm:inline">Buy Now</span>
                </motion.button>

                {/* Add to Cart Button */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all shadow-md ${
                    product.stock_quantity === 0
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-700 border-2 border-ochre text-ochre hover:bg-ochre hover:text-white active:shadow-lg'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add'}
                  </span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2"
              >
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-semibold text-sm whitespace-nowrap">
                  ✓ Added to cart!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAddToCart;
