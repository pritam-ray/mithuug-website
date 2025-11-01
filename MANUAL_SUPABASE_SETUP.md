# Manual Supabase Setup (Without CLI)

## 📋 Step-by-Step Guide

### Step 1: Add Razorpay Credentials as Secrets

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/voyratmtxqkfntjunmbr

2. **Navigate to Edge Functions Settings**
   - Click on **"Edge Functions"** in the left sidebar
   - Click on **"Manage secrets"** or **"Secrets"** tab

3. **Add Environment Variables**
   Click "New secret" and add these two secrets:

   **Secret 1:**
   - Name: `RAZORPAY_KEY_ID`
   - Value: `rzp_test_RW2mMIwwHqmKC8`

   **Secret 2:**
   - Name: `RAZORPAY_KEY_SECRET`
   - Value: `yHPOvCSloTvGi0jPpFdHK1KY`

### Step 2: Deploy Edge Functions Manually

#### Function 1: create-razorpay-order

1. Go to **Edge Functions** → **Create a new function**
2. Name: `create-razorpay-order`
3. Copy and paste this code:

```typescript
// Supabase Edge Function to create Razorpay order
// This keeps your Razorpay Key Secret secure on the server side

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!;
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;

interface OrderRequest {
  amount: number; // in rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Parse request body
    const { amount, currency = 'INR', receipt, notes }: OrderRequest = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    // Create Razorpay order
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: receipt || `order_${Date.now()}`,
        notes: notes || {},
      }),
    });

    if (!razorpayResponse.ok) {
      const error = await razorpayResponse.json();
      console.error('Razorpay error:', error);
      throw new Error('Failed to create Razorpay order');
    }

    const order = await razorpayResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        order,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
});
```

4. Click **"Deploy"**

#### Function 2: verify-razorpay-payment

1. Go to **Edge Functions** → **Create a new function**
2. Name: `verify-razorpay-payment`
3. Copy and paste this code:

```typescript
// Supabase Edge Function to verify Razorpay payment signature
// This ensures payment authenticity on the server side

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;

interface VerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyRequest = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    // Generate expected signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    // Verify signature
    const isValid = expectedSignature === razorpay_signature;

    return new Response(
      JSON.stringify({
        success: true,
        isValid,
        payment_id: razorpay_payment_id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
});
```

4. Click **"Deploy"**

### Step 3: Test the Functions

1. Go to **Edge Functions** in Supabase Dashboard
2. Click on **`create-razorpay-order`**
3. Click **"Invoke function"**
4. Use this test payload:

```json
{
  "amount": 100
}
```

5. You should see a response like:

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

### Step 4: Run Database Migration

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New query"**
3. Copy the contents of `supabase/migrations/20251101000000_add_payment_fields_to_orders.sql`
4. Paste and click **"Run"**
5. You should see: "Success. No rows returned"

### Step 5: Verify Setup

Test in your browser console (after starting `npm run dev`):

```javascript
// Test order creation
const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
  body: { amount: 100 }
});
console.log(data);
```

## ✅ Checklist

- [ ] Added RAZORPAY_KEY_ID secret in Supabase
- [ ] Added RAZORPAY_KEY_SECRET secret in Supabase
- [ ] Deployed create-razorpay-order function
- [ ] Deployed verify-razorpay-payment function
- [ ] Tested function with sample payload
- [ ] Ran database migration SQL
- [ ] Tested from browser console

## 🎯 You're Done!

Your payment integration is now live and secure!

## 🆘 Troubleshooting

**Can't find Edge Functions in dashboard?**
- Make sure you're on a paid plan or have Edge Functions enabled
- Try this direct link: https://supabase.com/dashboard/project/voyratmtxqkfntjunmbr/functions

**Function deployment fails?**
- Check that secrets are saved correctly
- Ensure function name matches exactly: `create-razorpay-order`
- Check the logs tab for error details

**CORS errors when testing?**
- The CORS headers are already included in the code
- Make sure you're calling from http://localhost:5173 (dev server)
