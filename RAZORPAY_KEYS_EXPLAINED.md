# 🔐 Razorpay Keys - Where They Go

## ❌ **IMPORTANT: What NOT to Store in Database**

### Never store these in Supabase:
- ❌ `VITE_RAZORPAY_KEY_ID` - This is your public key, goes in `.env` file
- ❌ `VITE_RAZORPAY_KEY_SECRET` - This is your secret key, NEVER commit or store in database
- ❌ Any API keys or credentials

## ✅ **What DOES Go in the Database**

### Store these in Supabase `orders` table:
- ✅ `payment_id` - The transaction ID from Razorpay (e.g., `pay_MXQ5f8z9dLMXXX`)
- ✅ `payment_method` - The method used: `razorpay`, `cod`, `upi`
- ✅ `payment_status` - The status: `pending`, `completed`, `failed`, `refunded`
- ✅ `order_number` - Your internal order number (e.g., `MG-1730476800000`)

---

## 📊 Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                              │
└─────────────────────────────────────────────────────────────┘

1. USER SELECTS PAYMENT METHOD
   ┌──────────────────┐
   │  CheckoutPage    │
   │  - Razorpay      │ ← User selects
   │  - COD           │
   └──────────────────┘
          ↓

2. CREATE ORDER IN DATABASE
   ┌──────────────────────────────────────┐
   │  Supabase orders table               │
   │  ✅ order_number: MG-1730476800000   │
   │  ✅ user_id: auth.uid()              │
   │  ✅ total_amount: 850                │
   │  ✅ subtotal_amount: 800             │
   │  ✅ discount_amount: 50              │
   │  ✅ shipping_fee: 75                 │
   │  ✅ cod_fee: 17                      │
   │  ✅ payment_method: "razorpay"       │
   │  ✅ payment_status: "pending"        │
   │  ✅ status: "payment_pending"        │
   │  ✅ promo_code: "WELCOME10"          │
   │  ⏳ payment_id: null (set later)     │
   └──────────────────────────────────────┘
          ↓

3. INITIATE PAYMENT (if Razorpay)
   ┌──────────────────────────────────────┐
   │  Frontend (CheckoutPage)             │
   │  ┌────────────────────────────────┐  │
   │  │  initiateRazorpayPayment({    │  │
   │  │    amount: 850 * 100,         │  │ ← Uses .env key
   │  │    key_id: VITE_RAZORPAY_KEY  │  │
   │  │    order_id: order.id,        │  │
   │  │  })                           │  │
   │  └────────────────────────────────┘  │
   └──────────────────────────────────────┘
          ↓
   ┌──────────────────────────────────────┐
   │  Razorpay Payment Gateway            │
   │  - User enters card details          │
   │  - Razorpay processes payment        │
   │  - Returns payment_id                │
   └──────────────────────────────────────┘
          ↓
          
4. PAYMENT SUCCESS CALLBACK
   ┌──────────────────────────────────────┐
   │  response = {                        │
   │    razorpay_payment_id: "pay_XXX",   │ ← This goes to DB
   │    razorpay_order_id: "order_XXX",   │
   │    razorpay_signature: "abc123..."   │
   │  }                                   │
   └──────────────────────────────────────┘
          ↓

5. UPDATE ORDER IN DATABASE
   ┌──────────────────────────────────────┐
   │  UPDATE orders SET                   │
   │  ✅ payment_id = "pay_XXX"           │ ← Stored in DB
   │  ✅ payment_status = "completed"     │
   │  ✅ status = "confirmed"             │
   │  WHERE id = order.id                 │
   └──────────────────────────────────────┘
          ↓

6. REDIRECT TO ORDER CONFIRMATION
   ┌──────────────────────────────────────┐
   │  /account/orders/{order.id}          │
   │  - Shows order details               │
   │  - Shows payment_id                  │
   │  - Shows payment status              │
   └──────────────────────────────────────┘
```

---

## 🗂️ File Structure

```
mitthuug_2/
│
├── .env                              ← 🔐 Razorpay Keys (NOT committed)
│   ├── VITE_RAZORPAY_KEY_ID=rzp_test_xxx
│   └── VITE_RAZORPAY_KEY_SECRET=xxx
│
├── src/
│   ├── lib/
│   │   ├── config.ts                 ← Reads from .env
│   │   ├── payment.ts                ← Uses config.razorpay.keyId
│   │   ├── shipping.ts
│   │   └── promos.ts
│   │
│   ├── types/
│   │   └── database.ts               ← Order interface (payment_id field)
│   │
│   └── pages/
│       └── CheckoutPage.tsx          ← Saves payment_id to database
│
└── supabase/
    └── migrations/
        └── 20251101000000_add_payment_fields_to_orders.sql
            ├── payment_id (text)     ← Stores transaction ID
            ├── payment_method (text)
            └── payment_status (text)
```

---

## 🔑 Key Differences

| Item | Storage Location | Purpose | Example |
|------|-----------------|---------|---------|
| **Razorpay Key ID** | `.env` file (Frontend) | Authenticate with Razorpay API | `rzp_test_1234567890` |
| **Razorpay Key Secret** | `.env` file (Backend/Webhooks) | Verify payment signatures | `abcdef123456...` |
| **Payment ID** | Database `orders.payment_id` | Track specific transaction | `pay_MXQ5f8z9dLMXXX` |
| **Order Number** | Database `orders.order_number` | Your internal tracking | `MG-1730476800000` |

---

## 🎯 What You Need to Do Now

### Step 1: Apply Database Migration
```bash
# Log in to Supabase Dashboard
# Go to SQL Editor
# Run the migration file:
# supabase/migrations/20251101000000_add_payment_fields_to_orders.sql
```

See detailed instructions in `DATABASE_MIGRATION_GUIDE.md`

### Step 2: Verify .env File
```bash
# Make sure your .env has:
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
VITE_RAZORPAY_KEY_SECRET=your_key_secret
```

### Step 3: Test Payment Flow
1. Place a test order
2. Select "Online Payment"
3. Use test card: `4111 1111 1111 1111`
4. Check Supabase `orders` table
5. Verify `payment_id` is saved

---

## 🛡️ Security Best Practices

### ✅ DO:
- ✅ Keep Razorpay keys in `.env` file
- ✅ Add `.env` to `.gitignore`
- ✅ Store payment_id in database after successful payment
- ✅ Use test keys for development
- ✅ Validate payment on backend (future: webhooks)

### ❌ DON'T:
- ❌ Commit `.env` file to GitHub
- ❌ Store Razorpay keys in database
- ❌ Expose key_secret in frontend code
- ❌ Use live keys in test mode
- ❌ Trust frontend payment confirmation alone

---

## 📚 Related Documentation

- `RAZORPAY_SETUP.md` - Complete payment integration guide
- `DATABASE_MIGRATION_GUIDE.md` - How to apply migration
- `.env.example` - Template for environment variables
- `src/lib/payment.ts` - Payment utility functions

---

## 🎉 Summary

**Your setup is now:**
- ✅ Razorpay keys configured in `.env` (not in database)
- ✅ Database migration created to store payment transactions
- ✅ Order interface updated with payment fields
- ✅ CheckoutPage saves payment_id after successful payment
- ✅ All fields properly separated (config vs. transaction data)

**Ready to go live when:**
1. Apply database migration in Supabase
2. Test with Razorpay test cards
3. Switch to live Razorpay keys in `.env`
4. Implement Razorpay webhooks (recommended)
