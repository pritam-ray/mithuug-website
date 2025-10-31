import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Heart, PackageCheck, Leaf } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/database';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductCardSkeleton';
import { heroCopy, primaryUSPs } from '../data/content';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const iconMap: { [key: string]: React.ReactNode } = {
    '🎨': <PackageCheck className="w-8 h-8 text-ochre" />,
    '🍯': <Leaf className="w-8 h-8 text-ochre" />,
    '🎁': <Heart className="w-8 h-8 text-ochre" />,
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="MitthuuG - Premium Til-Gud & Traditional Indian Sweets"
        description="Discover authentic, handcrafted Til-Gud (sesame jaggery sweets) and traditional Indian delicacies. Made with 100% natural ingredients, celebrating India's sweet heritage with every bite."
        keywords="til gud, tilgul, sesame jaggery sweets, indian sweets, traditional sweets, natural sweets, handcrafted sweets, makar sankranti sweets"
        ogImage="https://pritam-ray.github.io/mithuug-website/og-image.jpg"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-ivory via-ochre-50 to-gold-50">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg')] bg-cover bg-center opacity-5"></div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto py-32">
          <div className="inline-block mb-6 px-6 py-2 border-2 border-ochre rounded-full bg-white/80 backdrop-blur-sm">
            <span className="text-sm tracking-widest text-chocolate font-semibold">{heroCopy.short.toUpperCase()}</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold tracking-tight text-chocolate mb-6">
            {heroCopy.medium.split(',')[0]}
            <br />
            <span className="italic text-ochre">{heroCopy.medium.split(',')[1]?.trim() || 'Crafted with Love'}</span>
          </h1>

          <p className="text-lg md:text-xl text-chocolate-700 mb-12 max-w-3xl mx-auto leading-relaxed font-inter">
            {heroCopy.paragraph}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/shop"
              className="group px-10 py-4 bg-ochre text-white rounded-full hover:bg-ochre-600 transition-all duration-300 flex items-center space-x-2 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              <span>{heroCopy.cta_primary}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/shop?category=gift-sets"
              className="px-10 py-4 border-2 border-ochre text-chocolate bg-white/80 backdrop-blur-sm rounded-full hover:bg-ochre hover:text-white transition-all duration-300 font-semibold text-lg shadow-md"
            >
              {heroCopy.cta_secondary}
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-chocolate-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span>FSSAI Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-gold" />
              <span>Handcrafted</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-gold" />
              <span>No Refined Sugar</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-ochre rounded-full flex justify-center pt-2 bg-white/50 backdrop-blur-sm">
            <div className="w-1 h-2 bg-ochre rounded-full"></div>
          </div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate mb-4">
              Why MitthuuG?
            </h2>
            <p className="text-lg text-chocolate-600 max-w-2xl mx-auto">
              Because tradition deserves a modern twist – and your snack time deserves better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {primaryUSPs.map((usp, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="mb-6 flex justify-center">
                  <div className="p-6 bg-ochre-50 rounded-full group-hover:bg-ochre-100 transition-colors">
                    {iconMap[usp.icon]}
                  </div>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-chocolate mb-4">
                  {usp.title}
                </h3>
                <p className="text-chocolate-600 leading-relaxed">
                  {usp.support}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
