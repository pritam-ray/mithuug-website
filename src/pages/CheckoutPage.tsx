import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Address } from '../types/database';
import { CreditCard, Lock } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [processing, setProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: profile?.full_name || '',
    line1: profile?.default_shipping_address?.line1 || '',
    line2: profile?.default_shipping_address?.line2 || '',
    city: profile?.default_shipping_address?.city || '',
    state: profile?.default_shipping_address?.state || '',
    postal_code: profile?.default_shipping_address?.postal_code || '',
    country: 'India',
    phone: profile?.phone || '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    name: profile?.full_name || '',
    line1: profile?.default_billing_address?.line1 || '',
    line2: profile?.default_billing_address?.line2 || '',
    city: profile?.default_billing_address?.city || '',
    state: profile?.default_billing_address?.state || '',
    postal_code: profile?.default_billing_address?.postal_code || '',
    country: 'India',
    phone: profile?.phone || '',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cart.length === 0) return;

    setProcessing(true);
    try {
      const orderNumber = `MG-${Date.now()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            order_number: orderNumber,
            status: 'pending',
            total_amount: cartTotal + 50,
            shipping_address: shippingAddress,
            billing_address: sameAsShipping ? shippingAddress : billingAddress,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      navigate(`/account/orders/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-stone-900 mb-4">Please sign in to checkout</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-stone-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = 50;
  const total = cartTotal + shippingCost;

  return (
    <div className="min-h-screen pt-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-light tracking-tight text-stone-900 mb-12">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-light text-stone-900 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-stone-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.name}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-stone-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.line1}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, line1: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-stone-700 mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.line2}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, line2: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-2">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postal_code}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postal_code: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-stone-900">
                  Billing Address
                </h2>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-stone-600">Same as shipping</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-stone-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={billingAddress.name}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-stone-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      required
                      value={billingAddress.line1}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, line1: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.city}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, city: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.state}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, state: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={billingAddress.postal_code}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          postal_code: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={billingAddress.phone}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-3" />
                Payment Method
              </h2>
              <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-8 text-center">
                <Lock className="w-12 h-12 mx-auto mb-4 text-stone-400" />
                <p className="text-stone-600 mb-2">Payment processing coming soon</p>
                <p className="text-sm text-stone-500">
                  For now, orders will be placed with Cash on Delivery
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-8 shadow-sm sticky top-24">
              <h2 className="text-2xl font-light text-stone-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-stone-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>₹{shippingCost}</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-stone-900 text-white py-4 rounded-full hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
              >
                {processing ? 'Processing...' : 'PLACE ORDER'}
              </button>

              <p className="text-xs text-stone-500 text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
