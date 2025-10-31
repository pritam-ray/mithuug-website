import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Review } from '../types/database';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, Star, ChevronLeft, Package, Truck, Shield, Leaf, Sparkles } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import { mitthuugProducts } from '../data/products';
import SEO from '../components/SEO';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadProduct();
      loadReviews();
      if (user) checkWishlist();
    }
  }, [id, user]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user_profile:user_profiles(full_name, avatar_url)
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const checkWishlist = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', id)
        .maybeSingle();

      setIsInWishlist(!!data);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user || !id) return;

    try {
      if (isInWishlist) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id);
        setIsInWishlist(false);
      } else {
        await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, product_id: id }]);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-stone-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <SEO title="Product Not Found | MitthuuG" />
        <div className="text-center">
          <h2 className="text-2xl text-stone-900 mb-4">Product not found</h2>
          <Link to="/shop" className="text-stone-600 hover:text-stone-900">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  // Find matching product data for enhanced information
  const productData = mitthuugProducts.find(p => p.title === product.name);

  return (
    <div className="min-h-screen pt-20 bg-ivory">
      <SEO 
        title={`${product.name} - Premium Til-Gud | MitthuuG`}
        description={product.description || `Order ${product.name} from MitthuuG. Authentic handcrafted Til-Gud sweets made with 100% natural ingredients. Price: ₹${product.price}. Free shipping on orders above ₹500.`}
        keywords={`${product.name}, buy ${product.name} online, til gud ${product.name}, traditional indian sweets, handcrafted sweets`}
        ogImage={product.image_url}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 text-chocolate-600 hover:text-ochre mb-8 transition-colors font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Shop</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative bg-white rounded-2xl p-4 shadow-xl">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
            {product.is_new && (
              <div className="absolute top-8 left-8 bg-ochre text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest flex items-center space-x-2 shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>NEW ARRIVAL</span>
              </div>
            )}
            {product.is_bestseller && !product.is_new && (
              <div className="absolute top-8 left-8 bg-gold text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest shadow-lg">
                ⭐ BESTSELLER
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            <h1 className="text-5xl font-playfair font-bold text-chocolate mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? 'fill-gold text-gold'
                        : 'text-chocolate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-chocolate-600 font-semibold">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            <div className="mb-6 flex items-baseline space-x-3">
              <p className="text-4xl font-playfair font-bold text-ochre">₹{product.price}</p>
              <span className="text-sm text-chocolate-500 font-semibold">({product.weight})</span>
            </div>

            <p className="text-chocolate-700 mb-8 leading-relaxed text-lg border-l-4 border-ochre pl-4 bg-white/50 p-4 rounded-r-lg">
              {productData?.long_desc || product.description}
            </p>

            {/* Product Highlights */}
            {productData?.bullets && (
              <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-playfair font-bold text-chocolate text-xl mb-4">Why You'll Love This</h3>
                <ul className="space-y-3">
                  {productData.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Leaf className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                      <span className="text-chocolate-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4 mb-8">
              {/* Ingredients */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-playfair font-bold text-chocolate text-lg mb-3 flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-olive" />
                  <span>Pure Ingredients</span>
                </h3>
                <p className="text-chocolate-700 leading-relaxed">
                  {productData?.ingredients || product.ingredients.join(', ')}
                </p>
              </div>

              {/* Nutrition Highlights */}
              {productData?.nutrition_highlights && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-playfair font-bold text-chocolate text-lg mb-4">Nutrition Highlights (per 100g)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(productData.nutrition_highlights).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-ochre-50 rounded-lg">
                        <span className="text-sm font-semibold text-chocolate-600">{key}</span>
                        <span className="text-sm font-bold text-ochre">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center justify-between py-4 px-6 bg-white rounded-xl shadow-md">
                <span className="text-chocolate-600 font-semibold">Stock Status</span>
                <span className={`font-bold ${product.stock_quantity > 0 ? 'text-olive' : 'text-red-600'}`}>
                  {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border-2 border-ochre rounded-full bg-white shadow-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 hover:bg-ochre-50 transition-colors font-bold text-chocolate text-lg"
                >
                  −
                </button>
                <span className="px-8 py-3 border-x-2 border-ochre font-bold text-chocolate text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="px-5 py-3 hover:bg-ochre-50 transition-colors font-bold text-chocolate text-lg"
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 bg-ochre text-white py-4 px-6 rounded-full hover:bg-ochre-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                <span className="tracking-wide">ADD TO CART</span>
              </button>

              {user && (
                <button
                  onClick={toggleWishlist}
                  className={`px-6 py-4 rounded-full border-2 transition-all duration-300 shadow-md ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-ochre-300 bg-white text-chocolate hover:border-ochre'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-ochre-100">
              <div className="text-center">
                <div className="bg-ochre-50 rounded-full p-4 inline-block mb-2">
                  <Package className="w-8 h-8 mx-auto text-ochre" />
                </div>
                <p className="text-xs font-semibold text-chocolate-600">Premium Packaging</p>
              </div>
              <div className="text-center">
                <div className="bg-ochre-50 rounded-full p-4 inline-block mb-2">
                  <Truck className="w-8 h-8 mx-auto text-ochre" />
                </div>
                <p className="text-xs font-semibold text-chocolate-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="bg-ochre-50 rounded-full p-4 inline-block mb-2">
                  <Shield className="w-8 h-8 mx-auto text-ochre" />
                </div>
                <p className="text-xs font-semibold text-chocolate-600">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection
          product_id={product.id}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
