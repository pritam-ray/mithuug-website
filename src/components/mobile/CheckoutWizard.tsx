import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, CreditCard, MapPin, FileText, PartyPopper, Truck, Tag, Lock } from 'lucide-react';
import { Address } from '../../types/database';
import { isValidPincode, getDeliveryEstimate, calculateShippingFee } from '../../lib/shipping';
import { applyPromoCode } from '../../lib/promos';
import { calculateCODFee, isCODEligible } from '../../lib/payment';

interface CheckoutWizardProps {
  cartTotal: number;
  cartItems: any[];
  shippingAddress: Address;
  setShippingAddress: (address: Address) => void;
  billingAddress: Address;
  setBillingAddress: (address: Address) => void;
  sameAsShipping: boolean;
  setSameAsShipping: (same: boolean) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onSubmit: () => Promise<void>;
  processing: boolean;
}

type Step = 1 | 2 | 3 | 4;

const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  cartTotal,
  cartItems,
  shippingAddress,
  setShippingAddress,
  billingAddress,
  setBillingAddress,
  sameAsShipping,
  setSameAsShipping,
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  processing,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [deliveryEstimate, setDeliveryEstimate] = useState<any>(null);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');

  const steps = [
    { number: 1, title: 'Shipping', icon: MapPin },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: FileText },
    { number: 4, title: 'Confirm', icon: PartyPopper },
  ];

  // Auto-save to localStorage
  useEffect(() => {
    const data = {
      shippingAddress,
      billingAddress,
      sameAsShipping,
      paymentMethod,
      promoCode,
      appliedPromo,
      currentStep,
    };
    localStorage.setItem('checkout_wizard_state', JSON.stringify(data));
  }, [shippingAddress, billingAddress, sameAsShipping, paymentMethod, promoCode, appliedPromo, currentStep]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('checkout_wizard_state');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.shippingAddress) setShippingAddress(data.shippingAddress);
        if (data.billingAddress) setBillingAddress(data.billingAddress);
        if (data.sameAsShipping !== undefined) setSameAsShipping(data.sameAsShipping);
        if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
        if (data.promoCode) setPromoCode(data.promoCode);
        if (data.appliedPromo) setAppliedPromo(data.appliedPromo);
      } catch (e) {
        console.error('Failed to load saved checkout state:', e);
      }
    }
  }, []);

  // Calculate shipping when pincode changes
  useEffect(() => {
    const pincode = shippingAddress.postal_code;
    if (pincode && isValidPincode(pincode)) {
      const fee = calculateShippingFee(pincode, cartTotal);
      const estimate = getDeliveryEstimate(pincode, cartTotal);
      setShippingFee(fee);
      setDeliveryEstimate(estimate);
    }
  }, [shippingAddress.postal_code, cartTotal]);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    const result = applyPromoCode(
      promoCode.trim(),
      cartTotal,
      true,
      cartItems.map(item => item.id)
    );

    if (result.valid) {
      setAppliedPromo(result);
      setPromoError('');
      // Haptic feedback
      if ('vibrate' in navigator) navigator.vibrate(10);
    } else {
      setPromoError(result.message);
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const discount = appliedPromo?.discount || 0;
  const codFee = paymentMethod === 'cod' ? calculateCODFee(cartTotal) : 0;
  const finalShippingFee = appliedPromo?.freeShipping ? 0 : shippingFee;
  const orderTotal = cartTotal - discount + finalShippingFee + codFee;

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!(
          shippingAddress.name &&
          shippingAddress.line1 &&
          shippingAddress.city &&
          shippingAddress.state &&
          shippingAddress.postal_code &&
          isValidPincode(shippingAddress.postal_code) &&
          shippingAddress.phone
        );
      case 2:
        if (paymentMethod === 'cod') {
          return isCODEligible(cartTotal, shippingAddress.postal_code);
        }
        return !!paymentMethod;
      case 3:
        return true; // Review step always valid
      default:
        return true;
    }
  };

  const goToStep = (step: Step) => {
    if (step > currentStep) {
      // Validate current step before proceeding
      if (!validateStep(currentStep)) {
        alert('Please fill all required fields correctly');
        return;
      }
      setSlideDirection('forward');
    } else {
      setSlideDirection('backward');
    }
    setCurrentStep(step);
    // Haptic feedback
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const handleNext = () => {
    if (currentStep < 4 && validateStep(currentStep)) {
      goToStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as Step);
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(currentStep)) {
      alert('Please review your order details');
      return;
    }
    await onSubmit();
  };

  const slideVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-ivory pb-20">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-stone-200 pt-safe">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <button
                    type="button"
                    onClick={() => goToStep(step.number as Step)}
                    disabled={step.number > currentStep}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      step.number > currentStep ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-ochre text-white scale-110'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-ochre' : 'text-stone-600'}`}>
                      {step.title}
                    </span>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 bg-stone-200 relative">
                      <motion.div
                        className="absolute inset-0 bg-ochre"
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: currentStep > step.number ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Step title */}
          <h2 className="text-lg font-semibold text-stone-900 text-center">
            {steps[currentStep - 1].title}
          </h2>
        </div>
      </div>

      {/* Step Content */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait" custom={slideDirection}>
          <motion.div
            key={currentStep}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="px-4 py-6"
          >
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-ochre" />
                    Shipping Address
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        autoCapitalize="words"
                        autoComplete="name"
                        value={shippingAddress.name}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, name: e.target.value })
                        }
                        className="w-full px-4 py-3 text-base border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre touch-target"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 text-base border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre touch-target"
                        placeholder="10-digit mobile number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="address-line1"
                        spellCheck={false}
                        value={shippingAddress.line1}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, line1: e.target.value })
                        }
                        className="w-full px-4 py-3 text-base border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre touch-target"
                        placeholder="House/Flat No., Building Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        autoComplete="address-line2"
                        spellCheck={false}
                        value={shippingAddress.line2}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, line2: e.target.value })
                        }
                        className="w-full px-4 py-3 text-base border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre touch-target"
                        placeholder="Street, Landmark (Optional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          autoComplete="address-level2"
                          autoCapitalize="words"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, city: e.target.value })
                          }
                          className="w-full px-4 py-3 text-base border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre touch-target"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          State *
                        </label>
                        <select
                          required
                          autoComplete="address-level1"
                          value={shippingAddress.state}
                          onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, state: e.target.value })
                          }
                          className="w-full px-4 py-3 text-base border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre touch-target"
                        >
                          <option value="">Select State</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="West Bengal">West Bengal</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Haryana">Haryana</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={shippingAddress.postal_code}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, postal_code: e.target.value })
                        }
                        className={`w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 touch-target ${
                          shippingAddress.postal_code && !isValidPincode(shippingAddress.postal_code)
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-stone-200 focus:ring-ochre'
                        }`}
                        placeholder="6-digit pincode"
                      />
                      {shippingAddress.postal_code && isValidPincode(shippingAddress.postal_code) && deliveryEstimate && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-green-600">
                          <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Delivery Available</p>
                            <p className="text-stone-600">
                              Est. delivery: {deliveryEstimate.minDays}-{deliveryEstimate.maxDays} days
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-ochre" />
                    Payment Method
                  </h3>

                  <div className="space-y-3">
                    {/* Online Payment */}
                    <label
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all touch-target ${
                        paymentMethod === 'razorpay'
                          ? 'border-ochre bg-ochre/5'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="razorpay"
                          checked={paymentMethod === 'razorpay'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 text-ochre focus:ring-ochre"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-stone-900">Online Payment</div>
                          <div className="text-sm text-stone-600">UPI, Cards, Wallets, Net Banking</div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded font-semibold">
                              UPI
                            </div>
                            <div className="px-3 py-1 bg-purple-500 text-white text-xs rounded font-semibold">
                              Cards
                            </div>
                            <div className="px-3 py-1 bg-green-500 text-white text-xs rounded font-semibold">
                              Wallets
                            </div>
                          </div>
                        </div>
                        <Lock className="w-5 h-5 text-green-600" />
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all touch-target ${
                        paymentMethod === 'cod'
                          ? 'border-ochre bg-ochre/5'
                          : 'border-stone-200 hover:border-stone-300'
                      } ${
                        !isCODEligible(cartTotal, shippingAddress.postal_code)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          disabled={!isCODEligible(cartTotal, shippingAddress.postal_code)}
                          className="w-5 h-5 text-ochre focus:ring-ochre"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-stone-900">Cash on Delivery</div>
                          <div className="text-sm text-stone-600">
                            Pay when you receive (₹{calculateCODFee(cartTotal)} fee)
                          </div>
                          {!isCODEligible(cartTotal, shippingAddress.postal_code) && (
                            <div className="text-xs text-red-600 mt-1">
                              Not available for this order (₹99 - ₹10,000 only)
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-ochre" />
                    Promo Code
                  </h3>

                  {!appliedPromo ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="flex-1 px-4 py-3 text-base border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre touch-target"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-6 py-3 bg-ochre text-white rounded-xl font-semibold hover:bg-ochre-600 transition-colors touch-target"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-sm text-red-600">{promoError}</p>
                      )}
                      <div className="text-sm text-stone-600">
                        Try: WELCOME10, SAVE20, FESTIVAL25
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div>
                        <div className="font-semibold text-green-800">
                          {appliedPromo.promoCode.code} Applied! 🎉
                        </div>
                        <div className="text-sm text-green-600">
                          You saved ₹{discount}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-sm text-red-600 hover:text-red-700 font-medium touch-target px-3 py-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-ochre" />
                    Order Summary
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-900">{item.name}</h4>
                          <p className="text-sm text-stone-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-stone-900">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-stone-200 pt-4 space-y-2">
                    <div className="flex justify-between text-stone-700">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-700">
                      <span>Shipping</span>
                      <span>{finalShippingFee === 0 ? 'FREE' : `₹${finalShippingFee}`}</span>
                    </div>
                    {codFee > 0 && (
                      <div className="flex justify-between text-stone-700">
                        <span>COD Fee</span>
                        <span>₹{codFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-stone-900 pt-2 border-t border-stone-200">
                      <span>Total</span>
                      <span>₹{orderTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-stone-900">Shipping Address</h4>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="text-sm text-ochre hover:text-ochre-600 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-stone-700">{shippingAddress.name}</p>
                  <p className="text-stone-600 text-sm">
                    {shippingAddress.line1}
                    {shippingAddress.line2 && `, ${shippingAddress.line2}`}
                  </p>
                  <p className="text-stone-600 text-sm">
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postal_code}
                  </p>
                  <p className="text-stone-600 text-sm">Phone: {shippingAddress.phone}</p>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-stone-900">Payment Method</h4>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="text-sm text-ochre hover:text-ochre-600 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-stone-700">
                    {paymentMethod === 'razorpay' ? 'Online Payment (UPI/Card/Wallet)' : 'Cash on Delivery'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PartyPopper className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    Ready to Place Order!
                  </h3>
                  <p className="text-stone-600 mb-6">
                    Review your order details and complete the payment
                  </p>
                  
                  <div className="bg-ochre/10 border border-ochre/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-stone-700">Order Total</span>
                      <span className="text-2xl font-bold text-ochre">₹{orderTotal}</span>
                    </div>
                    {deliveryEstimate && (
                      <div className="text-sm text-stone-600">
                        <Truck className="w-4 h-4 inline mr-1" />
                        Delivery in {deliveryEstimate.minDays}-{deliveryEstimate.maxDays} days
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={processing}
                    className="w-full py-4 bg-ochre text-white rounded-xl font-bold text-lg hover:bg-ochre-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target-lg shadow-lg"
                  >
                    {processing ? 'Processing...' : paymentMethod === 'razorpay' ? 'Proceed to Payment' : 'Place Order'}
                  </button>

                  <p className="text-xs text-stone-500 mt-4">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Secure checkout · Your data is encrypted
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 pb-safe z-30">
          <div className="flex gap-3 max-w-lg mx-auto">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 border-2 border-stone-300 text-stone-700 rounded-xl font-semibold hover:bg-stone-50 transition-colors touch-target flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="flex-1 py-3 bg-ochre text-white rounded-xl font-semibold hover:bg-ochre-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutWizard;
