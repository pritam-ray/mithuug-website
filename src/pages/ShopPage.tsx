import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types/database';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [selectedCategory, sortBy, searchQuery, priceRange]);

  const loadData = async () => {
    try {
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
      ]);

      if (productsData) setProducts(productsData);
      if (categoriesData) setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchParams.get('filter') === 'new') {
        query = query.eq('is_new', true);
      } else if (searchParams.get('filter') === 'bestsellers') {
        query = query.eq('is_bestseller', true);
      }

      query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);

      const { data } = await query;

      if (data) {
        let filtered = data;

        if (searchQuery) {
          filtered = filtered.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

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
          case 'newest':
          default:
            filtered.sort((a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        }

        setProducts(filtered);
      }
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
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
          {/* Filters Sidebar */}
          <aside className={`lg:w-72 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Search */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-ochre-100">
              <h3 className="text-sm font-bold tracking-widest text-chocolate mb-4 flex items-center font-playfair">
                <Search className="w-5 h-5 mr-2 text-ochre" />
                SEARCH
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find your favorite..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre focus:border-ochre transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-ochre transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-ochre-100">
              <h3 className="text-sm font-bold tracking-widest text-chocolate mb-4 font-playfair">
                CATEGORIES
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all font-semibold ${
                    selectedCategory === 'all'
                      ? 'bg-ochre text-white shadow-md'
                      : 'text-chocolate-600 hover:bg-ochre-50'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-semibold ${
                      selectedCategory === category.slug
                        ? 'bg-ochre text-white shadow-md'
                        : 'text-chocolate-600 hover:bg-ochre-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-ochre-100">
              <h3 className="text-sm font-bold tracking-widest text-chocolate mb-4 flex items-center font-playfair">
                <SlidersHorizontal className="w-5 h-5 mr-2 text-ochre" />
                SORT BY
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre focus:border-ochre transition-all font-semibold text-chocolate cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="bestsellers">Bestsellers</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-ochre-100">
              <h3 className="text-sm font-bold tracking-widest text-chocolate mb-4 font-playfair">
                PRICE RANGE
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-ochre">₹{priceRange[0]}</span>
                  <span className="text-ochre">₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-ochre-200 rounded-lg appearance-none cursor-pointer accent-ochre"
                />
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="text-xs text-chocolate-500 hover:text-ochre transition-colors underline"
                >
                  Reset Price Filter
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-6 right-6 bg-ochre text-white p-4 rounded-full shadow-2xl z-50 hover:bg-ochre-600 transition-all"
          >
            <Filter className="w-6 h-6" />
          </button>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-chocolate-600 font-semibold">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-2xl border-2 border-ochre-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre mx-auto mb-4"></div>
                  <p className="text-chocolate-600 font-semibold">Loading delicious bites...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border-2 border-ochre-100">
                <p className="text-chocolate-600 text-lg font-playfair mb-4">No products found</p>
                <p className="text-chocolate-500 text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
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
