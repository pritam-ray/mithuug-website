import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dataCache } from '../lib/dataCache';
import { Product, Category } from '../types/database';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductCardSkeleton';
import { Search, X, Filter } from 'lucide-react';
import SEO from '../components/SEO';
import FilterSidebar from '../components/FilterSidebar';
import FilterDrawer from '../components/mobile/FilterDrawer';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import PullToRefreshIndicator from '../components/mobile/PullToRefreshIndicator';
import { trackSearch } from '../lib/analytics';

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Cache all products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Pull-to-refresh functionality
  const { isPulling, isRefreshing, pullDistance, pullProgress } = usePullToRefresh({
    onRefresh: async () => {
      // Clear cache on pull-to-refresh
      dataCache.invalidatePattern('products:');
      dataCache.invalidatePattern('categories:');
      await loadData();
    },
    threshold: 80,
    resistance: 2.5,
  });

  useEffect(() => {
    loadData();
  }, []);

  // Client-side filtering - no database calls
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFiltersAndSort();
    }
  }, [allProducts, selectedCategory, sortBy, searchQuery, priceRange, showInStock, showNewOnly]);

  // Track search with debounce
  useEffect(() => {
    if (searchQuery && searchQuery.length > 2) {
      if (searchTimeout) clearTimeout(searchTimeout);
      
      const timeout = setTimeout(() => {
        trackSearch(searchQuery);
      }, 1000);
      
      setSearchTimeout(timeout);
    }
    
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Use cached data - instant if cache hit
      const [productsData, categoriesData] = await Promise.all([
        dataCache.getAllProducts(),
        dataCache.getCategories(),
      ]);

      setAllProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering and sorting (instant, no database calls)
  const applyFiltersAndSort = () => {
    let filtered = [...allProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // New/Bestseller filter
    if (searchParams.get('filter') === 'new' || showNewOnly) {
      filtered = filtered.filter(product => product.is_new === true);
    } else if (searchParams.get('filter') === 'bestsellers') {
      filtered = filtered.filter(product => product.is_bestseller === true);
    }

    // Stock filter
    if (showInStock) {
      filtered = filtered.filter(product => product.stock_quantity > 0);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
      case 'bestsellers':
        filtered.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen pt-20 bg-ivory">
      <SEO 
        title="Shop Premium Til-Gud Sweets | MitthuuG"
        description="Browse our collection of authentic handcrafted Til-Gud, traditional Indian sweets, and festive treats. All-natural ingredients, no preservatives. Free shipping on orders above ₹500."
        keywords="buy til gud online, tilgul sweets, indian sweets online, traditional sweets, sesame jaggery ladoo, makar sankranti sweets, order sweets online"
      />
      
      {/* Pull-to-Refresh Indicator */}
      <PullToRefreshIndicator
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        pullProgress={pullProgress}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-chocolate mb-4">
            Shop Our Collection
          </h1>
          <p className="text-lg text-chocolate-600 max-w-2xl mx-auto">
            Handcrafted GUD Bites made with love, sesame, and pure jaggery
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              categories={categories.map(c => ({ id: c.slug, name: c.name }))}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showInStock={showInStock}
              onInStockChange={setShowInStock}
              showNewOnly={showNewOnly}
              onNewOnlyChange={setShowNewOnly}
            />
          </div>

          {/* Mobile Filter Drawer */}
          <FilterDrawer
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showInStock={showInStock}
            onInStockChange={setShowInStock}
            showNewOnly={showNewOnly}
            onNewOnlyChange={setShowNewOnly}
            onReset={() => {
              setSelectedCategory('all');
              setPriceRange([0, 1000]);
              setSortBy('newest');
              setShowInStock(false);
              setShowNewOnly(false);
            }}
          />

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-20 right-6 bg-ochre text-white p-4 rounded-full shadow-2xl z-40 hover:bg-ochre-600 transition-all active:scale-95"
            aria-label="Toggle filters"
          >
            <Filter className="w-6 h-6" />
          </button>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="mb-6 bg-white rounded-xl p-4 shadow-md border-2 border-ochre-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-ochre-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre-200 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-ochre transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="mb-6 flex items-center justify-between">
              <p className="text-chocolate-600 font-semibold">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
              </p>
              
              {/* Active Filters Display */}
              {(showInStock || showNewOnly || selectedCategory !== 'all') && (
                <div className="flex items-center gap-2">
                  {showInStock && (
                    <span className="inline-flex items-center px-3 py-1 bg-olive/10 text-olive rounded-full text-sm font-semibold">
                      In Stock
                    </span>
                  )}
                  {showNewOnly && (
                    <span className="inline-flex items-center px-3 py-1 bg-ochre/10 text-ochre rounded-full text-sm font-semibold">
                      New Arrivals
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border-2 border-ochre-100">
                <p className="text-chocolate-600 text-lg font-playfair mb-4">No products found</p>
                <p className="text-chocolate-500 text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
