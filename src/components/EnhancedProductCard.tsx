import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../data/products-enhanced';
import { formatPrice, getDiscountedPrice, isLowStock, isOutOfStock } from '../data/products-enhanced';

interface EnhancedProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const discountedPrice = getDiscountedPrice(product);
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
  const lowStock = isLowStock(product);
  const outOfStock = isOutOfStock(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!outOfStock && onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card-product group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-product-id={product.id}
      data-product-sku={product.sku}
      aria-label={`View ${product.title}`}
    >
      {/* Image Container */}
      <div className="relative aspect-product overflow-hidden bg-ivory-100 rounded-t-xl">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.is_new && (
            <span className="badge-new shadow-md">New</span>
          )}
          {hasDiscount && (
            <span className="badge-sale shadow-md">
              {product.discount_percentage}% OFF
            </span>
          )}
          {outOfStock && (
            <span className="badge-out-of-stock shadow-md">Out of Stock</span>
          )}
          {lowStock && !outOfStock && (
            <span className="badge bg-orange-500 text-white shadow-md">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ochre"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-chocolate-600'
            }`}
          />
        </button>

        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={product.alt_text}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Image Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-ivory-200 animate-pulse" />
        )}

        {/* Hover Overlay Actions */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-chocolate-900/80 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex gap-2 w-full">
            <button
              onClick={handleQuickView}
              className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2"
              aria-label="Quick view product"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </button>
            {!outOfStock && (
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 bg-white rounded-b-xl">
        {/* Category */}
        <p className="text-xs text-chocolate-500 font-medium uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Title */}
        <h3 className="font-playfair text-lg font-semibold text-chocolate-900 mb-2 line-clamp-2 group-hover:text-ochre transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-gold text-gold'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-chocolate-600">
            {product.rating} ({product.review_count})
          </span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-chocolate-600 mb-3 line-clamp-2">
          {product.short_desc}
        </p>

        {/* Weight/Serves */}
        <p className="text-xs text-chocolate-500 mb-3">
          {product.weight} • {product.serves}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-ochre">
            {formatPrice(discountedPrice)}
          </span>
          {hasDiscount && product.original_price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {lowStock && !outOfStock && (
          <p className="text-sm text-orange-600 font-medium mb-2">
            ⚠️ Only {product.stock_quantity} left in stock!
          </p>
        )}

        {/* Add to Cart Button (Mobile) */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
            outOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          } md:hidden`}
          aria-label={outOfStock ? 'Out of stock' : 'Add to cart'}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Product Tags (for SEO/Analytics) */}
      <div className="sr-only">
        {product.tags.map((tag) => (
          <span key={tag} data-tag={tag} />
        ))}
      </div>
    </Link>
  );
};

export default EnhancedProductCard;
