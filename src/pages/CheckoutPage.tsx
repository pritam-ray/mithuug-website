import React, { useState } from 'react';import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';import { useNavigate } from 'react-router-dom';

import { useCart } from '../context/CartContext';import { useCart } from '../context/CartContext';

import { useAuth } from '../context/AuthContext';import { useAuth } from '../context/AuthContext';

import { import { supabase } from '../lib/supabase';

  CreditCard, Lock, ShoppingBag, MapPin, User, Phone, import { Address } from '../types/database';

  Mail, Home, CheckCircle2, Leaf, Gift, Truck import { CreditCard, Lock } from 'lucide-react';

} from 'lucide-react';

const CheckoutPage: React.FC = () => {

interface AddressForm {  const navigate = useNavigate();

  full_name: string;  const { cart, cartTotal, clearCart } = useCart();

  email: string;  const { user, profile } = useAuth();

  phone: string;  const [processing, setProcessing] = useState(false);

  address_line1: string;

  address_line2: string;  const [shippingAddress, setShippingAddress] = useState<Address>({

  city: string;    name: profile?.full_name || '',

  state: string;    line1: profile?.default_shipping_address?.line1 || '',

  postal_code: string;    line2: profile?.default_shipping_address?.line2 || '',

  country: string;    city: profile?.default_shipping_address?.city || '',

}    state: profile?.default_shipping_address?.state || '',

    postal_code: profile?.default_shipping_address?.postal_code || '',

const CheckoutPage: React.FC = () => {    country: 'India',

  const navigate = useNavigate();    phone: profile?.phone || '',

  const { cart, cartTotal, clearCart } = useCart();  });

  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);  const [billingAddress, setBillingAddress] = useState<Address>({

  const [orderSuccess, setOrderSuccess] = useState(false);    name: profile?.full_name || '',

  const [sameAsShipping, setSameAsShipping] = useState(true);    line1: profile?.default_billing_address?.line1 || '',

    line2: profile?.default_billing_address?.line2 || '',

  const [shippingAddress, setShippingAddress] = useState<AddressForm>({    city: profile?.default_billing_address?.city || '',

    full_name: '',    state: profile?.default_billing_address?.state || '',

    email: '',    postal_code: profile?.default_billing_address?.postal_code || '',

    phone: '',    country: 'India',

    address_line1: '',    phone: profile?.phone || '',

    address_line2: '',  });

    city: '',

    state: '',  const [sameAsShipping, setSameAsShipping] = useState(true);

    postal_code: '',

    country: 'India',  const handleSubmit = async (e: React.FormEvent) => {

  });    e.preventDefault();

    if (!user || cart.length === 0) return;

  const [billingAddress, setBillingAddress] = useState<AddressForm>({

    full_name: '',    setProcessing(true);

    email: '',    try {

    phone: '',      const orderNumber = `MG-${Date.now()}`;

    address_line1: '',

    address_line2: '',      const { data: order, error: orderError } = await supabase

    city: '',        .from('orders')

    state: '',        .insert([

    postal_code: '',          {

    country: 'India',            user_id: user.id,

  });            order_number: orderNumber,

            status: 'pending',

  const [paymentMethod, setPaymentMethod] = useState('cod');            total_amount: cartTotal + 50,

            shipping_address: shippingAddress,

  const shippingCost = cartTotal >= 500 ? 0 : 60;            billing_address: sameAsShipping ? shippingAddress : billingAddress,

  const finalTotal = cartTotal + shippingCost;          },

        ])

  const handleSubmit = async (e: React.FormEvent) => {        .select()

    e.preventDefault();        .single();

    

    if (cart.length === 0) {      if (orderError) throw orderError;

      alert('Your cart is empty!');

      return;      const orderItems = cart.map((item) => ({

    }        order_id: order.id,

        product_id: item.id,

    setProcessing(true);        quantity: item.quantity,

        price_at_time: item.price,

    // Simulate order processing      }));

    setTimeout(() => {

      setProcessing(false);      const { error: itemsError } = await supabase

      setOrderSuccess(true);        .from('order_items')

      clearCart();        .insert(orderItems);

      

      // Redirect to success page after 3 seconds      if (itemsError) throw itemsError;

      setTimeout(() => {

        navigate('/');      clearCart();

      }, 3000);      navigate(`/account/orders/${order.id}`);

    }, 2000);    } catch (error) {

  };      console.error('Error creating order:', error);

      alert('Failed to create order. Please try again.');

  if (cart.length === 0 && !orderSuccess) {    } finally {

    return (      setProcessing(false);

      <div className="min-h-screen bg-ivory-50 py-20">    }

        <div className="max-w-2xl mx-auto px-4 text-center">  };

          <div className="bg-white rounded-3xl shadow-lg p-12">

            <ShoppingBag className="w-20 h-20 text-ochre-300 mx-auto mb-6" />  if (!user) {

            <h2 className="text-3xl font-playfair font-bold text-chocolate-900 mb-4">    return (

              Your cart is empty      <div className="min-h-screen pt-20 flex items-center justify-center">

            </h2>        <div className="text-center">

            <p className="text-chocolate-600 mb-8">          <h2 className="text-2xl text-stone-900 mb-4">Please sign in to checkout</h2>

              Add some delicious GUD treats to your cart before checking out!          <button

            </p>            onClick={() => navigate('/login')}

            <Link            className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"

              to="/shop"          >

              className="inline-block bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-8 py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold"            Sign In

            >          </button>

              Start Shopping        </div>

            </Link>      </div>

          </div>    );

        </div>  }

      </div>

    );  if (cart.length === 0) {

  }    return (

      <div className="min-h-screen pt-20 flex items-center justify-center">

  if (orderSuccess) {        <div className="text-center">

    return (          <h2 className="text-2xl text-stone-900 mb-4">Your cart is empty</h2>

      <div className="min-h-screen bg-ivory-50 py-20">          <button

        <div className="max-w-2xl mx-auto px-4 text-center">            onClick={() => navigate('/shop')}

          <div className="bg-white rounded-3xl shadow-lg p-12">            className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"

            <div className="w-24 h-24 bg-gradient-to-r from-olive-400 to-olive-500 rounded-full mx-auto mb-6 flex items-center justify-center">          >

              <CheckCircle2 className="w-12 h-12 text-white" />            Continue Shopping

            </div>          </button>

            <h2 className="text-3xl font-playfair font-bold text-chocolate-900 mb-4">        </div>

              Order Placed Successfully! 🎉      </div>

            </h2>    );

            <p className="text-chocolate-600 mb-2">  }

              Thank you for choosing MitthuuG!

            </p>  const shippingCost = 50;

            <p className="text-sm text-chocolate-500 mb-8">  const total = cartTotal + shippingCost;

              Your GUD vibes are on the way. We'll send you a confirmation email shortly.

            </p>  return (

            <div className="bg-ochre-50 border-2 border-ochre-200 rounded-2xl p-6 mb-8">    <div className="min-h-screen pt-20 bg-stone-50">

              <p className="text-sm text-chocolate-700">      <div className="max-w-7xl mx-auto px-4 py-12">

                Order Number: <span className="font-bold text-ochre-600">MG-{Date.now()}</span>        <h1 className="text-4xl font-light tracking-tight text-stone-900 mb-12">

              </p>          Checkout

            </div>        </h1>

            <Link

              to="/"        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">

              className="inline-block bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-8 py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold"          <div className="lg:col-span-2 space-y-8">

            >            <div className="bg-white rounded-lg p-8 shadow-sm">

              Back to Home              <h2 className="text-2xl font-light text-stone-900 mb-6">

            </Link>                Shipping Address

          </div>              </h2>

        </div>              <div className="grid grid-cols-2 gap-4">

      </div>                <div className="col-span-2">

    );                  <label className="block text-sm text-stone-700 mb-2">Full Name</label>

  }                  <input

                    type="text"

  return (                    required

    <div className="min-h-screen bg-ivory-50 py-12">                    value={shippingAddress.name}

      <div className="max-w-7xl mx-auto px-4">                    onChange={(e) =>

        {/* Header */}                      setShippingAddress({ ...shippingAddress, name: e.target.value })

        <div className="text-center mb-12">                    }

          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate-900 mb-3">                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

            Checkout                  />

          </h1>                </div>

          <p className="text-chocolate-600">                <div className="col-span-2">

            Complete your order in just a few steps                  <label className="block text-sm text-stone-700 mb-2">

          </p>                    Address Line 1

        </div>                  </label>

                  <input

        <form onSubmit={handleSubmit}>                    type="text"

          <div className="grid lg:grid-cols-3 gap-8">                    required

            {/* Left Column - Forms */}                    value={shippingAddress.line1}

            <div className="lg:col-span-2 space-y-6">                    onChange={(e) =>

              {/* Shipping Address */}                      setShippingAddress({ ...shippingAddress, line1: e.target.value })

              <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-ochre-100">                    }

                <div className="flex items-center space-x-3 mb-6">                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                  <div className="w-10 h-10 bg-ochre-100 rounded-full flex items-center justify-center">                  />

                    <MapPin className="w-5 h-5 text-ochre-600" />                </div>

                  </div>                <div className="col-span-2">

                  <h2 className="text-2xl font-playfair font-bold text-chocolate-900">                  <label className="block text-sm text-stone-700 mb-2">

                    Shipping Address                    Address Line 2 (Optional)

                  </h2>                  </label>

                </div>                  <input

                    type="text"

                <div className="grid md:grid-cols-2 gap-6">                    value={shippingAddress.line2}

                  <div>                    onChange={(e) =>

                    <label className="block text-sm font-medium text-chocolate-700 mb-2">                      setShippingAddress({ ...shippingAddress, line2: e.target.value })

                      <User className="w-4 h-4 inline mr-2" />                    }

                      Full Name *                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                    </label>                  />

                    <input                </div>

                      type="text"                <div>

                      required                  <label className="block text-sm text-stone-700 mb-2">City</label>

                      value={shippingAddress.full_name}                  <input

                      onChange={(e) => setShippingAddress({ ...shippingAddress, full_name: e.target.value })}                    type="text"

                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-colors"                    required

                      placeholder="Rajesh Kumar"                    value={shippingAddress.city}

                    />                    onChange={(e) =>

                  </div>                      setShippingAddress({ ...shippingAddress, city: e.target.value })

                    }

                  <div>                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                    <label className="block text-sm font-medium text-chocolate-700 mb-2">                  />

                      <Mail className="w-4 h-4 inline mr-2" />                </div>

                      Email *                <div>

                    </label>                  <label className="block text-sm text-stone-700 mb-2">State</label>

                    <input                  <input

                      type="email"                    type="text"

                      required                    required

                      value={shippingAddress.email}                    value={shippingAddress.state}

                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}                    onChange={(e) =>

                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-colors"                      setShippingAddress({ ...shippingAddress, state: e.target.value })

                      placeholder="rajesh@example.com"                    }

                    />                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                  </div>                  />

                </div>

                  <div>                <div>

                    <label className="block text-sm font-medium text-chocolate-700 mb-2">                  <label className="block text-sm text-stone-700 mb-2">

                      <Phone className="w-4 h-4 inline mr-2" />                    Postal Code

                      Phone Number *                  </label>

                    </label>                  <input

                    <input                    type="text"

                      type="tel"                    required

                      required                    value={shippingAddress.postal_code}

                      value={shippingAddress.phone}                    onChange={(e) =>

                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}                      setShippingAddress({

                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-colors"                        ...shippingAddress,

                      placeholder="+91 98765 43210"                        postal_code: e.target.value,

                    />                      })

                  </div>                    }

                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                  <div>                  />

                    <label className="block text-sm font-medium text-chocolate-700 mb-2">                </div>

                      <Home className="w-4 h-4 inline mr-2" />                <div>

                      Postal Code *                  <label className="block text-sm text-stone-700 mb-2">Phone</label>

                    </label>                  <input

                    <input                    type="tel"

                      type="text"                    required

                      required                    value={shippingAddress.phone}

                      value={shippingAddress.postal_code}                    onChange={(e) =>

                      onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}                      setShippingAddress({ ...shippingAddress, phone: e.target.value })

                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-colors"                    }

                      placeholder="400001"                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                    />                  />

                  </div>                </div>

              </div>

                  <div className="md:col-span-2">            </div>

                    <label className="block text-sm font-medium text-chocolate-700 mb-2">

                      Address Line 1 *            <div className="bg-white rounded-lg p-8 shadow-sm">

                    </label>              <div className="flex items-center justify-between mb-6">

                    <input                <h2 className="text-2xl font-light text-stone-900">

                      type="text"                  Billing Address

                      required                </h2>

                      value={shippingAddress.address_line1}                <label className="flex items-center space-x-2 cursor-pointer">

                      onChange={(e) => setShippingAddress({ ...shippingAddress, address_line1: e.target.value })}                  <input

                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-colors"                    type="checkbox"

                      placeholder="123, MG Road"                    checked={sameAsShipping}

                    />                    onChange={(e) => setSameAsShipping(e.target.checked)}

                  </div>                    className="w-4 h-4"

                  />

                  <div className="md:col-span-2">                  <span className="text-sm text-stone-600">Same as shipping</span>

                    <label className="block text-sm font-medium text-chocolate-700 mb-2">                </label>

                      Address Line 2              </div>

                    </label>

                    <input              {!sameAsShipping && (

                      type="text"                <div className="grid grid-cols-2 gap-4">

                      value={shippingAddress.address_line2}                  <div className="col-span-2">

                      onChange={(e) => setShippingAddress({ ...shippingAddress, address_line2: e.target.value })}                    <label className="block text-sm text-stone-700 mb-2">

                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-colors"                      Full Name

                      placeholder="Near Fountain Circle"                    </label>

                    />                    <input

                  </div>                      type="text"

                      required

                  <div>                      value={billingAddress.name}

                    <label className="block text-sm font-medium text-chocolate-700 mb-2">                      onChange={(e) =>

                      City *                        setBillingAddress({ ...billingAddress, name: e.target.value })

                    </label>                      }

                    <input                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                      type="text"                    />

                      required                  </div>

                      value={shippingAddress.city}                  <div className="col-span-2">

                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}                    <label className="block text-sm text-stone-700 mb-2">

                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-colors"                      Address Line 1

                      placeholder="Mumbai"                    </label>

                    />                    <input

                  </div>                      type="text"

                      required

                  <div>                      value={billingAddress.line1}

                    <label className="block text-sm font-medium text-chocolate-700 mb-2">                      onChange={(e) =>

                      State *                        setBillingAddress({ ...billingAddress, line1: e.target.value })

                    </label>                      }

                    <select                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                      required                    />

                      value={shippingAddress.state}                  </div>

                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}                  <div>

                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-colors"                    <label className="block text-sm text-stone-700 mb-2">City</label>

                    >                    <input

                      <option value="">Select State</option>                      type="text"

                      <option value="Maharashtra">Maharashtra</option>                      required

                      <option value="Karnataka">Karnataka</option>                      value={billingAddress.city}

                      <option value="Delhi">Delhi</option>                      onChange={(e) =>

                      <option value="Gujarat">Gujarat</option>                        setBillingAddress({ ...billingAddress, city: e.target.value })

                      <option value="Tamil Nadu">Tamil Nadu</option>                      }

                      <option value="Rajasthan">Rajasthan</option>                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                      <option value="West Bengal">West Bengal</option>                    />

                      <option value="Uttar Pradesh">Uttar Pradesh</option>                  </div>

                    </select>                  <div>

                  </div>                    <label className="block text-sm text-stone-700 mb-2">State</label>

                </div>                    <input

              </div>                      type="text"

                      required

              {/* Payment Method */}                      value={billingAddress.state}

              <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-ochre-100">                      onChange={(e) =>

                <div className="flex items-center space-x-3 mb-6">                        setBillingAddress({ ...billingAddress, state: e.target.value })

                  <div className="w-10 h-10 bg-ochre-100 rounded-full flex items-center justify-center">                      }

                    <CreditCard className="w-5 h-5 text-ochre-600" />                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                  </div>                    />

                  <h2 className="text-2xl font-playfair font-bold text-chocolate-900">                  </div>

                    Payment Method                  <div>

                  </h2>                    <label className="block text-sm text-stone-700 mb-2">

                </div>                      Postal Code

                    </label>

                <div className="space-y-4">                    <input

                  <label className="flex items-center p-6 border-2 border-ochre-200 rounded-2xl cursor-pointer hover:border-ochre-400 transition-colors has-[:checked]:border-ochre-500 has-[:checked]:bg-ochre-50">                      type="text"

                    <input                      required

                      type="radio"                      value={billingAddress.postal_code}

                      name="payment"                      onChange={(e) =>

                      value="cod"                        setBillingAddress({

                      checked={paymentMethod === 'cod'}                          ...billingAddress,

                      onChange={(e) => setPaymentMethod(e.target.value)}                          postal_code: e.target.value,

                      className="w-5 h-5 text-ochre-600 focus:ring-ochre-500"                        })

                    />                      }

                    <div className="ml-4 flex-1">                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                      <p className="font-bold text-chocolate-900">Cash on Delivery (COD)</p>                    />

                      <p className="text-sm text-chocolate-600">Pay when you receive your order</p>                  </div>

                    </div>                  <div>

                    <Truck className="w-6 h-6 text-ochre-600" />                    <label className="block text-sm text-stone-700 mb-2">Phone</label>

                  </label>                    <input

                      type="tel"

                  <label className="flex items-center p-6 border-2 border-ochre-200 rounded-2xl cursor-pointer hover:border-ochre-400 transition-colors has-[:checked]:border-ochre-500 has-[:checked]:bg-ochre-50">                      required

                    <input                      value={billingAddress.phone}

                      type="radio"                      onChange={(e) =>

                      name="payment"                        setBillingAddress({ ...billingAddress, phone: e.target.value })

                      value="online"                      }

                      checked={paymentMethod === 'online'}                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                      onChange={(e) => setPaymentMethod(e.target.value)}                    />

                      className="w-5 h-5 text-ochre-600 focus:ring-ochre-500"                  </div>

                    />                </div>

                    <div className="ml-4 flex-1">              )}

                      <p className="font-bold text-chocolate-900">Online Payment</p>            </div>

                      <p className="text-sm text-chocolate-600">UPI / Card / Net Banking</p>

                    </div>            <div className="bg-white rounded-lg p-8 shadow-sm">

                    <Lock className="w-6 h-6 text-olive-600" />              <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">

                  </label>                <CreditCard className="w-6 h-6 mr-3" />

                </div>                Payment Method

              </div>              </h2>

            </div>              <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-8 text-center">

                <Lock className="w-12 h-12 mx-auto mb-4 text-stone-400" />

            {/* Right Column - Order Summary */}                <p className="text-stone-600 mb-2">Payment processing coming soon</p>

            <div className="lg:col-span-1">                <p className="text-sm text-stone-500">

              <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-ochre-100 sticky top-8">                  For now, orders will be placed with Cash on Delivery

                <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-6">                </p>

                  Order Summary              </div>

                </h2>            </div>

          </div>

                {/* Cart Items */}

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">          <div className="lg:col-span-1">

                  {cart.map((item) => (            <div className="bg-white rounded-lg p-8 shadow-sm sticky top-24">

                    <div key={item.id} className="flex space-x-3 pb-4 border-b border-ochre-100">              <h2 className="text-2xl font-light text-stone-900 mb-6">Order Summary</h2>

                      <img

                        src={item.image_url}              <div className="space-y-4 mb-6">

                        alt={item.name}                {cart.map((item) => (

                        className="w-16 h-16 object-cover rounded-xl bg-ivory-100"                  <div key={item.id} className="flex space-x-4">

                      />                    <img

                      <div className="flex-1">                      src={item.image_url}

                        <p className="font-medium text-chocolate-900 text-sm">{item.name}</p>                      alt={item.name}

                        <p className="text-xs text-chocolate-600">Qty: {item.quantity}</p>                      className="w-16 h-16 object-cover rounded-lg"

                        <p className="text-sm font-bold text-ochre-600">₹{item.price * item.quantity}</p>                    />

                      </div>                    <div className="flex-1">

                    </div>                      <p className="text-sm text-stone-900">{item.name}</p>

                  ))}                      <p className="text-xs text-stone-600">Qty: {item.quantity}</p>

                </div>                    </div>

                    <p className="text-sm text-stone-900">

                {/* Pricing Details */}                      ₹{item.price * item.quantity}

                <div className="space-y-3 mb-6 pb-6 border-b-2 border-ochre-200">                    </p>

                  <div className="flex justify-between text-chocolate-700">                  </div>

                    <span>Subtotal</span>                ))}

                    <span className="font-medium">₹{cartTotal}</span>              </div>

                  </div>

                  <div className="flex justify-between text-chocolate-700">              <div className="border-t border-stone-200 pt-4 space-y-2 mb-6">

                    <span>Shipping</span>                <div className="flex justify-between text-stone-600">

                    <span className="font-medium">                  <span>Subtotal</span>

                      {shippingCost === 0 ? (                  <span>₹{cartTotal}</span>

                        <span className="text-olive-600 font-bold">FREE 🎉</span>                </div>

                      ) : (                <div className="flex justify-between text-stone-600">

                        `₹${shippingCost}`                  <span>Shipping</span>

                      )}                  <span>₹{shippingCost}</span>

                    </span>                </div>

                  </div>                <div className="flex justify-between text-lg font-medium text-stone-900 pt-2 border-t border-stone-200">

                  {cartTotal < 500 && (                  <span>Total</span>

                    <p className="text-xs text-chocolate-500 italic">                  <span>₹{total}</span>

                      Add ₹{500 - cartTotal} more for FREE shipping                </div>

                    </p>              </div>

                  )}

                </div>              <button

                type="submit"

                {/* Total */}                disabled={processing}

                <div className="flex justify-between items-baseline mb-6">                className="w-full bg-stone-900 text-white py-4 rounded-full hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"

                  <span className="text-lg font-bold text-chocolate-900">Total</span>              >

                  <span className="text-3xl font-playfair font-bold text-ochre-600">                {processing ? 'Processing...' : 'PLACE ORDER'}

                    ₹{finalTotal}              </button>

                  </span>

                </div>              <p className="text-xs text-stone-500 text-center mt-4">

                By placing your order, you agree to our terms and conditions

                {/* Place Order Button */}              </p>

                <button            </div>

                  type="submit"          </div>

                  disabled={processing}        </form>

                  className="w-full bg-gradient-to-r from-ochre-500 to-ochre-600 text-white py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"      </div>

                >    </div>

                  {processing ? (  );

                    <span className="flex items-center justify-center">};

                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">

                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />export default CheckoutPage;

                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-ochre-100">
                  <div className="text-center">
                    <Lock className="w-5 h-5 text-olive-600 mx-auto mb-1" />
                    <p className="text-xs text-chocolate-600">Secure</p>
                  </div>
                  <div className="text-center">
                    <Leaf className="w-5 h-5 text-olive-600 mx-auto mb-1" />
                    <p className="text-xs text-chocolate-600">Natural</p>
                  </div>
                  <div className="text-center">
                    <Gift className="w-5 h-5 text-ochre-600 mx-auto mb-1" />
                    <p className="text-xs text-chocolate-600">FSSAI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
