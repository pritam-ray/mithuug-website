import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, ArrowLeft, Check, Minus } from 'lucide-react';
import SEO from '../components/SEO';

const ProductComparisonPage = () => {
  const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();

  if (comparisonItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-ivory">
        <SEO 
          title="Compare Products - MitthuuG"
          description="Compare your favorite products side by side"
        />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl p-16">
            <h1 className="text-3xl font-playfair font-bold text-chocolate-900 mb-4">
              No Products to Compare
            </h1>
            <p className="text-chocolate-600 mb-8">
              Add products from the shop to compare them side by side
            </p>
            <Link
              to="/shop"
              className="inline-block bg-ochre text-white px-8 py-3 rounded-lg hover:bg-ochre-600 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const comparisonRows = [
    { label: 'Product', key: 'name' },
    { label: 'Image', key: 'image' },
    { label: 'Price', key: 'price' },
    { label: 'Weight', key: 'weight' },
    { label: 'Stock', key: 'stock' },
    { label: 'New Product', key: 'is_new' },
    { label: 'Bestseller', key: 'is_bestseller' },
    { label: 'Category', key: 'category' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-ivory">
      <SEO 
        title="Product Comparison - MitthuuG"
        description={`Compare ${comparisonItems.length} products`}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-chocolate-600 hover:text-ochre mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Shop
            </Link>
            <h1 className="text-4xl font-playfair font-bold text-chocolate-900">
              Product Comparison
            </h1>
            <p className="text-chocolate-600 mt-2">
              Comparing {comparisonItems.length} product{comparisonItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          {comparisonItems.length > 0 && (
            <button
              onClick={clearComparison}
              className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-chocolate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-chocolate-900 w-48 sticky left-0 bg-chocolate-50 z-10">
                    Feature
                  </th>
                  {comparisonItems.map((product) => (
                    <th key={product.id} className="px-6 py-4 text-center min-w-[250px] relative">
                      <button
                        onClick={() => removeFromComparison(product.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        aria-label="Remove product"
                      >
                        <X size={16} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-chocolate-200">
                {comparisonRows.map((row, index) => (
                  <tr key={row.key} className={index % 2 === 0 ? 'bg-white' : 'bg-ivory'}>
                    <td className="px-6 py-4 font-semibold text-chocolate-900 sticky left-0 bg-inherit z-10">
                      {row.label}
                    </td>
                    {comparisonItems.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        {row.key === 'name' && (
                          <Link
                            to={`/product/${product.id}`}
                            className="font-semibold text-chocolate-900 hover:text-ochre transition-colors line-clamp-2"
                          >
                            {product.name}
                          </Link>
                        )}
                        {row.key === 'image' && (
                          <div className="flex justify-center">
                            <img
                              src={product.images?.[0] || product.image_url}
                              alt={product.name}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        {row.key === 'price' && (
                          <span className="text-2xl font-bold text-ochre">
                            ₹{product.price}
                          </span>
                        )}
                        {row.key === 'weight' && (
                          <span className="text-chocolate-600">{product.weight}</span>
                        )}
                        {row.key === 'stock' && (
                          <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of Stock'}
                          </span>
                        )}
                        {row.key === 'is_new' && (
                          <div className="flex justify-center">
                            {product.is_new ? (
                              <Check className="text-green-600" size={24} />
                            ) : (
                              <Minus className="text-gray-400" size={24} />
                            )}
                          </div>
                        )}
                        {row.key === 'is_bestseller' && (
                          <div className="flex justify-center">
                            {product.is_bestseller ? (
                              <Check className="text-green-600" size={24} />
                            ) : (
                              <Minus className="text-gray-400" size={24} />
                            )}
                          </div>
                        )}
                        {row.key === 'category' && (
                          <span className="capitalize text-chocolate-600">
                            {product.category?.replace(/-/g, ' ')}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Add to Cart Row */}
                <tr className="bg-chocolate-50">
                  <td className="px-6 py-4 font-semibold text-chocolate-900 sticky left-0 bg-chocolate-50 z-10">
                    Action
                  </td>
                  {comparisonItems.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-center">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className="flex items-center justify-center gap-2 w-full bg-ochre text-white px-6 py-3 rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag size={20} />
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="block mt-2 text-ochre hover:text-ochre-600 text-sm font-semibold"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add More Products */}
        {comparisonItems.length < 4 && (
          <div className="mt-8 text-center">
            <p className="text-chocolate-600 mb-4">
              You can compare up to 4 products. {4 - comparisonItems.length} slot{4 - comparisonItems.length !== 1 ? 's' : ''} remaining.
            </p>
            <Link
              to="/shop"
              className="inline-block text-ochre hover:text-ochre-600 font-semibold"
            >
              Add More Products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductComparisonPage;
