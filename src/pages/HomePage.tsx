import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/database';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductCardSkeleton';
import SEO from '../components/SEO';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import HeroSection from '../components/HeroSection';
import USPGrid from '../components/USPGrid';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import PullToRefreshIndicator from '../components/mobile/PullToRefreshIndicator';

const HomePage: React.FC = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Pull-to-refresh functionality
  const { isPulling, isRefreshing, pullDistance, pullProgress } = usePullToRefresh({
    onRefresh: async () => {
      await loadProducts();
    },
    threshold: 80,
    resistance: 2.5,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data: newData } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .limit(3);

      const { data: bestsellerData } = await supabase
        .from('products')
        .select('*')
        .eq('is_bestseller', true)
        .limit(3);

      if (newData) setNewProducts(newData);
      if (bestsellerData) setBestsellers(bestsellerData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="MitthuuG - Premium Til-Gud & Traditional Indian Sweets"
        description="Discover authentic, handcrafted Til-Gud (sesame jaggery sweets) and traditional Indian delicacies. Made with 100% natural ingredients, celebrating India's sweet heritage with every bite."
        keywords="til gud, tilgul, sesame jaggery sweets, indian sweets, traditional sweets, natural sweets, handcrafted sweets, makar sankranti sweets"
        ogImage="https://pritam-ray.github.io/mithuug-website/og-image.jpg"
      />
      
      {/* Pull-to-Refresh Indicator */}
      <PullToRefreshIndicator
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        pullProgress={pullProgress}
      />
      
      {/* Hero Section - New Component */}
      <HeroSection variant="A" />

      {/* USPs Section - New Component */}
      <USPGrid />

      {!loading && (
        <>
          {/* New Arrivals Section */}
          {newProducts.length > 0 && (
            <section className="py-24 px-4 bg-ivory">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-8 h-8 text-ochre" />
                    <h2 className="text-4xl font-playfair font-bold text-chocolate">
                      New Arrivals
                    </h2>
                  </div>
                  <Link
                    to="/shop?filter=new"
                    className="text-chocolate-600 hover:text-ochre transition-colors flex items-center space-x-2 font-semibold"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {loading ? (
                  <ProductGridSkeleton count={3} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Bestsellers Section */}
          {bestsellers.length > 0 && (
            <section className="py-24 px-4 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-ochre" />
                    <h2 className="text-4xl font-playfair font-bold text-chocolate">
                      Customer Favorites
                    </h2>
                  </div>
                  <Link
                    to="/shop?filter=bestsellers"
                    className="text-chocolate-600 hover:text-ochre transition-colors flex items-center space-x-2 font-semibold"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {loading ? (
                  <ProductGridSkeleton count={3} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bestsellers.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-ivory-50">
        <div className="max-w-4xl mx-auto">
          <Newsletter />
        </div>
      </section>

      {/* Mitthu Express CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-ochre to-gold">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Join the Mitthu Express Journey
          </h2>
          <p className="text-lg mb-8 opacity-95">
            Follow our Instagram for behind-the-scenes stories, recipe trials, and milestone celebrations. 
            Every "Station" is a new chapter in our story.
          </p>
          <a
            href="https://instagram.com/mitthuug"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-white text-ochre rounded-full hover:bg-ivory transition-all duration-300 font-semibold text-lg shadow-xl"
          >
            Follow Us on Instagram
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
