import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, X, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

const WishlistPage = () => {
  const { user } = useAuth();
  const { wishlistItems, loading, removeFromWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-12 bg-ivory">
        <SEO 
          title="Wishlist - MitthuuG"
          description="View your saved products"
        />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Heart size={64} className="mx-auto text-chocolate-300 mb-4" />
          <h1 className="text-3xl font-playfair font-bold text-chocolate-900 mb-4">
            Your Wishlist
          </h1>
          <p className="text-chocolate-600 mb-8">
            Please login to view your wishlist
          </p>
          <Link
            to="/login"
            className="inline-block bg-ochre text-white px-8 py-3 rounded-lg hover:bg-ochre-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-12 bg-ivory flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-ochre" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 bg-ivory">
      <SEO 
        title="My Wishlist - MitthuuG"
        description="Your saved favorite products"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-chocolate-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-chocolate-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center">
            <Heart size={64} className="mx-auto text-chocolate-300 mb-4" />
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-chocolate-600 mb-8">
              Start adding products you love!
            </p>
            <Link
              to="/shop"
              className="inline-block bg-ochre text-white px-8 py-3 rounded-lg hover:bg-ochre-600 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative group"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X size={20} className="text-red-500" />
                </button>

                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-square overflow-hidden bg-ivory">
                    <img
                      src={product.images?.[0] || product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-playfair font-bold text-chocolate-900 mb-2 group-hover:text-ochre transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-ochre">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-chocolate-600">
                      {product.weight}
                    </span>
                  </div>

                  {/* Stock Status */}
                  {product.stock_quantity > 0 ? (
                    <span className="text-sm text-green-600 mb-3 block">
                      In Stock ({product.stock_quantity} available)
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 mb-3 block">
                      Out of Stock
                    </span>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0}
                      className="w-full flex items-center justify-center gap-2 bg-ochre text-white py-3 rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={20} />
                      Add to Cart
                    </button>
                    
                    <Link
                      to={`/product/${product.id}`}
                      className="w-full block text-center border-2 border-chocolate-300 text-chocolate-900 py-3 rounded-lg hover:border-ochre hover:text-ochre transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_new && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      NEW
                    </span>
                  )}
                  {product.is_bestseller && (
                    <span className="bg-gold text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ BESTSELLER
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-block text-ochre hover:text-ochre-600 font-semibold"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
