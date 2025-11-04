import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, X, LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

const AdminFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const location = useLocation();

  // Don't show FAB if not admin or already on admin pages
  if (!isAdmin) return null;

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', color: 'bg-purple-500' },
    { to: '/admin/products', icon: Package, label: 'Products', color: 'bg-blue-500' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders', color: 'bg-green-500' },
    { to: '/admin/customers', icon: Users, label: 'Customers', color: 'bg-orange-500' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', color: 'bg-pink-500' },
    { to: '/admin/reviews', icon: MessageSquare, label: 'Reviews', color: 'bg-indigo-500' },
    { to: '/admin/settings', icon: Settings, label: 'Settings', color: 'bg-gray-500' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-4 space-y-3"
          >
            {adminLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 ${link.color} ${
                    isActive(link.to) ? 'ring-4 ring-white' : ''
                  } text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group`}
                  title={link.label}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-sm font-semibold whitespace-nowrap">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
        } text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300`}
        aria-label={isOpen ? 'Close admin menu' : 'Open admin menu'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Badge for notifications (optional) */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
          !
        </div>
      )}
    </div>
  );
};

export default AdminFAB;
