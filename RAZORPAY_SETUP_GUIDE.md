# Razorpay Payment Setup Guide

## Overview
This guide helps you set up secure Razorpay payments using Supabase Edge Functions. Your Razorpay Key Secret stays secure on the server side and is never exposed to the frontend.

## Architecture

```
Frontend (React)
    ↓
Supabase Edge Functions (Deno)
    ↓
Razorpay API
```

## Step-by-Step Setup

### 1. Add Razorpay Credentials to Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `voyratmtxqkfntjunmbr`
3. Navigate to **Settings** → **Edge Functions** → **Secrets**
4. Add the following secrets:

```bash
RAZORPAY_KEY_ID=rzp_test_RW2mMIwwHqmKC8
RAZORPAY_KEY_SECRET=yHPOvCSloTvGi0jPpFdHK1KY
```

**Important:** These are environment variables for your Edge Functions, NOT your frontend.

### 2. Deploy Supabase Edge Functions

You have two Edge Functions to deploy:

#### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
```powershell
npm install -g supabase
```

2. **Login to Supabase**:
```powershell
supabase login
```

3. **Link your project**:
```powershell
supabase link --project-ref voyratmtxqkfntjunmbr
```

4. **Deploy the Edge Functions**:
```powershell
# Deploy create order function
supabase functions deploy create-razorpay-order

# Deploy verify payment function
supabase functions deploy verify-razorpay-payment
```

5. **Verify deployment**:
```powershell
supabase functions list
```

#### Option B: Manual Deployment (via Supabase Dashboard)

1. Go to **Edge Functions** in your Supabase dashboard
2. Click **Create Function**
3. Name it `create-razorpay-order`
4. Copy the code from `supabase/functions/create-razorpay-order/index.ts`
5. Deploy
6. Repeat for `verify-razorpay-payment`

### 3. Test the Integration

After deploying, test with a small amount:

```javascript
// In your browser console
const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
  body: { amount: 100 } // ₹100
});
console.log(data);
```

You should see:
```json
{
  "success": true,
  "order": {
    "id": "order_xxx",
    "amount": 10000,
    "currency": "INR",
    ...
  }
}
```

### 4. Enable CORS (if needed)

If you get CORS errors:

1. Go to **Edge Functions** → **Settings**
2. Add your frontend URL to allowed origins:
   - Development: `http://localhost:5173`
   - Production: `https://pritam-ray.github.io`

### 5. Update .env.example

The `.env.example` file has been updated to remove the secret key:

```bash
# Frontend only needs the Key ID
VITE_RAZORPAY_KEY_ID=rzp_test_RW2mMIwwHqmKC8

# Secret key is stored in Supabase Edge Function secrets
# NEVER add VITE_RAZORPAY_KEY_SECRET to .env
```

## How It Works

### Creating an Order

```typescript
// Frontend: src/lib/payment.ts
const order = await createRazorpayOrder(totalAmount, 'order_123', { customer_id: '456' });

// This calls the Supabase Edge Function
// Edge Function calls Razorpay API with secret key
// Returns order details to frontend
```

### Processing Payment

```typescript
// 1. User clicks "Pay Now"
await initiateRazorpayPayment({
  order_id: order.orderId,
  amount: order.amount,
  // ... other options
}, onSuccess, onFailure);

// 2. Razorpay modal opens
// 3. User completes payment
// 4. onSuccess callback receives payment details

// 5. Verify payment signature
const isValid = await verifyRazorpayPayment(
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
);

// 6. Update order in database if valid
```

## Security Benefits

✅ **Razorpay Key Secret never exposed** to frontend code  
✅ **Payment signature verification** on server prevents tampering  
✅ **HTTPS encryption** for all API calls  
✅ **Supabase authentication** can be added to Edge Functions  

## Testing in Test Mode

Your credentials are for **test mode**:
- Key ID: `rzp_test_RW2mMIwwHqmKC8`
- Use Razorpay test cards: https://razorpay.com/docs/payments/test-cards

**Test Card:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

## Going Live

When ready for production:

1. Get live credentials from Razorpay dashboard
2. Update Supabase Edge Function secrets:
   ```bash
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=your_live_secret
   ```
3. Update frontend `.env`:
   ```bash
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   VITE_PAYMENT_MODE=live
   ```
4. Complete Razorpay KYC verification
5. Activate payment methods you want to accept

## Troubleshooting

### Error: "Failed to create order"

**Cause:** Edge Function not deployed or secrets not set  
**Solution:** 
1. Check if functions are deployed: `supabase functions list`
2. Verify secrets in Supabase dashboard
3. Check Edge Function logs in Supabase dashboard

### Error: "Payment verification failed"

**Cause:** Signature mismatch (possible tampering or wrong secret)  
**Solution:**
1. Ensure RAZORPAY_KEY_SECRET matches in dashboard
2. Check Edge Function logs for errors
3. Verify payment ID and order ID are correct

### CORS Errors

**Solution:**
1. Add allowed origins in Edge Function code (already included)
2. Check Supabase Edge Function settings
3. Ensure requests include proper headers

## Cost Estimate

**Supabase Edge Functions:**
- Free tier: 500,000 requests/month
- After: $2 per 1 million requests

**Razorpay Fees:**
- Test mode: Free
- Live mode: 2% + GST per transaction

## Support

- **Razorpay Docs:** https://razorpay.com/docs
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Your Razorpay Dashboard:** https://dashboard.razorpay.com

## Summary

✅ Edge Functions created in `supabase/functions/`  
✅ Frontend updated to use Edge Functions  
✅ Secret key removed from frontend `.env`  
✅ Security improved with server-side verification  

**Next Step:** Deploy the Edge Functions using the Supabase CLI!
