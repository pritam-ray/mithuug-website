import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-ivory-50 shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-ochre-500 to-ochre-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-playfair font-bold text-white">
                Your Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-ochre-100 transition-colors p-1 rounded-full hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {cart.length > 0 && (
            <p className="text-ochre-100 text-sm mt-2">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-ochre-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-ochre-300" />
              </div>
              <h3 className="text-xl font-playfair text-chocolate-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-chocolate-600 mb-6 text-sm">
                Add some GUD vibes to your cart!
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-ochre-500 to-ochre-600 text-white rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow border border-ochre-100"
                >
                  <div className="flex space-x-4">
                    <div className="relative">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl bg-ivory-100"
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -top-2 -right-2 bg-ochre-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-playfair font-semibold text-chocolate-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-ochre-600 font-bold mb-3">
                        ₹{item.price} <span className="text-chocolate-400 text-xs font-normal">each</span>
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 bg-ochre-50 rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 border-2 border-ochre-300 rounded-full flex items-center justify-center hover:bg-ochre-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4 text-ochre-700" />
                          </button>

                          <span className="text-sm font-bold w-8 text-center text-chocolate-900">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border-2 border-ochre-300 rounded-full flex items-center justify-center hover:bg-ochre-100 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-ochre-700" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-chocolate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-xs text-chocolate-600 mt-2 font-medium">
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Total & Checkout */}
            <div className="border-t-2 border-ochre-200 bg-white p-6 space-y-4">
              {/* Free Shipping Message */}
              {cartTotal < 500 && (
                <div className="bg-ochre-50 border border-ochre-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-chocolate-700">
                    Add <span className="font-bold text-ochre-600">₹{500 - cartTotal}</span> more for FREE shipping! 🚚
                  </p>
                </div>
              )}
              
              {cartTotal >= 500 && (
                <div className="bg-olive-50 border border-olive-300 rounded-lg p-3 text-center flex items-center justify-center space-x-2">
                  <Gift className="w-4 h-4 text-olive-600" />
                  <p className="text-sm text-olive-700 font-medium">
                    You qualify for FREE shipping! 🎉
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-baseline pb-4 border-b border-ochre-200">
                <span className="text-chocolate-600 font-medium">Subtotal</span>
                <div className="text-right">
                  <span className="text-2xl font-playfair font-bold text-ochre-600">
                    ₹{cartTotal}
                  </span>
                  <p className="text-xs text-chocolate-500">Shipping calculated at checkout</p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-ochre-500 to-ochre-600 text-white py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg tracking-wide"
              >
                Proceed to Checkout →
              </button>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full text-chocolate-500 py-2 text-sm hover:text-chocolate-700 transition-colors tracking-wide font-medium hover:bg-chocolate-50 rounded-lg"
              >
                Clear Cart
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-ochre-100">
                <div className="text-center">
                  <p className="text-xs text-chocolate-600">🔒 Secure</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-chocolate-600">🚚 Fast Ship</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-chocolate-600">♻️ Natural</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
