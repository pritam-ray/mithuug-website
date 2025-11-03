import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Product, Category } from '../../types/database';
import { trackSearch } from '../../lib/analytics';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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

  // Load trending products and categories on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [{ data: trending }, { data: cats }] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_bestseller', true)
            .limit(4),
          supabase.from('categories').select('*'),
        ]);

        if (trending) setTrendingProducts(trending);
        if (cats) setCategories(cats);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  // Instant search with debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');

        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }

        const { data } = await query;

        if (data) {
          const filtered = data.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
        }
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Save search to recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim() || query.length < 2) return;

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    trackSearch(query);
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
  };

  // Handle product click
  const handleProductClick = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
    onClose();
  };

  // Haptic feedback
  const hapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

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

          {/* Search Overlay */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 top-0 bottom-0 bg-ivory z-[61] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-white border-b-2 border-ochre-100 px-4 pt-safe">
              {/* Top Bar */}
              <div className="flex items-center gap-3 py-3">
                <button
                  onClick={() => {
                    hapticFeedback();
                    onClose();
                  }}
                  className="p-2 -ml-2 text-chocolate-600 hover:text-ochre active:scale-95 transition-all touch-target"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Search Input */}
                <form onSubmit={handleSubmit} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate-400 pointer-events-none" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-ivory rounded-xl border-2 border-ochre-200 focus:border-ochre focus:ring-2 focus:ring-ochre-200 transition-all text-chocolate placeholder:text-chocolate-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          hapticFeedback();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-chocolate-400 hover:text-ochre active:scale-90 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Category Filter Chips */}
              {categories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      hapticFeedback();
                    }}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold transition-all active:scale-95 ${
                      selectedCategory === 'all'
                        ? 'bg-ochre text-white shadow-md'
                        : 'bg-white text-chocolate border-2 border-ochre-200 hover:border-ochre'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.slug);
                        hapticFeedback();
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold transition-all active:scale-95 whitespace-nowrap ${
                        selectedCategory === category.slug
                          ? 'bg-ochre text-white shadow-md'
                          : 'bg-white text-chocolate border-2 border-ochre-200 hover:border-ochre'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="mb-8">
                  <h3 className="text-lg font-playfair font-bold text-chocolate mb-4">
                    {loading ? (
                      'Searching...'
                    ) : (
                      <>
                        {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                      </>
                    )}
                  </h3>

                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-ochre-100 rounded-lg" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-ochre-100 rounded w-3/4" />
                              <div className="h-3 bg-ochre-100 rounded w-1/2" />
                              <div className="h-4 bg-ochre-100 rounded w-1/4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-chocolate-600 text-lg mb-2">No products found</p>
                      <p className="text-chocolate-400 text-sm">
                        Try different keywords or categories
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${(product as any).slug || product.id}`}
                          onClick={handleProductClick}
                          className="block bg-white rounded-xl p-4 hover:shadow-md active:scale-[0.98] transition-all"
                        >
                          <div className="flex gap-4">
                            <img
                              src={(product as any).images?.[0] || product.image_url}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-chocolate mb-1 truncate">
                                {product.name}
                              </h4>
                              <p className="text-sm text-chocolate-600 line-clamp-2 mb-2">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-ochre">
                                  ₹{product.price}
                                </span>
                                {product.stock_quantity === 0 && (
                                  <span className="text-xs text-red-500 font-semibold">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-chocolate-400 flex-shrink-0 self-center" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recent Searches */}
              {!searchQuery && recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-playfair font-bold text-chocolate">
                      Recent Searches
                    </h3>
                    <button
                      onClick={() => {
                        clearRecentSearches();
                        hapticFeedback();
                      }}
                      className="text-sm text-ochre font-semibold hover:underline active:scale-95"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleRecentSearchClick(query);
                          hapticFeedback();
                        }}
                        className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md active:scale-[0.98] transition-all text-left"
                      >
                        <Clock className="w-5 h-5 text-chocolate-400 flex-shrink-0" />
                        <span className="flex-1 text-chocolate font-medium">{query}</span>
                        <ArrowRight className="w-5 h-5 text-chocolate-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Products */}
              {!searchQuery && trendingProducts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-ochre" />
                    <h3 className="text-lg font-playfair font-bold text-chocolate">
                      Trending Now
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {trendingProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${(product as any).slug || product.id}`}
                        onClick={onClose}
                        className="block bg-white rounded-xl p-4 hover:shadow-md active:scale-[0.98] transition-all"
                      >
                        <div className="flex gap-4">
                          <img
                            src={(product as any).images?.[0] || product.image_url}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-chocolate mb-1 truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-chocolate-600 line-clamp-2 mb-2">
                              {product.description}
                            </p>
                            <span className="text-lg font-bold text-ochre">
                              ₹{product.price}
                            </span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-chocolate-400 flex-shrink-0 self-center" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
