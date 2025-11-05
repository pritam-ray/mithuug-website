import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { dataCache } from '../lib/dataCache';
import { Product, Review } from '../types/database';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, Star, ChevronLeft, Package, Truck, Shield, Leaf, Sparkles, Zap } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import RatingBreakdown from '../components/RatingBreakdown';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { ProductSchema, BreadcrumbSchema } from '../components/StructuredData';
import { trackViewItem, trackAddToCart } from '../lib/analytics';
import StickyAddToCart from '../components/mobile/StickyAddToCart';
import ProductGallery from '../components/mobile/ProductGallery';
import { PageLoader } from '../components/LoadingComponents';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    setLoading(true);
    try {
      // Use cached product data
      const data = await dataCache.getProduct(id!);
      
      if (!data) throw new Error('Product not found');
      setProduct(data);
      
      // Track product view
      trackViewItem({
        id: data.id,
        name: data.name,
        price: data.price,
        category: 'Til-Gud Bites',
      });
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
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reviews:', error);
        return;
      }
      
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
    
    // Track add to cart event
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      category: 'Til-Gud Bites',
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Add to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    // Track add to cart event
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      category: 'Til-Gud Bites',
    });
    
    // Navigate directly to checkout
    navigate('/checkout');
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return <PageLoader text="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-4 flex items-center justify-center">
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

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Home', url: 'https://pritam-ray.github.io/mithuug-website/' },
    { name: 'Shop', url: 'https://pritam-ray.github.io/mithuug-website/shop' },
    { name: product?.name || 'Product', url: `https://pritam-ray.github.io/mithuug-website/product/${id}` },
  ];

  return (
    <div className="min-h-screen pt-4 bg-ivory">
      <SEO 
        title={`${product.name} - Premium Til-Gud | MitthuuG`}
        description={product.description || `Order ${product.name} from MitthuuG. Authentic handcrafted Til-Gud sweets made with 100% natural ingredients. Price: ₹${product.price}. Free shipping on orders above ₹500.`}
        keywords={`${product.name}, buy ${product.name} online, til gud, traditional indian sweets`}
        ogImage={product.images?.[0] || product.image_url}
      />
      
      {/* Structured Data for SEO */}
      <ProductSchema
        name={product.name}
        description={product.description || `Handcrafted ${product.name} made with 100% natural ingredients`}
        image={product.images && product.images.length > 0 ? product.images : [product.image_url]}
        price={product.price}
        currency="INR"
        availability={product.stock_quantity > 0 ? 'InStock' : 'OutOfStock'}
        rating={averageRating}
        reviewCount={reviews.length}
        sku={product.id}
        brand="MitthuuG"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4">
        {/* Back Button */}
        <Link to="/shop" className="inline-flex items-center text-chocolate hover:text-ochre mb-4 md:mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1" />
          <span className="font-semibold text-sm md:text-base">Back to Shop</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-16">
          {/* Product Image Gallery */}
          <div className="relative">
            {/* Badges */}
            {(product.is_new || product.discount_percentage > 0) && (
              <div className="absolute top-2 left-2 md:top-8 md:left-8 z-10 flex flex-col gap-1 md:gap-2">
                {product.is_new && (
                  <span className="bg-olive text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold shadow-md">
                    NEW
                  </span>
                )}
                {product.discount_percentage > 0 && (
                  <span className="bg-red-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold shadow-md">
                    {product.discount_percentage}% OFF
                  </span>
                )}
              </div>
            )}
            
            <ProductGallery 
              images={product.images?.length ? product.images : [product.image_url]} 
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div>
                        <h1 className="text-2xl md:text-5xl font-playfair font-bold text-chocolate mb-3 md:mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 md:space-x-4 mb-4 md:mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 md:w-5 md:h-5 ${
                      i < Math.round(averageRating)
                        ? 'fill-ochre text-ochre'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-chocolate-600 font-medium text-sm md:text-base">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-2xl md:text-4xl font-playfair font-bold text-ochre mb-4 md:mb-6">
              ₹{product.price}
            </p>

            <p className="text-chocolate-700 mb-4 md:mb-8 leading-relaxed text-sm md:text-lg">
              {product.description}
            </p>

            {/* Product Highlights - Simple Version */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-4 md:mb-8 bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h3 className="font-playfair font-bold text-chocolate text-base md:text-xl mb-3 md:mb-4">Why You'll Love This</h3>
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex items-start space-x-2 md:space-x-3">
                    <Leaf className="w-4 h-4 md:w-5 md:h-5 text-olive flex-shrink-0 mt-0.5" />
                    <span className="text-chocolate-700 text-sm md:text-base">100% Natural Ingredients - No Preservatives</span>
                  </li>
                  <li className="flex items-start space-x-2 md:space-x-3">
                    <Leaf className="w-4 h-4 md:w-5 md:h-5 text-olive flex-shrink-0 mt-0.5" />
                    <span className="text-chocolate-700 text-sm md:text-base">Handcrafted in Small Batches</span>
                  </li>
                  <li className="flex items-start space-x-2 md:space-x-3">
                    <Leaf className="w-4 h-4 md:w-5 md:h-5 text-olive flex-shrink-0 mt-0.5" />
                    <span className="text-chocolate-700 text-sm md:text-base">Traditional Recipe with Modern Quality Standards</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-8">
              {/* Ingredients */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h3 className="font-playfair font-bold text-chocolate text-base md:text-lg mb-2 md:mb-3 flex items-center space-x-2">
                  <Leaf className="w-4 h-4 md:w-5 md:h-5 text-olive" />
                  <span>Pure Ingredients</span>
                </h3>
                <p className="text-chocolate-700 leading-relaxed text-sm md:text-base">
                  {product.ingredients.join(', ')}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-6 bg-white rounded-xl shadow-md">
                <span className="text-chocolate-600 font-semibold text-sm md:text-base">Stock Status</span>
                <span className={`font-bold text-xs md:text-base ${product.stock_quantity > 0 ? 'text-olive' : 'text-red-600'}`}>
                  {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-4 md:mb-8">
              <div className="flex items-center border-2 border-ochre rounded-full bg-white shadow-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 md:px-5 md:py-3 hover:bg-ochre-50 transition-colors font-bold text-chocolate text-base md:text-lg"
                >
                  −
                </button>
                <span className="px-4 py-2 md:px-8 md:py-3 border-x-2 border-ochre font-bold text-chocolate text-base md:text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="px-3 py-2 md:px-5 md:py-3 hover:bg-ochre-50 transition-colors font-bold text-chocolate text-base md:text-lg"
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex flex-col space-y-2 md:space-y-3 mb-4 md:mb-8">
              {/* Buy Now Button - Primary CTA */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                className="w-full bg-gradient-to-r from-ochre to-ochre-600 text-white py-3 px-4 md:py-4 md:px-6 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 flex items-center justify-center space-x-2 md:space-x-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base md:text-lg group"
              >
                <Zap className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-pulse" />
                <span className="tracking-wide">BUY NOW</span>
              </button>

              {/* Add to Cart & Wishlist Row */}
              <div className="flex space-x-2 md:space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-white text-ochre py-3 px-3 md:py-4 md:px-6 rounded-full border-2 border-ochre hover:bg-ochre hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 md:space-x-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm md:text-lg"
                >
                  <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="tracking-wide">ADD TO CART</span>
                </button>

                {user && (
                  <button
                    onClick={toggleWishlist}
                    className={`px-4 py-3 md:px-6 md:py-4 rounded-full border-2 transition-all duration-300 shadow-md ${
                      isInWishlist
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-ochre-300 bg-white text-chocolate hover:border-ochre'
                    }`}
                  >
                    <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-8 border-t-2 border-ochre-100">
              <div className="text-center">
                <div className="bg-ochre-50 rounded-full p-2 md:p-4 inline-block mb-1 md:mb-2">
                  <Package className="w-5 h-5 md:w-8 md:h-8 mx-auto text-ochre" />
                </div>
                <p className="text-[10px] md:text-xs font-semibold text-chocolate-600">Premium Packaging</p>
              </div>
              <div className="text-center">
                <div className="bg-ochre-50 rounded-full p-2 md:p-4 inline-block mb-1 md:mb-2">
                  <Truck className="w-5 h-5 md:w-8 md:h-8 mx-auto text-ochre" />
                </div>
                <p className="text-[10px] md:text-xs font-semibold text-chocolate-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="bg-ochre-50 rounded-full p-2 md:p-4 inline-block mb-1 md:mb-2">
                  <Shield className="w-5 h-5 md:w-8 md:h-8 mx-auto text-ochre" />
                </div>
                <p className="text-[10px] md:text-xs font-semibold text-chocolate-600">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-12">
          <div className="lg:col-span-2">
            <ReviewSection
              product_id={product.id}
            />
          </div>
          <div>
            <RatingBreakdown productId={product.id} />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="md:hidden">
        <StickyAddToCart product={product} showThreshold={300} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
