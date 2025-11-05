import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ShoppingBag, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-4 bg-gradient-to-br from-ivory-50 to-ochre-50 flex items-center justify-center px-4">
      <SEO 
        title="Page Not Found (404) | MitthuuG"
        description="The page you're looking for doesn't exist. Return to MitthuuG's homepage to explore our premium til-gud sweets."
      />
      
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative Elements */}
        <div className="relative inline-block mb-8">
          <h1 className="text-9xl font-playfair font-bold text-ochre-500 opacity-20">
            404
          </h1>
          <Sparkles className="absolute top-0 right-0 w-12 h-12 text-gold-500 animate-pulse" />
          <Sparkles className="absolute bottom-0 left-0 w-8 h-8 text-ochre-400 animate-pulse delay-75" />
        </div>

        {/* Main Message */}
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate-900 mb-4">
          Lost in the GUD vibes?
        </h2>
        <p className="text-lg text-chocolate-600 mb-8">
          The page you're looking for seems to have wandered off. 
          Let's get you back to spreading sweetness!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-8 py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <Link
            to="/shop"
            className="inline-flex items-center justify-center space-x-2 border-2 border-ochre-400 text-ochre-700 px-8 py-4 rounded-full hover:bg-ochre-50 transition-all font-bold"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Browse Products</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-8 border-2 border-ochre-200 shadow-lg">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-ochre-600" />
            <h3 className="text-lg font-bold text-chocolate-900">
              Looking for something specific?
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/shop"
              className="px-4 py-3 bg-ochre-50 hover:bg-ochre-100 rounded-xl text-ochre-700 font-medium transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="px-4 py-3 bg-ochre-50 hover:bg-ochre-100 rounded-xl text-ochre-700 font-medium transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className="px-4 py-3 bg-ochre-50 hover:bg-ochre-100 rounded-xl text-ochre-700 font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="px-4 py-3 bg-ochre-50 hover:bg-ochre-100 rounded-xl text-ochre-700 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
