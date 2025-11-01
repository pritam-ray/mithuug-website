import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Gift, Sparkles, Shield, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();

  // Debug logging
  console.log('Navbar - User:', user?.email);
  console.log('Navbar - isAdmin:', isAdmin);
  console.log('Navbar - adminLoading:', adminLoading);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* Top Bar - Offers & Announcements */}
      <div className="bg-gradient-to-r from-ochre to-gold text-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-xs font-semibold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>Free Shipping on Orders Above ₹500 | FSSAI Certified Quality</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl font-playfair font-bold text-chocolate">
              Mitthuug<span className="text-ochre italic">_</span>
            </div>
          </Link>

          {/* Primary Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-sm font-bold tracking-widest text-chocolate hover:text-ochre transition-colors">
              SHOP
            </Link>
            <Link to="/about" className="text-sm font-bold tracking-widest text-chocolate hover:text-ochre transition-colors">
              ABOUT
            </Link>
            <Link to="/blog" className="text-sm font-bold tracking-widest text-chocolate hover:text-ochre transition-colors">
              BLOG
            </Link>
            <a href="#contact" className="text-sm font-bold tracking-widest text-chocolate hover:text-ochre transition-colors">
              CONTACT
            </a>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center space-x-6">
            {/* Admin Dashboard - Only for admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-all rounded-lg font-semibold text-sm"
                title="Admin Dashboard"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            {/* Gift Packs Link */}
            <Link
              to="/shop?category=gift-sets"
              className="hidden lg:flex items-center space-x-2 px-4 py-2 border-2 border-gold text-gold hover:bg-gold hover:text-white transition-all rounded-full font-semibold text-sm"
            >
              <Gift className="w-4 h-4" />
              <span>Gift Packs</span>
            </Link>

            {/* User Account */}
            <Link
              to={user ? '/account' : '/login'}
              className="hidden md:block text-chocolate hover:text-ochre transition-colors"
              title={user ? 'My Account' : 'Sign In'}
            >
              <User className="w-6 h-6" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hidden md:block text-chocolate hover:text-ochre transition-colors"
              title="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <button
              onClick={onCartClick}
              className="relative text-chocolate hover:text-ochre transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-ochre text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-chocolate"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-ivory border-t-2 border-ochre-100">
          <div className="px-4 py-6 space-y-4">
            {/* Admin Dashboard - Only for admins */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center space-x-2 py-3 text-sm font-bold tracking-widest text-white bg-purple-600 hover:bg-purple-700 px-4 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="w-5 h-5" />
                <span>ADMIN DASHBOARD</span>
              </Link>
            )}
            <Link 
              to="/shop" 
              className="block py-3 text-sm font-bold tracking-widest text-chocolate hover:text-ochre hover:bg-ochre-50 px-4 rounded-lg transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              SHOP
            </Link>
            <Link 
              to="/shop?category=gift-sets" 
              className="flex items-center space-x-2 py-3 text-sm font-bold tracking-widest text-gold hover:bg-gold-50 px-4 rounded-lg transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Gift className="w-5 h-5" />
              <span>GIFT PACKS</span>
            </Link>
            <Link 
              to="/about" 
              className="block py-3 text-sm font-bold tracking-widest text-chocolate hover:text-ochre hover:bg-ochre-50 px-4 rounded-lg transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link 
              to="/blog" 
              className="block py-3 text-sm font-bold tracking-widest text-chocolate hover:text-ochre hover:bg-ochre-50 px-4 rounded-lg transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              BLOG
            </Link>
            <a 
              href="#contact" 
              className="block py-3 text-sm font-bold tracking-widest text-chocolate hover:text-ochre hover:bg-ochre-50 px-4 rounded-lg transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </a>
            <div className="pt-4 border-t-2 border-ochre-100">
              <Link 
                to={user ? '/account' : '/login'} 
                className="block py-3 text-sm font-bold tracking-widest text-chocolate hover:text-ochre hover:bg-ochre-50 px-4 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {user ? 'MY ACCOUNT' : 'SIGN IN'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
