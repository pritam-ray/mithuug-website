import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Gift, Sparkles, Shield, Heart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useWishlist } from '../context/WishlistContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './mobile/SearchOverlay';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      {/* Top Bar - Offers & Announcements - Hidden on Mobile */}
      <div className="hidden md:block bg-gradient-to-r from-ochre to-gold text-white dark:from-ochre-700 dark:to-gold-700">
        <div className="max-w-7xl mx-auto px-3 py-1.5 md:py-2">
          <div className="flex items-center justify-center space-x-1 md:space-x-2 text-[10px] md:text-xs font-semibold tracking-wide">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span className="truncate">Free Shipping ₹500+ | FSSAI Certified</span>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20">
          {/* Logo - Responsive sizing */}
          <Link to="/" className="flex items-center space-x-2 touch-target-lg">
            <div className="text-xl md:text-3xl font-playfair font-bold text-chocolate dark:text-ochre-300">
              Mitthuug<span className="text-ochre dark:text-ochre-400 italic">_</span>
            </div>
          </Link>

          {/* Primary Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-sm font-bold tracking-widest text-chocolate dark:text-gray-200 hover:text-ochre dark:hover:text-ochre-400 transition-colors">
              SHOP
            </Link>
            <Link to="/about" className="text-sm font-bold tracking-widest text-chocolate dark:text-gray-200 hover:text-ochre dark:hover:text-ochre-400 transition-colors">
              ABOUT
            </Link>
            <Link to="/blog" className="text-sm font-bold tracking-widest text-chocolate dark:text-gray-200 hover:text-ochre dark:hover:text-ochre-400 transition-colors">
              BLOG
            </Link>
            <a href="#contact" className="text-sm font-bold tracking-widest text-chocolate dark:text-gray-200 hover:text-ochre dark:hover:text-ochre-400 transition-colors">
              CONTACT
            </a>
          </div>

          {/* Secondary Actions - Optimized for Mobile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Admin Dashboard - Desktop Only */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-all rounded-lg font-semibold text-sm touch-target"
                title="Admin Dashboard"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            {/* Gift Packs Link - Desktop Only */}
            <Link
              to="/shop?category=gift-sets"
              className="hidden lg:flex items-center space-x-2 px-4 py-2 border-2 border-gold text-gold hover:bg-gold hover:text-white transition-all rounded-full font-semibold text-sm touch-target"
            >
              <Gift className="w-4 h-4" />
              <span>Gift Packs</span>
            </Link>

            {/* Desktop Actions - Hidden on Mobile (now in bottom nav) */}
            <Link
              to={user ? '/account' : '/login'}
              className="hidden md:flex text-chocolate dark:text-gray-300 hover:text-ochre dark:hover:text-ochre-400 transition-colors touch-target"
              title={user ? 'My Account' : 'Sign In'}
            >
              <User className="w-6 h-6" />
            </Link>

            <Link
              to="/wishlist"
              className="relative hidden md:flex text-chocolate dark:text-gray-300 hover:text-ochre dark:hover:text-ochre-400 transition-colors touch-target"
              title="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Theme & Language - Desktop Only */}
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <LanguageSelector />
            </div>

            {/* Search Icon - Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden text-chocolate dark:text-gray-300 hover:text-ochre dark:hover:text-ochre-400 transition-colors touch-target-lg"
              title="Search Products"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart - Visible on Mobile until Bottom Nav is stable */}
            <button
              onClick={onCartClick}
              className="relative text-chocolate dark:text-gray-300 hover:text-ochre dark:hover:text-ochre-400 transition-colors touch-target-lg md:touch-target"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-ochre text-white text-[10px] md:text-xs w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-chocolate dark:text-gray-300 touch-target-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay with Animations */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 top-[56px] md:top-[88px] md:hidden bg-white dark:bg-gray-900 z-40 overflow-y-auto"
          >
            <div className="px-4 py-6 space-y-2">
              {/* Admin Dashboard - Only for admins */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-3 py-4 text-sm font-bold tracking-wide text-white bg-purple-600 hover:bg-purple-700 px-4 rounded-xl transition-all touch-target"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                </motion.div>
              )}

              {/* Main Navigation Links */}
              {[
                { to: '/shop', label: 'Shop All', icon: null },
                { to: '/shop?category=gift-sets', label: 'Gift Packs', icon: Gift },
                { to: '/about', label: 'Our Story', icon: null },
                { to: '/blog', label: 'Blog', icon: null },
                { to: '/contact', label: 'Contact', icon: null },
              ].map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <Link 
                    to={item.to}
                    className="flex items-center space-x-3 py-4 text-base font-semibold text-chocolate dark:text-gray-200 hover:text-ochre dark:hover:text-ochre-400 hover:bg-ochre-50 dark:hover:bg-gray-800 px-4 rounded-xl transition-all touch-target"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Settings Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-6 mt-6 border-t-2 border-gray-200 dark:border-gray-700"
              >
                <div className="px-4 mb-4">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-3">
                    Settings
                  </h3>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-chocolate dark:text-gray-200">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-chocolate dark:text-gray-200">Language</span>
                    <LanguageSelector />
                  </div>
                </div>

                {/* Account Link */}
                <Link 
                  to={user ? '/account' : '/login'} 
                  className="flex items-center justify-between py-4 text-base font-semibold text-chocolate dark:text-gray-200 hover:text-ochre dark:hover:text-ochre-400 hover:bg-ochre-50 dark:hover:bg-gray-800 px-4 rounded-xl transition-all touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{user ? 'My Account' : 'Sign In'}</span>
                  <User className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
