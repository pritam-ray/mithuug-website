import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-stone-200">
          <h2 className="text-2xl font-light tracking-wide text-stone-900">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-stone-600 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors tracking-wide"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 pb-6 border-b border-stone-200 last:border-0"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-light text-stone-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-stone-600 text-sm mb-2">₹{item.price}</p>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-stone-300 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-stone-300 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 p-6 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-light text-stone-900">₹{cartTotal}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-stone-900 text-white py-4 rounded-full hover:bg-stone-800 transition-all duration-300 tracking-wide"
              >
                PROCEED TO CHECKOUT
              </button>

              <button
                onClick={clearCart}
                className="w-full text-stone-600 py-2 text-sm hover:text-stone-900 transition-colors tracking-wide"
              >
                CLEAR CART
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
