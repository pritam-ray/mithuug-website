import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/database';
import { ShoppingCart, Heart, Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressiveImage from '../ProgressiveImage';

interface ProductCardMobileProps {
  product: Product;
}

/**
 * Mobile-Optimized Product Card
 * 
 * Features:
 * - Progressive image loading with blur-up
 * - Larger touch targets (48x48px minimum)
 * - Quick add to cart with quantity selector
 * - Smooth animations and feedback
 * - Swipeable gallery (if multiple images)
 * - Optimized vertical layout for mobile
 * - Haptic feedback on interactions
 */
const ProductCardMobile: React.FC<ProductCardMobileProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url];

  const inWishlist = isInWishlist(product.id);

  // Haptic feedback
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    vibrate(10); // Light haptic feedback
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    vibrate(inWishlist ? 10 : [10, 50, 10]); // Different feedback for add/remove
    toggleWishlist(product.id);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    vibrate(5);
    setQuantity(prev => Math.min(prev + 1, product.stock_quantity || 99));
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    vibrate(5);
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // Calculate average rating (if available from extended type)
  const averageRating = (product as any).average_rating || 0;
  const reviewCount = (product as any).review_count || 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* Progressive Image with Swipe Support (simplified for single image) */}
        <ProgressiveImage
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full"
          aspectRatio="4/3"
          objectFit="cover"
        />

        {/* Image Indicators (if multiple images) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                  vibrate(5);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all touch-target ${
                  index === currentImageIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.is_new && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-ochre text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
            >
              <span className="text-sm">✨</span>
              <span>NEW</span>
            </motion.div>
          )}
          {product.is_bestseller && !product.is_new && (
            <div className="bg-gold text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ BESTSELLER
            </div>
          )}
          {product.stock_quantity && product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Only {product.stock_quantity} left!
            </div>
          )}
        </div>

        {/* Wishlist Button - Larger touch target */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-20 w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 touch-target-lg ${
            inWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 backdrop-blur-sm text-chocolate-600 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            size={20} 
            className={inWishlist ? 'fill-current' : ''} 
          />
        </motion.button>

        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="font-playfair font-bold text-lg text-chocolate-900 dark:text-ochre-300 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating & Reviews */}
        {averageRating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(averageRating)
                      ? 'fill-gold text-gold'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {averageRating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        {/* Description - Mobile optimized */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Stock Status */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ochre dark:text-ochre-400">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {(product as any).original_price && (product as any).original_price > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{(product as any).original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.weight && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {product.weight}
            </span>
          )}
        </div>

        {/* Quick Add to Cart Section */}
        <div className="flex items-center gap-2 pt-2">
          {/* Quantity Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={decrementQuantity}
              className="w-10 h-10 flex items-center justify-center text-chocolate-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors touch-target"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </motion.button>
            <span className="w-10 text-center font-semibold text-chocolate-900 dark:text-white">
              {quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={incrementQuantity}
              className="w-10 h-10 flex items-center justify-center text-chocolate-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors touch-target"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </motion.button>
          </div>

          {/* Add to Cart Button - Full width on mobile */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-ochre to-gold text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 touch-target"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart size={18} />
            <span className="text-sm">
              {product.stock_quantity === 0 ? 'Out of Stock' : addedToCart ? 'Added!' : 'Add to Cart'}
            </span>
          </motion.button>
        </div>

        {/* Success Animation */}
        <AnimatePresence>
          {addedToCart && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-sm text-green-600 dark:text-green-400 font-medium"
            >
              ✓ Added to cart successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};

export default ProductCardMobile;
