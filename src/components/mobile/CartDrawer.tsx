import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity } = useCart();
  const [promoCode, setPromoCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Haptic feedback
  const hapticFeedback = (pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Handle drag end for dismiss
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
      hapticFeedback(10);
    }
  };

  // Handle remove item with swipe
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    hapticFeedback([10, 50, 10]);
  };

  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number, maxStock: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
    } else if (newQuantity <= maxStock) {
      updateQuantity(productId, newQuantity);
      hapticFeedback(10);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    // Simple promo code logic (can be enhanced)
    const validCodes: Record<string, number> = {
      'WELCOME10': 0.10,
      'SAVE20': 0.20,
      'FESTIVAL25': 0.25,
    };

    const code = promoCode.toUpperCase();
    if (validCodes[code]) {
      setDiscount(validCodes[code]);
      hapticFeedback([10, 50, 10]);
    } else {
      setDiscount(0);
      hapticFeedback([10, 10, 10]);
    }
  };

  // Calculate final total
  const discountAmount = cartTotal * discount;
  const finalTotal = cartTotal - discountAmount;
  const freeShippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-[61] bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b-2 border-ochre-100 dark:border-ochre-700">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-ochre" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-ochre text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-playfair font-bold text-chocolate dark:text-gray-200">
                  Your Cart
                </h2>
              </div>
              <button
                onClick={() => {
                  onClose();
                  hapticFeedback(10);
                }}
                className="p-2 hover:bg-ivory dark:hover:bg-gray-700 rounded-full transition-colors active:scale-95"
                aria-label="Close cart"
              >
                <X className="w-6 h-6 text-chocolate-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && cartCount > 0 && (
              <div className="px-6 py-3 bg-ochre-50 dark:bg-ochre-900/20">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-chocolate-600 dark:text-gray-300 font-medium">
                    Add ₹{remainingForFreeShipping} more for FREE shipping
                  </span>
                  <span className="text-ochre font-semibold">
                    ₹{freeShippingThreshold}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((cartTotal / freeShippingThreshold) * 100, 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-ochre to-gold"
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag className="w-20 h-20 text-chocolate-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-playfair font-bold text-chocolate dark:text-gray-200 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-chocolate-600 dark:text-gray-400 mb-6">
                    Add some delicious treats to get started!
                  </p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Start Shopping
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="relative bg-ivory dark:bg-gray-700 rounded-xl p-4 group"
                    >
                      {/* Swipe to delete hint (subtle) */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-50 transition-opacity">
                        <Trash2 className="w-5 h-5" />
                      </div>

                      <div className="flex gap-4">
                        {/* Product Image */}
                        <img
                          src={(item as any).images?.[0] || item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-chocolate dark:text-gray-200 mb-1 truncate">
                            {item.name}
                          </h4>
                          <p className="text-ochre font-bold mb-2">
                            ₹{item.price} × {item.quantity}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock_quantity)}
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 text-chocolate dark:text-gray-200 hover:bg-ochre hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-semibold text-chocolate dark:text-gray-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock_quantity)}
                              disabled={item.quantity >= item.stock_quantity}
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 text-chocolate dark:text-gray-200 hover:bg-ochre hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="self-start p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 hover:text-red-600 transition-colors active:scale-95"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-chocolate-200 dark:border-gray-600 flex justify-between items-center">
                        <span className="text-sm text-chocolate-600 dark:text-gray-400">
                          Subtotal
                        </span>
                        <span className="font-bold text-chocolate dark:text-gray-200">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Promo Code & Footer (only if cart has items) */}
            {cart.length > 0 && (
              <div className="border-t-2 border-ochre-100 dark:border-ochre-700 px-6 py-4 pb-safe">
                {/* Promo Code */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate-400" />
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-3 border-2 border-ochre-200 dark:border-ochre-700 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre-200 transition-all bg-white dark:bg-gray-700 text-chocolate dark:text-gray-200"
                      />
                    </div>
                    <button
                      onClick={applyPromoCode}
                      className="px-6 py-3 bg-ochre hover:bg-ochre-600 text-white font-semibold rounded-lg transition-all active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-600 dark:text-green-400 text-sm mt-2 font-semibold">
                      ✓ {(discount * 100)}% discount applied!
                    </p>
                  )}
                </div>

                {/* Total Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-chocolate-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                      <span>Discount ({(discount * 100)}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-chocolate-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {cartTotal >= freeShippingThreshold ? 'FREE' : '₹50'}
                    </span>
                  </div>
                  <div className="pt-2 border-t-2 border-ochre-200 dark:border-ochre-700 flex justify-between items-center">
                    <span className="text-lg font-playfair font-bold text-chocolate dark:text-gray-200">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-ochre">
                      ₹{(finalTotal + (cartTotal >= freeShippingThreshold ? 0 : 50)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={() => {
                    onClose();
                    hapticFeedback([10, 50, 10]);
                  }}
                  className="block w-full bg-gradient-mitthuug text-white text-center font-bold py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
