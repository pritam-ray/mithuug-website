# 💳 Razorpay Payment Integration Guide

## 🔧 Setup Instructions

### Step 1: Add Your Razorpay Credentials

1. **Open the `.env` file** in the root directory
2. **Add your Razorpay Test credentials:**

```env
# Razorpay Test Credentials
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=your_test_secret_key_here

# Set to test mode
VITE_PAYMENT_MODE=test
```

3. **Save the file** and restart the dev server (`npm run dev`)

### Step 2: Verify Configuration

The app will automatically:
- ✅ Load Razorpay SDK when needed
- ✅ Use test mode credentials
- ✅ Show warnings if credentials are missing

---

## 📝 How to Use Payment Utilities

### Basic Payment Flow Example

```typescript
import { initiateRazorpayPayment, createRazorpayOrder } from '../lib/payment';

// Step 1: Create order on your backend
const { orderId, amount } = await createRazorpayOrder(
  999, // amount in rupees
  'customer-id-123'
);

// Step 2: Initiate Razorpay payment
await initiateRazorpayPayment(
  {
    amount: amount, // amount in paise (999 INR = 99900 paise)
    currency: 'INR',
    name: 'MitthuuG',
    description: 'Til-Gud Bites Order',
    order_id: orderId,
    prefill: {
      name: 'Customer Name',
      email: 'customer@example.com',
      contact: '9999999999',
    },
    notes: {
      order_type: 'ecommerce',
      product_ids: 'prod-1,prod-2',
    },
    theme: {
      color: '#C6862E', // MitthuuG ochre color
    },
  },
  (response) => {
    // Payment successful
    console.log('Payment Success:', response);
    // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
    
    // Verify payment on backend
    verifyPayment(response);
  },
  (error) => {
    // Payment failed
    console.error('Payment Failed:', error);
    alert('Payment failed. Please try again.');
  }
);
```

### COD (Cash on Delivery) Validation

```typescript
import { isCODEligible, calculateCODFee } from '../lib/payment';

const orderAmount = 599;
const pincode = '110001';

// Check if COD is available
if (isCODEligible(orderAmount, pincode)) {
  const codFee = calculateCODFee(orderAmount);
  console.log(`COD Fee: ₹${codFee}`); // ₹12 (2% of ₹599)
  
  const totalAmount = orderAmount + codFee;
  console.log(`Total with COD: ₹${totalAmount}`);
} else {
  console.log('COD not available for this order');
}
```

### UPI Payment Link

```typescript
import { generateUPILink } from '../lib/payment';

const upiLink = generateUPILink(
  'yourupi@paytm', // Your UPI ID
  599, // Amount in rupees
  'MitthuuG',
  'Order #12345'
);

// Use this link in a QR code or as a direct payment link
console.log(upiLink);
// Output: upi://pay?pa=yourupi@paytm&pn=MitthuuG&am=599.00&tn=Order%20%2312345&cu=INR
```

---

## 🎨 Integration in CheckoutPage

### Example Implementation:

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  initiateRazorpayPayment, 
  isCODEligible, 
  calculateCODFee,
  PAYMENT_METHODS 
} from '../lib/payment';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    if (selectedPayment === 'cod') {
      // Handle COD order
      const codFee = calculateCODFee(cartTotal);
      const totalAmount = cartTotal + codFee;
      
      // Create order in database with status 'pending'
      await createOrder({
        items: cart,
        total: totalAmount,
        paymentMethod: 'cod',
        status: 'pending',
      });
      
      clearCart();
      navigate('/order-success');
      setLoading(false);
      return;
    }

    // Handle Razorpay payment
    try {
      await initiateRazorpayPayment(
        {
          amount: cartTotal * 100, // Convert to paise
          currency: 'INR',
          name: 'MitthuuG',
          description: 'Til-Gud Bites Order',
          order_id: 'order_' + Date.now(), // Replace with actual order ID from backend
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: {
            color: '#C6862E',
          },
        },
        async (response) => {
          // Payment successful
          await createOrder({
            items: cart,
            total: cartTotal,
            paymentMethod: 'razorpay',
            paymentId: response.razorpay_payment_id,
            status: 'paid',
          });
          
          clearCart();
          navigate('/order-success');
        },
        (error) => {
          alert('Payment failed: ' + error.message);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      {/* Payment Method Selection */}
      <div className="payment-methods">
        {PAYMENT_METHODS.filter(m => m.enabled).map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedPayment(method.id)}
            className={selectedPayment === method.id ? 'selected' : ''}
          >
            {method.name}
            {method.id === 'cod' && ` (+₹${calculateCODFee(cartTotal)} fee)`}
          </button>
        ))}
      </div>

      {/* Pay Button */}
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Processing...' : `Pay ₹${cartTotal}`}
      </button>
    </div>
  );
};
```

---

## 🔒 Security Best Practices

### ⚠️ NEVER expose Key Secret in frontend

The `.env` file is **NOT** committed to Git (it's in `.gitignore`).

**Important:**
- ✅ `VITE_RAZORPAY_KEY_ID` - Safe to use in frontend (public key)
- ❌ `VITE_RAZORPAY_KEY_SECRET` - **NEVER** use in frontend code
- 🔐 Key Secret should **only** be used in backend/serverless functions

### Backend Integration Required

For production, you need:

1. **Create Order API** (`/api/payment/create-order`)
   - Uses Key Secret to create Razorpay order
   - Returns order ID to frontend

2. **Verify Payment API** (`/api/payment/verify`)
   - Uses Key Secret to verify payment signature
   - Updates order status in database

Example backend (Node.js/Supabase Edge Function):

```javascript
// api/payment/create-order.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Server-side only!
});

export async function POST(req) {
  const { amount, currency, customerId } = await req.json();
  
  const order = await razorpay.orders.create({
    amount: amount * 100, // paise
    currency,
    receipt: 'order_' + Date.now(),
  });
  
  return { orderId: order.id, amount: order.amount };
}
```

---

## 🧪 Testing

### Test Cards (Razorpay Test Mode)

| Card Type | Card Number | CVV | Expiry |
|-----------|-------------|-----|--------|
| Success | 4111 1111 1111 1111 | Any | Future |
| Failure | 4000 0000 0000 0002 | Any | Future |

### Test UPI IDs
- `success@razorpay` - Payment succeeds
- `failure@razorpay` - Payment fails

### COD Testing
- Amount: ₹99 - ₹10,000 (eligible range)
- Outside range: COD disabled

---

## 📊 Payment Analytics

Track payments with GA4:

```typescript
import { trackPurchase } from '../lib/analytics';

// After successful payment
trackPurchase({
  id: orderId,
  value: totalAmount,
  tax: 0,
  shipping: shippingFee,
  items: cart.map(item => ({
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
});
```

---

## 🚀 Going Live

When ready for production:

1. Get **Live Credentials** from Razorpay Dashboard
2. Update `.env`:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   VITE_PAYMENT_MODE=live
   ```
3. Set up **Webhooks** in Razorpay Dashboard
4. Implement backend order verification
5. Test thoroughly with small amounts first!

---

## 📞 Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Test Dashboard:** https://dashboard.razorpay.com/signin?screen=sign_in
- **Integration Checklist:** https://razorpay.com/docs/payments/payment-gateway/web-integration/

---

**🎉 You're all set! Start accepting payments with Razorpay.**
