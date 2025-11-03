import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: ShoppingBag,
      path: '/shop',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      path: '/checkout',
      badge: cartCount,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      path: '/wishlist',
      badge: wishlistItems.length,
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      path: '/account',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Haptic feedback simulation (vibration API)
  const hapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Light tap feedback
    }
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={hapticFeedback}
              className="flex flex-col items-center justify-center flex-1 touch-target-lg relative group"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {/* Icon Container with Animation */}
              <motion.div
                className="relative flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {/* Active Background */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 -m-2 bg-ochre-100 dark:bg-ochre-900/30 rounded-2xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: active ? 1.15 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      active
                        ? 'text-ochre dark:text-ochre-400 stroke-[2.5]'
                        : 'text-gray-500 dark:text-gray-400 stroke-[2]'
                    }`}
                  />
                </motion.div>

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 z-20"
                  >
                    <div className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                      {item.badge > 99 ? '99+' : item.badge}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Label */}
              <motion.span
                className={`text-[11px] font-medium mt-1 transition-colors duration-200 ${
                  active
                    ? 'text-ochre dark:text-ochre-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                animate={{
                  opacity: active ? 1 : 0.8,
                  y: active ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>

              {/* Ripple Effect on Tap */}
              <motion.div
                className="absolute inset-0 rounded-full bg-ochre-200 dark:bg-ochre-800 opacity-0"
                whileTap={{ scale: 2, opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
