import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Address } from '../types/database';
import { CreditCard, Lock, Truck, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { 
  createRazorpayOrder,
  verifyRazorpayPayment,
  initiateRazorpayPayment, 
  isCODEligible, 
  calculateCODFee
} from '../lib/payment';
import { 
  isValidPincode, 
  getDeliveryEstimate, 
  calculateShippingFee,
  formatDeliveryDateRange
} from '../lib/shipping';
import { applyPromoCode, getActivePromoCodes } from '../lib/promos';
import { trackBeginCheckout } from '../lib/analytics';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [processing, setProcessing] = useState(false);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>('razorpay');
  
  // Shipping state
  const [shippingFee, setShippingFee] = useState(0);
  const [deliveryEstimate, setDeliveryEstimate] = useState<any>(null);
  
  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [showPromos, setShowPromos] = useState(false);

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

  // Calculate shipping when pincode changes
  useEffect(() => {
    const pincode = shippingAddress.postal_code;
    if (pincode && isValidPincode(pincode)) {
      const fee = calculateShippingFee(pincode, cartTotal);
      const estimate = getDeliveryEstimate(pincode, cartTotal);
      setShippingFee(fee);
      setDeliveryEstimate(estimate);
    } else if (pincode) {
      setShippingFee(0);
      setDeliveryEstimate(null);
    }
  }, [shippingAddress.postal_code, cartTotal]);

  // Track checkout initiation
  useEffect(() => {
    if (cart.length > 0) {
      trackBeginCheckout(
        cart.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        cartTotal
      );
    }
  }, []);

  // Handle promo code application
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    const result = applyPromoCode(
      promoCode.trim(),
      cartTotal,
      true, // Assume first order for now (would check in production)
      cart.map(item => item.id)
    );

    if (result.valid) {
      setAppliedPromo(result);
      setPromoError('');
    } else {
      setPromoError(result.message);
      setAppliedPromo(null);
    }
  };

  // Remove promo code
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  // Calculate totals
  const discount = appliedPromo?.discount || 0;
  const codFee = paymentMethod === 'cod' ? calculateCODFee(cartTotal) : 0;
  const finalShippingFee = appliedPromo?.freeShipping ? 0 : shippingFee;
  const orderTotal = cartTotal - discount + finalShippingFee + codFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cart.length === 0) return;

    // Validate pincode
    if (!shippingAddress.postal_code || !isValidPincode(shippingAddress.postal_code)) {
      alert('Please enter a valid Indian pincode');
      return;
    }

    // Validate COD eligibility if COD selected
    if (paymentMethod === 'cod' && !isCODEligible(cartTotal, shippingAddress.postal_code)) {
      alert(`COD is not available for this order. Min: ₹99, Max: ₹10,000`);
      return;
    }

    setProcessing(true);

    try {
      const orderNumber = `MG-${Date.now()}`;

      // Create order in database first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            order_number: orderNumber,
            status: paymentMethod === 'cod' ? 'pending' : 'payment_pending',
            total_amount: orderTotal,
            subtotal_amount: cartTotal,
            shipping_address: shippingAddress,
            billing_address: sameAsShipping ? shippingAddress : billingAddress,
            payment_method: paymentMethod,
            payment_status: 'pending',
            promo_code: appliedPromo?.promoCode?.code || null,
            discount_amount: discount,
            shipping_fee: finalShippingFee,
            cod_fee: codFee,
            shipping_zone: deliveryEstimate?.zone || null,
            estimated_delivery_start: deliveryEstimate?.startDate || null,
            estimated_delivery_end: deliveryEstimate?.endDate || null,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
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

      // Handle payment based on method
      if (paymentMethod === 'razorpay') {
        // Step 1: Create Razorpay order via Supabase Edge Function
        const razorpayOrder = await createRazorpayOrder(
          orderTotal,
          orderNumber,
          {
            order_id: order.id,
            customer_email: user.email || '',
            customer_phone: shippingAddress.phone,
          }
        );

        // Step 2: Initiate Razorpay payment with the created order
        await initiateRazorpayPayment(
          {
            amount: razorpayOrder.amount * 100, // Convert to paise
            currency: razorpayOrder.currency,
            name: 'MitthuuG',
            description: `Order #${orderNumber}`,
            order_id: razorpayOrder.orderId,
            prefill: {
              name: shippingAddress.name,
              email: user.email || '',
              contact: shippingAddress.phone,
            },
            notes: {
              order_id: order.id,
              order_number: orderNumber,
            },
            theme: {
              color: '#C6862E', // Ochre color
            },
          },
          async (response) => {
            // Step 3: Verify payment signature via Supabase Edge Function
            const isValid = await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (isValid) {
              // Payment verified - update order status
              await supabase
                .from('orders')
                .update({
                  status: 'confirmed',
                  payment_status: 'completed',
                  payment_id: response.razorpay_payment_id,
                })
                .eq('id', order.id);

              clearCart();
              navigate(`/account/orders/${order.id}`);
            } else {
              // Signature verification failed
              console.error('Payment signature verification failed');
              alert('Payment verification failed. Please contact support.');
              setProcessing(false);
            }
          },
          (error) => {
            // Payment failed
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
            setProcessing(false);
          }
        );
      } else {
        // COD - Order placed successfully
        clearCart();
        navigate(`/account/orders/${order.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <SEO title="Checkout - Sign In Required | MitthuuG" />
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
      <div className="min-h-screen pt-20 flex items-center justify-center bg-ivory">
        <SEO title="Checkout | MitthuuG" />
        <div className="text-center">
          <h2 className="text-2xl font-playfair text-chocolate mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 bg-ochre text-white rounded-full hover:bg-ochre-600 transition-colors font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-ivory">
      <SEO 
        title="Secure Checkout | MitthuuG"
        description="Complete your order securely. Fast shipping, multiple payment options, and guaranteed freshness on all Til-Gud sweets."
        keywords="checkout, buy til gud, order sweets, secure payment"
      />
      
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

            <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-ochre-100">
              <h2 className="text-2xl font-playfair font-bold text-chocolate mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-ochre" />
                Payment Method
              </h2>
              
              <div className="space-y-4">
                {/* Razorpay Option */}
                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'razorpay' 
                    ? 'border-ochre bg-ochre-50 shadow-md' 
                    : 'border-ochre-200 hover:border-ochre-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-ochre"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-chocolate">Online Payment</span>
                      <img 
                        src="https://razorpay.com/assets/razorpay-glyph.svg" 
                        alt="Razorpay" 
                        className="h-6"
                      />
                    </div>
                    <p className="text-sm text-chocolate-600 mt-1">
                      Credit/Debit Card, UPI, NetBanking, Wallets
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <Lock className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">100% Secure Payment</span>
                    </div>
                  </div>
                </label>

                {/* COD Option */}
                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'cod' 
                    ? 'border-ochre bg-ochre-50 shadow-md' 
                    : 'border-ochre-200 hover:border-ochre-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-ochre"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-chocolate">Cash on Delivery</span>
                      <Truck className="w-5 h-5 text-ochre" />
                    </div>
                    <p className="text-sm text-chocolate-600 mt-1">
                      Pay when you receive the order
                    </p>
                    {codFee > 0 && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                        <p className="text-xs text-amber-800">
                          COD fee: ₹{codFee} (2% of order value)
                        </p>
                      </div>
                    )}
                    {!isCODEligible(cartTotal, shippingAddress.postal_code || '') && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-xs text-red-700">
                          COD available only for orders between ₹99 and ₹10,000
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-ochre-100 sticky top-24">
              <h2 className="text-2xl font-playfair font-bold text-chocolate mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-ochre-100"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-chocolate">{item.name}</p>
                      <p className="text-xs text-chocolate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-ochre">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery Estimate */}
              {deliveryEstimate && (
                <div className="mb-6 p-4 bg-olive-50 border-2 border-olive-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-olive mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-olive-800">
                        Estimated Delivery
                      </p>
                      <p className="text-xs text-olive-700">
                        {formatDeliveryDateRange(deliveryEstimate)} ({deliveryEstimate.deliveryDays})
                      </p>
                      <p className="text-xs text-olive-600 mt-1">
                        {deliveryEstimate.zone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Promo Code Input */}
              <div className="mb-6">
                {!appliedPromo ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="w-4 h-4 text-ochre" />
                      <label className="text-sm font-semibold text-chocolate">
                        Have a promo code?
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border-2 border-ochre-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre-200 transition-all uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-6 py-2 bg-ochre text-white rounded-lg hover:bg-ochre-600 transition-colors font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{promoError}</span>
                      </p>
                    )}
                    {/* Show available promos */}
                    <button
                      type="button"
                      onClick={() => setShowPromos(!showPromos)}
                      className="text-xs text-ochre hover:underline mt-2"
                    >
                      {showPromos ? 'Hide' : 'View'} available codes
                    </button>
                    {showPromos && (
                      <div className="mt-2 space-y-2">
                        {getActivePromoCodes().map((promo) => (
                          <button
                            key={promo.code}
                            type="button"
                            onClick={() => {
                              setPromoCode(promo.code);
                              handleApplyPromo();
                            }}
                            className="w-full text-left p-2 bg-ochre-50 rounded-lg hover:bg-ochre-100 transition-colors"
                          >
                            <p className="text-xs font-bold text-ochre">{promo.code}</p>
                            <p className="text-xs text-chocolate-600">{promo.description}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-bold text-green-800">
                            {appliedPromo.promoCode.code} Applied!
                          </p>
                          <p className="text-xs text-green-700">
                            {appliedPromo.message}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t-2 border-ochre-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-chocolate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{cartTotal}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.promoCode.code})</span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-chocolate-600">
                  <div className="flex items-center space-x-1">
                    <span>Shipping</span>
                    {finalShippingFee === 0 && shippingFee > 0 && (
                      <span className="text-xs text-green-600">(Free!)</span>
                    )}
                  </div>
                  <span className={`font-semibold ${finalShippingFee === 0 ? 'text-green-600 line-through' : ''}`}>
                    {finalShippingFee === 0 ? `₹${shippingFee}` : `₹${finalShippingFee}`}
                  </span>
                </div>
                
                {codFee > 0 && (
                  <div className="flex justify-between text-chocolate-600">
                    <span>COD Fee (2%)</span>
                    <span className="font-semibold">₹{codFee}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xl font-bold text-chocolate pt-3 border-t-2 border-ochre-200">
                  <span>Total</span>
                  <span className="text-ochre">₹{orderTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing || (!!shippingAddress.postal_code && !isValidPincode(shippingAddress.postal_code))}
                className="w-full bg-gradient-mitthuug text-white py-4 rounded-full hover:shadow-mitthuug-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide font-bold text-lg shadow-mitthuug"
              >
                {processing ? 'Processing...' : paymentMethod === 'cod' ? 'PLACE ORDER (COD)' : `PAY ₹${orderTotal}`}
              </button>

              <p className="text-xs text-chocolate-500 text-center mt-4">
                <Lock className="w-3 h-3 inline mr-1" />
                Secure checkout · 100% safe
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
