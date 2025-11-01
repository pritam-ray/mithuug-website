# Quick Start: Deploy Razorpay Payment Integration

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Install Supabase CLI
```powershell
npm install -g supabase
```

### Step 2: Login and Link Project
```powershell
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref voyratmtxqkfntjunmbr
```

### Step 3: Set Environment Secrets
```powershell
# Set Razorpay credentials as secrets
supabase secrets set RAZORPAY_KEY_ID=rzp_test_RW2mMIwwHqmKC8
supabase secrets set RAZORPAY_KEY_SECRET=yHPOvCSloTvGi0jPpFdHK1KY
```

### Step 4: Deploy Edge Functions
```powershell
# Deploy both functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment

# Verify deployment
supabase functions list
```

### Step 5: Test Payment
1. Start your development server:
   ```powershell
   npm run dev
   ```

2. Add items to cart and go to checkout

3. Use Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date

## ✅ What Changed

### Security Improvements
- ✅ Razorpay Key Secret **removed** from frontend `.env`
- ✅ Payment verification now happens on **server-side**
- ✅ Order creation uses **Supabase Edge Functions**

### New Files
```
supabase/functions/
├── create-razorpay-order/
│   └── index.ts          # Creates Razorpay orders securely
└── verify-razorpay-payment/
    └── index.ts          # Verifies payment signatures
```

### Updated Files
- ✅ `src/lib/payment.ts` - Uses Edge Functions instead of direct API calls
- ✅ `src/lib/config.ts` - Removed keySecret from config
- ✅ `src/pages/CheckoutPage.tsx` - Enhanced payment flow with verification
- ✅ `.env` - Removed VITE_RAZORPAY_KEY_SECRET

## 📝 Payment Flow

```
User clicks "Pay Now"
    ↓
Frontend calls createRazorpayOrder()
    ↓
Supabase Edge Function creates order via Razorpay API
    ↓
Order ID returned to frontend
    ↓
Razorpay modal opens with order ID
    ↓
User completes payment
    ↓
Frontend receives payment response
    ↓
Frontend calls verifyRazorpayPayment()
    ↓
Supabase Edge Function verifies signature
    ↓
If valid: Update order status in database
```

## 🔒 Security Checklist

- ✅ Key Secret stored in Supabase (not in code)
- ✅ Payment signature verified server-side
- ✅ HTTPS for all API calls
- ✅ No sensitive data in frontend bundle

## 🧪 Testing

### Test in Browser Console
```javascript
// Test order creation
const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
  body: { amount: 100 }
});
console.log(data);
```

### Expected Response
```json
{
  "success": true,
  "order": {
    "id": "order_NxxxxxxxxxxxX",
    "amount": 10000,
    "currency": "INR",
    "status": "created"
  }
}
```

## ⚠️ Troubleshooting

### Error: "Supabase CLI not found"
```powershell
# Restart terminal after installing
npm install -g supabase
```

### Error: "Failed to create order"
1. Check secrets are set: `supabase secrets list`
2. View function logs in Supabase Dashboard
3. Ensure functions are deployed: `supabase functions list`

### Error: "Payment verification failed"
- Check that RAZORPAY_KEY_SECRET matches in Supabase dashboard
- View Edge Function logs for detailed error

## 📚 Full Documentation

See `RAZORPAY_SETUP_GUIDE.md` for complete details.

## 💰 Going Live

When ready for production:

1. Get live Razorpay credentials from dashboard
2. Update Supabase secrets:
   ```powershell
   supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxxxx
   supabase secrets set RAZORPAY_KEY_SECRET=your_live_secret
   ```
3. Update `.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   VITE_PAYMENT_MODE=live
   ```

## 🎉 You're Done!

Your payment integration is now **secure** and **production-ready**!
