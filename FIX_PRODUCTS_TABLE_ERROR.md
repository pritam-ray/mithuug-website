# 🔧 Fix: Products Table Column Error

## ❌ Error You're Seeing:
```
ERROR: 42703: column "sku" of relation "products" does not exist
LINE 9: sku,
```

## 🔍 Root Cause:
Your original products table was created with basic columns (`name`, `description`) but the seed migration expects enhanced columns (`sku`, `title`, `short_desc`, `long_desc`, `bullets`, `nutrition_highlights`, etc.).

---

## ✅ Solution: Run 3 Migrations in Order

### **Step 1: Add Missing Columns** (1 minute)

**File:** `supabase/migrations/20251101000003_add_missing_product_columns.sql`

**What it does:**
- Adds `sku`, `title`, `short_desc`, `long_desc`, `bullets`, `nutrition_highlights`, `alt_text`, `meta_title`, `meta_description`
- Migrates existing data from `name` → `title` and `description` → `long_desc`
- Makes new columns compatible with seed data

**How to run:**
1. Open [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor
2. Click "New Query"
3. Copy entire contents of `supabase/migrations/20251101000003_add_missing_product_columns.sql`
4. Paste and click **RUN**
5. ✅ You should see success notices

---

### **Step 2: Add Payment Fields** (1 minute)

**File:** `supabase/migrations/20251101000000_add_payment_fields_to_orders.sql`

**What it does:**
- Adds payment tracking fields to orders table
- Required for checkout to work properly

**How to run:**
1. SQL Editor → "New Query"
2. Copy entire contents of `supabase/migrations/20251101000000_add_payment_fields_to_orders.sql`
3. Paste and click **RUN**
4. ✅ Success message

---

### **Step 3: Seed Products** (1 minute)

**File:** `supabase/migrations/20251101000002_seed_products.sql`

**What it does:**
- Adds 5 products to your database
- Classic Til-Gud (₹349), Cardamom (₹399), Almond (₹499), Trial Pack (₹99), Gift Box (₹799)

**How to run:**
1. SQL Editor → "New Query"
2. Copy entire contents of `supabase/migrations/20251101000002_seed_products.sql`
3. Paste and click **RUN**
4. ✅ You should see a table with 5 products

---

## 📋 Quick Checklist

Run these in order:

- [ ] **Migration 1:** Add missing columns (`20251101000003_add_missing_product_columns.sql`)
- [ ] **Migration 2:** Add payment fields (`20251101000000_add_payment_fields_to_orders.sql`)
- [ ] **Migration 3:** Seed products (`20251101000002_seed_products.sql`)

**Total time: 3 minutes**

---

## ✅ Verify It Works

After running all 3 migrations:

1. **Check Products Table:**
   - Supabase → Table Editor → `products`
   - Should show 5 products with all columns (sku, title, price, etc.)

2. **Test Homepage:**
   ```bash
   npm run dev
   ```
   - Homepage should display 5 products
   - Product cards should show images, prices, descriptions

---

## 🐛 Troubleshooting

### Still getting "column does not exist" error?
**Solution:** Make sure you ran Migration 1 FIRST before Migration 3

### "Duplicate key value violates unique constraint"?
**Solution:** Your table already has products. Either:
- Option A: Delete existing products first
  ```sql
  TRUNCATE TABLE products RESTART IDENTITY CASCADE;
  ```
- Option B: Comment out the TRUNCATE line in the seed migration (line 5)

### Products showing but missing data?
**Solution:** Re-run Migration 3 (seed products) after clearing the table

---

## 📚 What Each Column Does

**Original columns:**
- `name` → Basic product name
- `description` → Basic description
- `price`, `image_url`, `category`, `weight` → Same as before

**New columns:**
- `sku` → Unique product identifier (e.g., "MG-TIL-CL-100")
- `title` → Display title (same as name)
- `short_desc` → Brief tagline for product cards
- `long_desc` → Detailed description for product page
- `bullets` → Array of feature points
- `nutrition_highlights` → JSON with nutritional info
- `alt_text` → SEO-friendly image description
- `meta_title` → Page title for SEO
- `meta_description` → Meta description for SEO

---

## 🚀 After Fixing

Once all migrations are run:

1. ✅ Products table will have all required columns
2. ✅ 5 products will be seeded
3. ✅ Payment fields will be ready for checkout
4. ✅ Website will be fully functional

---

**Run the migrations in order and you're good to go! 🎉**
