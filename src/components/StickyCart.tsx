import React, { useEffect, useState } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const StickyCart: React.FC = () => {
  const { cartTotal, cartCount } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const totalItems = cartCount;

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Don't show if cart is empty
  if (totalItems === 0) return null;

  return (
    <div
      className={`sticky-cart-mobile transform transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Cart Summary */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-ochre" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-xs text-chocolate-600 font-medium">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
            <p className="text-lg font-bold text-ochre">
              ₹{cartTotal.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <Link
          to="/checkout"
          className="btn-primary flex-shrink-0 py-3 px-6 flex items-center gap-2"
        >
          <span>Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default StickyCart;
