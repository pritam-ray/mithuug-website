# Database Migration Guide - Razorpay Integration

## 🎯 Overview
This migration adds all necessary fields to support complete payment processing, including Razorpay integration, promo codes, shipping tracking, and order management.

## 📋 What This Migration Adds

### Payment Fields
- `payment_id` - Stores Razorpay payment ID (e.g., `pay_xxxxx`)
- `payment_method` - Payment method: `razorpay`, `cod`, `upi`, `bank_transfer`
- `payment_status` - Payment status: `pending`, `processing`, `completed`, `failed`, `refunded`

### Pricing Breakdown Fields
- `subtotal_amount` - Order subtotal before discounts and fees
- `discount_amount` - Total discount from promo codes
- `shipping_fee` - Shipping fee based on pincode zone
- `cod_fee` - COD handling fee (2% of order value)

### Promo Code
- `promo_code` - Applied promo code (e.g., `WELCOME10`)

### Shipping Tracking Fields
- `tracking_number` - Courier tracking number
- `shipped_at` - Timestamp when order was shipped
- `delivered_at` - Timestamp when order was delivered
- `estimated_delivery_start` - Estimated delivery start date
- `estimated_delivery_end` - Estimated delivery end date
- `shipping_zone` - Shipping zone: Metro, Tier1, Tier2, Remote

### Order Management Fields
- `notes` - Internal notes or customer notes
- `cancellation_reason` - Reason for cancellation (if cancelled)
- `cancelled_at` - Timestamp when order was cancelled

## 🚀 How to Apply This Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. **Log in to your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `mitthuug`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Migration**
   - Open the file: `supabase/migrations/20251101000000_add_payment_fields_to_orders.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "RUN" button (or press Ctrl+Enter)
   - Wait for success message
   - You should see: "Success. No rows returned"

5. **Verify the Changes**
   - Go to "Table Editor" → "orders" table
   - You should see all the new columns

### Option 2: Using Supabase CLI

```bash
# Make sure you're logged in
supabase login

# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Push the migration
supabase db push

# Or apply this specific migration
supabase db reset
```

### Option 3: Manual SQL Execution

If you prefer to run SQL manually:

```sql
-- Connect to your Supabase database and run the migration file
-- Copy contents from: supabase/migrations/20251101000000_add_payment_fields_to_orders.sql
```

## ✅ Verification Steps

After applying the migration, verify everything is working:

### 1. Check Table Structure
```sql
-- Run this in Supabase SQL Editor
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
```

You should see all the new columns listed.

### 2. Test Order Creation
Try placing a test order through your website:
- Use a test Razorpay card: `4111 1111 1111 1111`
- Apply a promo code: `WELCOME10`
- Check if all fields are populated correctly

### 3. Check Indexes
```sql
-- Verify indexes were created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'orders';
```

You should see indexes on:
- `payment_id`
- `payment_status`
- `status`

## 🔒 Security & Permissions

The migration includes:
- ✅ Row Level Security (RLS) policies updated
- ✅ Check constraints for valid payment methods and statuses
- ✅ Indexes for performance
- ✅ Automatic `updated_at` timestamp trigger

## 📊 Updated Order Status Flow

### Old Flow
```
pending → processing → shipped → delivered
                                 ↓
                            cancelled
```

### New Flow
```
payment_pending → confirmed → processing → shipped → delivered
                      ↓                                ↓
                  cancelled                        refunded
```

## 🔄 Backward Compatibility

The migration is **backward compatible**:
- Existing orders will be updated with default values
- All new fields are nullable or have defaults
- No data loss will occur
- Existing queries will continue to work

## 🐛 Troubleshooting

### Issue: Migration Fails
**Error**: `column already exists`
```sql
-- Solution: Check if migration was already applied
SELECT * FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'payment_id';
```

### Issue: Permission Denied
**Error**: `permission denied for table orders`
```sql
-- Solution: Grant necessary permissions
GRANT ALL ON orders TO authenticated;
```

### Issue: Constraint Violation
**Error**: `check constraint violation`
```sql
-- Solution: Update existing orders first
UPDATE orders 
SET payment_method = 'cod',
    payment_status = 'pending',
    subtotal_amount = total_amount
WHERE payment_method IS NULL;
```

## 📝 Post-Migration Tasks

After migration is successful:

1. ✅ **Update your .env file** (already done)
   - Razorpay keys are configured

2. ✅ **Update TypeScript types** (already done)
   - `src/types/database.ts` updated with new Order interface

3. ✅ **Update CheckoutPage** (already done)
   - Now saves all payment fields

4. ⏳ **Test payment flow**
   - Place test order with Razorpay
   - Place test order with COD
   - Apply promo codes
   - Verify all data is saved

5. ⏳ **Create Order Management Page**
   - Display payment status
   - Show shipping tracking
   - Handle cancellations

## 🎉 What You Can Do Now

After this migration, your database supports:
- ✅ Complete Razorpay payment tracking
- ✅ COD with fee calculation
- ✅ Promo code discounts
- ✅ Shipping zone pricing
- ✅ Order status tracking
- ✅ Payment status monitoring
- ✅ Delivery estimation
- ✅ Shipment tracking
- ✅ Order cancellations

## 📞 Need Help?

If you encounter any issues:
1. Check Supabase logs in Dashboard → "Logs"
2. Verify your database connection
3. Make sure you have admin permissions
4. Check if RLS policies are correct

## 🔐 Important Notes

1. **Never store Razorpay Key Secret in database** - Keep it in `.env` file only
2. **Payment ID vs Key ID** - `payment_id` is the transaction ID from Razorpay, not your API key
3. **Test Mode** - Always test with Razorpay test keys before going live
4. **Webhooks** - Consider setting up Razorpay webhooks for real-time payment updates

---

**Migration File**: `supabase/migrations/20251101000000_add_payment_fields_to_orders.sql`
**Status**: Ready to apply
**Last Updated**: November 1, 2025
