import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Category } from '../../types/database';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showInStock: boolean;
  onInStockChange: (show: boolean) => void;
  showNewOnly: boolean;
  onNewOnlyChange: (show: boolean) => void;
  onReset: () => void;
}

/**
 * Mobile Filter Drawer (Bottom Sheet)
 * 
 * Features:
 * - Slides up from bottom
 * - Draggable to dismiss
 * - Backdrop blur
 * - Quick filter chips
 * - Smooth animations
 * - Touch-optimized controls
 */
const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  showInStock,
  onInStockChange,
  showNewOnly,
  onNewOnlyChange,
  onReset,
}) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  // Sync local state with props
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  // Lock body scroll when drawer is open
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

  // Handle drag to close
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  // Apply filters and close
  const handleApply = () => {
    onPriceRangeChange(localPriceRange);
    onClose();
  };

  // Quick filter chips
  const quickFilters = [
    { 
      label: 'New Arrivals', 
      active: showNewOnly,
      onClick: () => onNewOnlyChange(!showNewOnly),
    },
    { 
      label: 'In Stock', 
      active: showInStock,
      onClick: () => onInStockChange(!showInStock),
    },
    { 
      label: 'Under ₹500', 
      active: localPriceRange[1] === 500,
      onClick: () => setLocalPriceRange([0, 500]),
    },
    { 
      label: 'Gift Sets', 
      active: selectedCategory === 'gift-sets',
      onClick: () => onCategoryChange('gift-sets'),
    },
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-ochre" />
                <h2 className="text-xl font-bold text-chocolate-900 dark:text-white">
                  Filters
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target"
                aria-label="Close filters"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Quick Filters */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Quick Filters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((filter) => (
                    <motion.button
                      key={filter.label}
                      whileTap={{ scale: 0.95 }}
                      onClick={filter.onClick}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all touch-target ${
                        filter.active
                          ? 'bg-ochre text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {filter.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Category
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => onCategoryChange('all')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all touch-target ${
                      selectedCategory === 'all'
                        ? 'bg-ochre-100 dark:bg-ochre-900/30 text-ochre-900 dark:text-ochre-300 font-semibold'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategoryChange(category.slug)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all touch-target ${
                        selectedCategory === category.slug
                          ? 'bg-ochre-100 dark:bg-ochre-900/30 text-ochre-900 dark:text-ochre-300 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      ₹{localPriceRange[0]}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ₹{localPriceRange[1]}
                    </span>
                  </div>
                  
                  {/* Dual Range Slider */}
                  <div className="relative h-2">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div 
                      className="absolute h-full bg-ochre rounded-full"
                      style={{
                        left: `${(localPriceRange[0] / 1000) * 100}%`,
                        right: `${100 - (localPriceRange[1] / 1000) * 100}%`,
                      }}
                    />
                  </div>
                  
                  {/* Max Range Slider (simplified) */}
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={localPriceRange[1]}
                    onChange={(e) => setLocalPriceRange([localPriceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ochre [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Sort By
                </h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all touch-target ${
                        sortBy === option.value
                          ? 'bg-ochre-100 dark:bg-ochre-900/30 text-ochre-900 dark:text-ochre-300 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3 pb-safe">
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onReset}
                  className="flex-1 py-4 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <RotateCcw size={18} />
                  <span>Reset</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApply}
                  className="flex-[2] py-4 px-4 bg-gradient-to-r from-ochre to-gold text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all touch-target"
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
