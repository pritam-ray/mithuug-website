import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/database';
import { ShoppingBag, Sparkles, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useComparison } from '../context/ComparisonContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInComparison, addToComparison, removeFromComparison, comparisonItems } = useComparison();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleToggleComparison = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  const inWishlist = isInWishlist(product.id);
  const inComparison = isInComparison(product.id);
  const comparisonFull = comparisonItems.length >= 4 && !inComparison;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group cursor-pointer bg-white border-2 border-ochre-100 rounded-2xl overflow-hidden hover:border-ochre-300 hover:shadow-2xl transition-all duration-500 block"
    >
      <div className="relative overflow-hidden aspect-square bg-ivory">
        <img
          src={product.images?.[0] || product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Overlay for Better Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {product.is_new && (
          <div className="absolute top-4 left-4 bg-ochre text-white px-4 py-2 rounded-full text-xs tracking-widest font-bold flex items-center space-x-2 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>NEW ARRIVAL</span>
          </div>
        )}

        {product.is_bestseller && !product.is_new && (
          <div className="absolute top-4 left-4 bg-gold text-white px-4 py-2 rounded-full text-xs tracking-widest font-bold shadow-lg">
            ⭐ BESTSELLER
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 z-10 ${
            inWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-chocolate-600 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            size={20} 
            className={inWishlist ? 'fill-current' : ''} 
          />
        </button>

        {/* Compare Checkbox */}
        <div className="absolute bottom-4 left-4 z-10">
          <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-lg cursor-pointer hover:bg-chocolate-50 transition-all duration-300">
            <input
              type="checkbox"
              checked={inComparison}
              onChange={handleToggleComparison}
              onClick={(e) => e.stopPropagation()}
              disabled={comparisonFull}
              className="w-4 h-4 accent-ochre cursor-pointer disabled:cursor-not-allowed"
            />
            <span className={`text-xs font-semibold ${comparisonFull ? 'text-gray-400' : 'text-chocolate-600'}`}>
              Compare
            </span>
          </label>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-ochre text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-ochre-600 shadow-xl z-10"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 bg-white">
        <h3 className="text-xl font-playfair font-bold text-chocolate mb-2 group-hover:text-ochre transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-chocolate-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-ochre-100">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-ochre font-playfair">
              ₹{product.price}
            </span>
            <span className="text-xs text-chocolate-500 tracking-wide">
              {product.weight}
            </span>
          </div>
          
          <span className="text-xs text-ochre-600 font-semibold uppercase tracking-widest group-hover:text-ochre-700 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
