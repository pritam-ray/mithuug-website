import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/database';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

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
