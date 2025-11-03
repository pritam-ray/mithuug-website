// Filter Sidebar Component for ShopPage
import React from 'react';
import { X, SlidersHorizontal, DollarSign, Tag, Star, Package } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showInStock?: boolean;
  onInStockChange?: (value: boolean) => void;
  showNewOnly?: boolean;
  onNewOnlyChange?: (value: boolean) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  showInStock = false,
  onInStockChange,
  showNewOnly = false,
  onNewOnlyChange,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white shadow-xl z-[61] transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:top-24`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-5 h-5 text-ochre" />
              <h2 className="text-xl font-playfair font-bold text-chocolate">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-ochre-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-chocolate" />
            </button>
          </div>

          {/* Sort By */}
          <div className="mb-8">
            <label className="flex items-center space-x-2 text-sm font-semibold text-chocolate-700 mb-3">
              <Tag className="w-4 h-4 text-ochre" />
              <span>Sort By</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-ochre-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre-200 transition-all duration-200 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <label className="flex items-center space-x-2 text-sm font-semibold text-chocolate-700 mb-3">
              <Package className="w-4 h-4 text-ochre" />
              <span>Categories</span>
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onCategoryChange('all')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-mitthuug text-white shadow-mitthuug'
                    : 'bg-ochre-50 text-chocolate-700 hover:bg-ochre-100'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-mitthuug text-white shadow-mitthuug'
                      : 'bg-ochre-50 text-chocolate-700 hover:bg-ochre-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <label className="flex items-center space-x-2 text-sm font-semibold text-chocolate-700 mb-3">
              <DollarSign className="w-4 h-4 text-ochre" />
              <span>Price Range</span>
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])
                  }
                  className="w-full px-3 py-2 border-2 border-ochre-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre-200 transition-all"
                  placeholder="Min"
                />
                <span className="text-chocolate-600 font-semibold">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 1000])
                  }
                  className="w-full px-3 py-2 border-2 border-ochre-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre-200 transition-all"
                  placeholder="Max"
                />
              </div>
              <div className="text-sm text-chocolate-600 text-center">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </div>
              
              {/* Quick Price Filters */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onPriceRangeChange([0, 250])}
                  className="px-3 py-2 bg-ochre-50 text-chocolate-700 rounded-lg hover:bg-ochre-100 transition-colors text-sm font-semibold"
                >
                  Under ₹250
                </button>
                <button
                  onClick={() => onPriceRangeChange([250, 500])}
                  className="px-3 py-2 bg-ochre-50 text-chocolate-700 rounded-lg hover:bg-ochre-100 transition-colors text-sm font-semibold"
                >
                  ₹250 - ₹500
                </button>
                <button
                  onClick={() => onPriceRangeChange([500, 1000])}
                  className="px-3 py-2 bg-ochre-50 text-chocolate-700 rounded-lg hover:bg-ochre-100 transition-colors text-sm font-semibold"
                >
                  ₹500 - ₹1000
                </button>
                <button
                  onClick={() => onPriceRangeChange([1000, 5000])}
                  className="px-3 py-2 bg-ochre-50 text-chocolate-700 rounded-lg hover:bg-ochre-100 transition-colors text-sm font-semibold"
                >
                  Over ₹1000
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mb-8">
            <label className="flex items-center space-x-2 text-sm font-semibold text-chocolate-700 mb-3">
              <Star className="w-4 h-4 text-ochre" />
              <span>Quick Filters</span>
            </label>
            <div className="space-y-3">
              {onInStockChange && (
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showInStock}
                    onChange={(e) => onInStockChange(e.target.checked)}
                    className="w-5 h-5 text-ochre border-2 border-ochre-300 rounded focus:ring-ochre"
                  />
                  <span className="text-chocolate-700 group-hover:text-ochre transition-colors">
                    In Stock Only
                  </span>
                </label>
              )}
              {onNewOnlyChange && (
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showNewOnly}
                    onChange={(e) => onNewOnlyChange(e.target.checked)}
                    className="w-5 h-5 text-ochre border-2 border-ochre-300 rounded focus:ring-ochre"
                  />
                  <span className="text-chocolate-700 group-hover:text-ochre transition-colors">
                    New Arrivals Only
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Clear All Button */}
          <button
            onClick={() => {
              onCategoryChange('all');
              onPriceRangeChange([0, 1000]);
              onSortChange('newest');
              if (onInStockChange) onInStockChange(false);
              if (onNewOnlyChange) onNewOnlyChange(false);
            }}
            className="w-full px-6 py-3 border-2 border-ochre text-ochre font-semibold rounded-lg hover:bg-ochre hover:text-white transition-all duration-300"
          >
            Clear All Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
