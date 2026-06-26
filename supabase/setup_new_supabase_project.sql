-- MITTHUUG CONSOLIDATED SCHEMA SETUP SCRIPT
-- Generated on 2026-06-26T13:15:47.545Z
-- Paste this entire script into your Supabase SQL Editor and run it.

-- ==========================================
-- CLEANUP BLOCK (Drop existing tables to allow a clean setup rerun)
-- ==========================================
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS referral_codes CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS review_helpful_votes CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS admin_activity_logs CASCADE;


-- ==========================================
-- MIGRATION: 20251030091406_create_products_and_users_tables.sql
-- ==========================================

/*
  # Create E-Commerce Database Schema for MitthuuG

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text)
      - `flavors` (text array)
      - `weight` (text)
      - `ingredients` (text array)
      - `stock_quantity` (integer)
      - `is_new` (boolean)
      - `is_bestseller` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `wishlists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `created_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `user_id` (uuid, references auth.users)
      - `rating` (integer, 1-5)
      - `title` (text)
      - `comment` (text)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `order_number` (text, unique)
      - `status` (text)
      - `total_amount` (numeric)
      - `shipping_address` (jsonb)
      - `billing_address` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `price_at_time` (numeric)
      - `created_at` (timestamp)

    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `avatar_url` (text)
      - `default_shipping_address` (jsonb)
      - `default_billing_address` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to products, categories, and reviews
    - Add policies for users to manage their wishlists and view their orders
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  category text NOT NULL,
  flavors text[] DEFAULT '{}',
  weight text NOT NULL,
  ingredients text[] NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_new boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  default_shipping_address jsonb,
  default_billing_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist"
  ON wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  shipping_address jsonb NOT NULL,
  billing_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_time numeric NOT NULL CHECK (price_at_time >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Insert initial categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Gud Bites', 'gud-bites', 'Our signature modern take on traditional sweets', 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg'),
  ('Traditional', 'traditional', 'Classic recipes passed down through generations', 'https://images.pexels.com/photos/4686820/pexels-photo-4686820.jpeg'),
  ('Gift Sets', 'gift-sets', 'Curated collections perfect for gifting', 'https://images.pexels.com/photos/4686822/pexels-photo-4686822.jpeg')
ON CONFLICT (slug) DO NOTHING;

-- Insert initial products
INSERT INTO products (name, description, price, image_url, category, flavors, weight, ingredients, stock_quantity, is_new, is_bestseller) VALUES
  (
    'Til Gud Bites - Classic',
    'Handcrafted sesame and jaggery bites with a modern twist. Our signature blend combines traditional til revdi with contemporary flavors.',
    349,
    'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg',
    'gud-bites',
    ARRAY['Classic', 'Dark Chocolate', 'Rose'],
    '250g',
    ARRAY['Sesame Seeds', 'Organic Jaggery', 'Cardamom', 'Ghee'],
    100,
    true,
    true
  ),
  (
    'Peanut Chakki Luxe',
    'Reimagined peanut brittle with artisanal quality. Perfectly roasted peanuts in golden jaggery, crafted for the modern palate.',
    299,
    'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
    'gud-bites',
    ARRAY[]::text[],
    '200g',
    ARRAY['Premium Peanuts', 'Jaggery', 'Sea Salt', 'Vanilla'],
    150,
    false,
    true
  ),
  (
    'Til Gud Bites - Dark Chocolate',
    'An indulgent fusion of traditional til revdi infused with premium dark chocolate. A guilt-free luxury treat.',
    399,
    'https://images.pexels.com/photos/3776942/pexels-photo-3776942.jpeg',
    'gud-bites',
    ARRAY['Dark Chocolate', 'Mint Chocolate'],
    '250g',
    ARRAY['Sesame Seeds', 'Jaggery', 'Dark Chocolate 70%', 'Cardamom'],
    80,
    true,
    false
  ),
  (
    'Mixed Gud Bites Collection',
    'A curated selection of our finest gud bites. Perfect for gifting or experiencing the full MitthuuG range.',
    799,
    'https://images.pexels.com/photos/4686820/pexels-photo-4686820.jpeg',
    'gift-sets',
    ARRAY[]::text[],
    '500g',
    ARRAY['Assorted Varieties'],
    50,
    false,
    true
  ),
  (
    'Rose Pistachio Gud Bites',
    'Delicate rose essence meets crunchy pistachios in this premium creation. A sophisticated take on traditional sweets.',
    449,
    'https://images.pexels.com/photos/4686822/pexels-photo-4686822.jpeg',
    'gud-bites',
    ARRAY[]::text[],
    '250g',
    ARRAY['Sesame', 'Jaggery', 'Rose Water', 'Pistachios', 'Saffron'],
    60,
    true,
    false
  ),
  (
    'Peanut Chakki - Salted Caramel',
    'Modern innovation meets tradition. Our peanut chakki elevated with a hint of salted caramel flavor.',
    349,
    'https://images.pexels.com/photos/4686918/pexels-photo-4686918.jpeg',
    'gud-bites',
    ARRAY[]::text[],
    '200g',
    ARRAY['Peanuts', 'Jaggery', 'Sea Salt', 'Natural Caramel'],
    120,
    false,
    false
  )
ON CONFLICT DO NOTHING;



-- ==========================================
-- MIGRATION: 20251101000000_add_payment_fields_to_orders.sql
-- ==========================================

-- Add payment and business logic fields to orders table
-- Migration: Add Razorpay integration fields
-- Date: 2025-11-01

-- Add new columns to orders table
ALTER TABLE orders
  -- Payment Information
  ADD COLUMN IF NOT EXISTS payment_id text,
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cod',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  
  -- Pricing Breakdown
  ADD COLUMN IF NOT EXISTS subtotal_amount numeric NOT NULL DEFAULT 0 CHECK (subtotal_amount >= 0),
  ADD COLUMN IF NOT EXISTS discount_amount numeric NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  ADD COLUMN IF NOT EXISTS shipping_fee numeric NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  ADD COLUMN IF NOT EXISTS cod_fee numeric NOT NULL DEFAULT 0 CHECK (cod_fee >= 0),
  
  -- Promo Code
  ADD COLUMN IF NOT EXISTS promo_code text,
  
  -- Shipping Information
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS estimated_delivery_start date,
  ADD COLUMN IF NOT EXISTS estimated_delivery_end date,
  ADD COLUMN IF NOT EXISTS shipping_zone text,
  
  -- Additional Metadata
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS cancellation_reason text,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

-- Add comments for documentation
COMMENT ON COLUMN orders.payment_id IS 'Razorpay payment ID (e.g., pay_xxxxx)';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: razorpay, cod, upi';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, completed, failed, refunded';
COMMENT ON COLUMN orders.subtotal_amount IS 'Order subtotal before discounts and fees';
COMMENT ON COLUMN orders.discount_amount IS 'Total discount applied from promo codes';
COMMENT ON COLUMN orders.shipping_fee IS 'Shipping fee based on zone';
COMMENT ON COLUMN orders.cod_fee IS 'COD fee (2% of order value)';
COMMENT ON COLUMN orders.promo_code IS 'Applied promo code (e.g., WELCOME10)';
COMMENT ON COLUMN orders.shipping_zone IS 'Shipping zone: Metro, Tier1, Tier2, Remote';
COMMENT ON COLUMN orders.tracking_number IS 'Courier tracking number';

-- Create index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- Create index on payment_status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Create index on status for order management
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Add check constraint for payment method (drop first if exists)
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS valid_payment_method;
  
ALTER TABLE orders
  ADD CONSTRAINT valid_payment_method 
  CHECK (payment_method IN ('razorpay', 'cod', 'upi', 'bank_transfer'));

-- Add check constraint for payment status (drop first if exists)
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS valid_payment_status;

ALTER TABLE orders
  ADD CONSTRAINT valid_payment_status 
  CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded'));

-- Add check constraint for order status
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS valid_order_status;
  
ALTER TABLE orders
  ADD CONSTRAINT valid_order_status 
  CHECK (status IN ('pending', 'payment_pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- Update existing orders to have proper status
UPDATE orders 
SET 
  payment_method = 'cod',
  payment_status = 'pending',
  subtotal_amount = total_amount
WHERE payment_method IS NULL;

-- Create a function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS orders_updated_at_trigger ON orders;
CREATE TRIGGER orders_updated_at_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- Add policy for admin to update payment status (you'll need to implement admin role)
-- For now, users can update their own orders (for COD orders)
DROP POLICY IF EXISTS "Users can update own order status" ON orders;
CREATE POLICY "Users can update own order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO anon;

COMMENT ON TABLE orders IS 'Customer orders with full payment and shipping tracking';



-- ==========================================
-- MIGRATION: 20251101000001_fix_user_profiles_rls.sql
-- ==========================================

-- Fix RLS (Row-Level Security) Policies for Authentication
-- This allows users to create and manage their own profiles
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Enable RLS on user_profiles table
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Drop existing policies (if any)
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON user_profiles;

-- ============================================
-- STEP 3: Create new comprehensive policies
-- ============================================

-- Policy 1: Allow users to INSERT their own profile during signup
CREATE POLICY "Users can insert own profile on signup"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 2: Allow users to VIEW their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 3: Allow users to UPDATE their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Allow users to DELETE their own profile (optional)
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================
-- STEP 4: Create a trigger to auto-create profile
-- (This creates profile automatically when user signs up)
-- ============================================

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 5: Grant necessary permissions
-- ============================================

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on user_profiles table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Expected output: You should see 4 policies (INSERT, SELECT, UPDATE, DELETE)



-- ==========================================
-- MIGRATION: 20251101000003_add_missing_product_columns.sql
-- ==========================================

-- Add Missing Columns to Products Table
-- This migration adds all the fields required by the products seed data

-- Add missing columns to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS sku text UNIQUE,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS short_desc text,
  ADD COLUMN IF NOT EXISTS long_desc text,
  ADD COLUMN IF NOT EXISTS bullets text[],
  ADD COLUMN IF NOT EXISTS nutrition_highlights jsonb,
  ADD COLUMN IF NOT EXISTS alt_text text,
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text;

-- Update existing data: copy 'name' to 'title' if title is null
UPDATE products 
SET title = name 
WHERE title IS NULL;

-- Update existing data: copy 'description' to 'long_desc' if long_desc is null
UPDATE products 
SET long_desc = description 
WHERE long_desc IS NULL;

-- Make title and long_desc NOT NULL after copying data
ALTER TABLE products 
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN long_desc SET NOT NULL;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully added missing columns to products table!';
  RAISE NOTICE '📋 Added: sku, title, short_desc, long_desc, bullets, nutrition_highlights, alt_text, meta_title, meta_description';
  RAISE NOTICE '🔄 Migrated existing data from name → title and description → long_desc';
END $$;



-- ==========================================
-- MIGRATION: 20251101000004_seed_products.sql
-- ==========================================

-- Seed Products for MitthuuG E-Commerce
-- This migration populates the products table with 5 initial products

-- First, clear any existing products (for clean re-seeding)
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- Insert 5 MitthuuG Products
INSERT INTO products (
  sku,
  name,
  title,
  description,
  short_desc,
  long_desc,
  bullets,
  ingredients,
  nutrition_highlights,
  alt_text,
  meta_title,
  meta_description,
  price,
  image_url,
  category,
  weight,
  is_new,
  is_bestseller,
  stock_quantity,
  created_at,
  updated_at
) VALUES
-- 1. Classic Til-Gud Bites (Bestseller)
(
  'MG-TIL-CL-100',
  'Classic Til-Gud Bites',
  'Classic Til-Gud Bites',
  'Crispy sesame & jaggery bites made for everyday snacking.',
  'Crispy sesame & jaggery bites made for everyday snacking.',
  'Our signature Til-Gud Bites combine earthy sesame seeds with pure jaggery, delivering warmth, crunch, and nostalgia in every bite. Handcrafted in small batches using traditional recipes passed down through generations, these golden nuggets are your perfect companion for chai-time or gifting during festivals. No refined sugar, no preservatives – just pure, honest ingredients that taste like home.',
  ARRAY[
    'Handcrafted in small batches',
    'No refined sugar – only natural jaggery',
    'Perfect winter energy snack',
    'Rich in calcium and iron',
    'Ideal for gifting and snacking'
  ],
  ARRAY['Sesame seeds (49%)', 'Jaggery (49%)', 'Cardamom', 'Ghee'],
  '{
    "Energy": "420 kcal/100g",
    "Protein": "10g",
    "Fats": "15g",
    "Carbohydrates": "55g",
    "Iron": "12mg",
    "Calcium": "250mg"
  }'::jsonb,
  'Classic Til-Gud Bites – Indian sesame jaggery snack by MitthuuG',
  'Classic Til Gud Bites | Healthy Sesame Snack',
  'Crunchy Til Gud Bites from MitthuuG — handcrafted sesame & jaggery snacks made for gifting and snacking.',
  349.00,
  'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg',
  'gud-bites',
  '250g',
  false,
  true,
  100,
  NOW(),
  NOW()
),

-- 2. Cardamom Til-Gud Bites (New)
(
  'MG-TIL-CR-100',
  'Cardamom Til-Gud Bites',
  'Cardamom Til-Gud Bites',
  'Aromatic cardamom meets sesame & jaggery bliss.',
  'Aromatic cardamom meets sesame & jaggery bliss.',
  'Elevate your snacking with our Cardamom Til-Gud Bites – where the royal spice of cardamom infuses every bite with warmth and aroma. These premium bites blend roasted sesame, natural jaggery, and freshly ground cardamom for a sophisticated twist on the classic. Perfect for those who appreciate the finer nuances of traditional Indian flavors with a modern, artisanal touch.',
  ARRAY[
    'Premium green cardamom from Kerala',
    'Aromatic and flavorful',
    'No artificial flavoring',
    'Great for festive gifting',
    'Perfect post-meal digestive treat'
  ],
  ARRAY['Sesame seeds (47%)', 'Jaggery (47%)', 'Green Cardamom (4%)', 'Ghee', 'Himalayan Pink Salt'],
  '{
    "Energy": "425 kcal/100g",
    "Protein": "11g",
    "Fats": "16g",
    "Carbohydrates": "54g",
    "Iron": "11mg",
    "Calcium": "240mg"
  }'::jsonb,
  'Cardamom Til-Gud Bites – Premium sesame jaggery cardamom snack by MitthuuG',
  'Cardamom Til Gud Bites | Premium Indian Snack',
  'Aromatic Cardamom Til Gud Bites – handcrafted with green cardamom, sesame & jaggery. Perfect for gifting.',
  399.00,
  'https://images.pexels.com/photos/3776942/pexels-photo-3776942.jpeg',
  'gud-bites',
  '250g',
  true,
  false,
  75,
  NOW(),
  NOW()
),

-- 3. Almond Til-Gud Bites (Premium - New)
(
  'MG-TIL-AL-100',
  'Almond Til-Gud Bites',
  'Almond Til-Gud Bites',
  'Nutty almond richness in every crunchy bite.',
  'Nutty almond richness in every crunchy bite.',
  'Indulge in luxury with our Almond Til-Gud Bites – a premium blend of roasted California almonds, sesame seeds, and golden jaggery. Each bite delivers a satisfying crunch and rich, nutty flavor that makes this our most premium offering. Packed with protein and healthy fats, these bites are as nutritious as they are delicious. Perfect for corporate gifting or treating yourself to something special.',
  ARRAY[
    'Premium California almonds',
    'High protein and healthy fats',
    'Luxury gifting option',
    'Energy-packed superfood snack',
    'No refined sugar or preservatives'
  ],
  ARRAY['Sesame seeds (40%)', 'Jaggery (35%)', 'California Almonds (23%)', 'Ghee', 'Rock Salt'],
  '{
    "Energy": "485 kcal/100g",
    "Protein": "14g",
    "Fats": "22g",
    "Carbohydrates": "48g",
    "Iron": "10mg",
    "Calcium": "220mg"
  }'::jsonb,
  'Almond Til-Gud Bites – Premium almond sesame jaggery snack by MitthuuG',
  'Almond Til Gud Bites | Premium Healthy Snack',
  'Luxury Almond Til Gud Bites with California almonds, sesame & jaggery. Perfect corporate gift.',
  499.00,
  'https://images.pexels.com/photos/4686822/pexels-photo-4686822.jpeg',
  'gud-bites',
  '250g',
  true,
  false,
  50,
  NOW(),
  NOW()
),

-- 4. GUD Bites Trial Pack (Bestseller)
(
  'MG-TRIAL-50',
  'GUD Bites Trial Pack',
  'GUD Bites Trial Pack',
  'First time trying MitthuuG? Start your journey here!',
  'First time trying MitthuuG? Start your journey here!',
  'Not sure which flavor to pick? Our Trial Pack is your perfect introduction to the world of MitthuuG! This 50g sampler includes a mix of our Classic and Cardamom Til-Gud Bites, giving you a taste of tradition and innovation in one convenient pack. Perfect for first-timers, travel snacking, or tucking into your desk drawer for those 4pm cravings. Welcome aboard the Mitthu Express!',
  ARRAY[
    'Perfect for first-time buyers',
    'Mix of 2 popular flavors',
    'Travel-friendly portion',
    'Great for desk snacking',
    'Money-back satisfaction guarantee'
  ],
  ARRAY['Mix of Classic and Cardamom Til-Gud Bites (see individual products for full ingredients)'],
  '{
    "Energy": "422 kcal/100g (average)",
    "Protein": "10.5g",
    "Fats": "15.5g",
    "Carbohydrates": "54.5g"
  }'::jsonb,
  'MitthuuG GUD Bites Trial Pack – Sampler of sesame jaggery snacks',
  'Trial Pack | Try MitthuuG GUD Bites | 50g Sampler',
  'Try MitthuuG GUD Bites with our 50g trial pack. Perfect introduction to handcrafted til-gud snacks.',
  99.00,
  'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
  'trial-pack',
  '50g',
  false,
  true,
  150,
  NOW(),
  NOW()
),

-- 5. Premium Gift Box (Bestseller)
(
  'MG-GIFT-500',
  'Premium Gift Box (500g)',
  'Premium Gift Box (500g)',
  'Share GUD vibes with our luxurious festive hamper.',
  'Share GUD vibes with our luxurious festive hamper.',
  'Make every occasion special with our Premium Gift Box – a beautifully curated 500g hamper featuring all three of our signature flavors: Classic, Cardamom, and Almond Til-Gud Bites. Packaged in an elegant ochre and gold box with traditional motifs, this is gifting done right. Perfect for Diwali, weddings, corporate events, or showing someone you care. Each box includes a handwritten note option and premium jute packaging. Because some traditions deserve to be shared in style.',
  ARRAY[
    'All 3 premium flavors included',
    'Elegant gift packaging',
    'Handwritten note option available',
    'Perfect for festivals and corporate gifting',
    'Eco-friendly jute packaging'
  ],
  ARRAY['Contains all three variants – Classic, Cardamom, and Almond Til-Gud Bites'],
  '{
    "Energy": "443 kcal/100g (average)",
    "Protein": "11.8g",
    "Fats": "17.7g",
    "Carbohydrates": "52.3g"
  }'::jsonb,
  'MitthuuG Premium Gift Box – Luxury Indian sweets gift hamper',
  'Premium Gift Box 500g | MitthuuG Festive Hamper',
  'Luxury MitthuuG Gift Box with 3 flavors. Perfect for Diwali, weddings & corporate gifting. Premium packaging.',
  799.00,
  'https://images.pexels.com/photos/4686820/pexels-photo-4686820.jpeg',
  'gift-sets',
  '500g',
  false,
  true,
  60,
  NOW(),
  NOW()
);

-- Verify the insert
SELECT 
  id,
  sku,
  title,
  price,
  category,
  is_bestseller,
  is_new,
  stock_quantity
FROM products
ORDER BY 
  CASE 
    WHEN is_bestseller THEN 1 
    ELSE 2 
  END,
  price DESC;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully seeded 5 products into the database!';
  RAISE NOTICE '📦 Products: Classic (₹349), Cardamom (₹399), Almond (₹499), Trial Pack (₹99), Gift Box (₹799)';
  RAISE NOTICE '⭐ 3 Bestsellers, 2 New arrivals';
END $$;



-- ==========================================
-- MIGRATION: 20251102000000_create_admin_system.sql
-- ==========================================

-- Create Admin System for MitthuuG E-Commerce
-- This migration adds admin role management and permissions

-- Add role column to user_profiles table
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin'));

-- Add index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Create admin_activity_logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL, -- 'product', 'order', 'user', etc.
  entity_id uuid,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update products table RLS policies for admin access
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Admins can manage products
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Update orders table RLS policies for admin access
DROP POLICY IF EXISTS "Users can update own order status" ON orders;

-- Users can view own orders (keep existing)
-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Admins can update any order
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Super admins can view all user profiles
CREATE POLICY "Admins can view all user profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'super_admin')
    )
  );

-- Super admins can update user roles
CREATE POLICY "Super admins can update user roles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  )
  WITH CHECK (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_id
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_id
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_changes jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, changes)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_changes);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial super admin (you'll need to update this with your user ID)
-- Get your user ID from: SELECT id, email FROM auth.users;
-- Then update user_profiles role manually or use this after signup:
-- UPDATE user_profiles SET role = 'super_admin' WHERE id = 'your-user-id';

-- Create view for admin dashboard stats (Views don't support RLS, but access is controlled through underlying tables)
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM orders) as total_orders,
  (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days') as orders_last_30_days,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'shipped') as shipped_orders,
  (SELECT SUM(total_amount) FROM orders WHERE payment_status = 'completed') as total_revenue,
  (SELECT SUM(total_amount) FROM orders WHERE payment_status = 'completed' AND created_at >= NOW() - INTERVAL '30 days') as revenue_last_30_days,
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM products WHERE stock_quantity < 10) as low_stock_products,
  (SELECT COUNT(*) FROM user_profiles) as total_customers,
  (SELECT COUNT(*) FROM user_profiles WHERE created_at >= NOW() - INTERVAL '30 days') as new_customers_last_30_days;

-- Grant access to admin dashboard stats view
GRANT SELECT ON admin_dashboard_stats TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin system created successfully!';
  RAISE NOTICE '🔐 Added role-based access control (customer, admin, super_admin)';
  RAISE NOTICE '📊 Created admin dashboard stats view';
  RAISE NOTICE '📝 Created admin activity logging system';
  RAISE NOTICE '⚠️  IMPORTANT: Set your first super admin with: UPDATE user_profiles SET role = ''super_admin'' WHERE id = ''your-user-id'';';
END $$;



-- ==========================================
-- MIGRATION: 20251102000000_create_product_images_storage.sql
-- ==========================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow anyone to view product images (public bucket)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public Access to product images'
  ) THEN
    CREATE POLICY "Public Access to product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');
  END IF;
END $$;

-- Policy: Allow authenticated users to upload product images
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload product images'
  ) THEN
    CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');
  END IF;
END $$;

-- Policy: Allow authenticated users to update product images
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update product images'
  ) THEN
    CREATE POLICY "Authenticated users can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images');
  END IF;
END $$;

-- Policy: Allow authenticated users to delete product images
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete product images'
  ) THEN
    CREATE POLICY "Authenticated users can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');
  END IF;
END $$;

-- Add images column to products table (array of image URLs)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Update existing products to use images array
UPDATE products 
SET images = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' 
  THEN ARRAY[image_url]
  ELSE '{}'
END
WHERE images = '{}' OR images IS NULL;



-- ==========================================
-- MIGRATION: 20251102000001_create_wishlists_table.sql
-- ==========================================

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wishlist items
CREATE POLICY "Users can view own wishlist"
ON wishlists FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can add to their wishlist
CREATE POLICY "Users can add to wishlist"
ON wishlists FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove from their wishlist
CREATE POLICY "Users can delete from wishlist"
ON wishlists FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);

-- Function to get wishlist count for a user
CREATE OR REPLACE FUNCTION get_wishlist_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM wishlists WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- ==========================================
-- MIGRATION: 20251102000002_add_order_tracking_fields.sql
-- ==========================================

-- Add tracking fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_carrier VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- Add shipping status tracking
CREATE TYPE shipping_status AS ENUM ('pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned');

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_status shipping_status DEFAULT 'pending';

-- Create order_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  shipping_status shipping_status,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own order history
CREATE POLICY "Users can view own order history"
ON order_status_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Policy: Admins can view all order history
CREATE POLICY "Admins can view all order history"
ON order_status_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('admin', 'super_admin')
  )
);

-- Policy: Admins can insert order history
CREATE POLICY "Admins can insert order history"
ON order_status_history FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('admin', 'super_admin')
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- Function to add status history entry when order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND (OLD.status IS DISTINCT FROM NEW.status OR OLD.shipping_status IS DISTINCT FROM NEW.shipping_status)) THEN
    INSERT INTO order_status_history (order_id, status, shipping_status, created_by)
    VALUES (NEW.id, NEW.status, NEW.shipping_status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic status logging
DROP TRIGGER IF EXISTS trigger_log_order_status_change ON orders;
CREATE TRIGGER trigger_log_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();



-- ==========================================
-- MIGRATION: 20251102000003_enhance_reviews_system.sql
-- ==========================================

-- Enhancement for Customer Reviews System
-- Add photo uploads, verified purchase, helpful votes, and admin moderation

-- Add new columns to reviews table
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS verified_purchase boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS helpful_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create review_helpful_votes table for tracking who voted helpful
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Enable RLS on review_helpful_votes
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for review_helpful_votes
CREATE POLICY "Anyone can view helpful votes"
  ON review_helpful_votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can vote helpful"
  ON review_helpful_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their helpful vote"
  ON review_helpful_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update reviews policy to only show approved reviews to public
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;

CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  TO public
  USING (is_approved = true);

-- Function to update helpful_count when votes change
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews
    SET helpful_count = helpful_count - 1
    WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update helpful_count
DROP TRIGGER IF EXISTS update_review_helpful_count_trigger ON review_helpful_votes;
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR DELETE ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on reviews
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get rating breakdown for a product
CREATE OR REPLACE FUNCTION get_rating_breakdown(p_product_id uuid)
RETURNS TABLE (
  rating integer,
  count bigint,
  percentage numeric
) AS $$
DECLARE
  total_reviews bigint;
BEGIN
  SELECT COUNT(*) INTO total_reviews
  FROM reviews
  WHERE product_id = p_product_id AND is_approved = true;

  RETURN QUERY
  SELECT
    r.rating,
    COUNT(*) as count,
    CASE
      WHEN total_reviews > 0 THEN ROUND((COUNT(*)::numeric / total_reviews) * 100, 1)
      ELSE 0
    END as percentage
  FROM reviews r
  WHERE r.product_id = p_product_id AND r.is_approved = true
  GROUP BY r.rating
  ORDER BY r.rating DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if purchase is verified
-- (checks if user ordered this product)
CREATE OR REPLACE FUNCTION check_verified_purchase(p_user_id uuid, p_product_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.user_id = p_user_id
    AND oi.product_id = p_product_id
    AND o.status IN ('completed', 'shipped', 'delivered')
  );
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved ON reviews(product_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_user ON review_helpful_votes(user_id);



-- ==========================================
-- MIGRATION: 20251102000004_create_subscriptions_system.sql
-- ==========================================

-- Subscription/Auto-Delivery System
-- Allows customers to set up recurring orders with flexible schedules

-- Create subscription_frequency enum
CREATE TYPE subscription_frequency AS ENUM (
  'weekly',
  'biweekly',
  'monthly',
  'custom'
);

-- Create subscription_status enum
CREATE TYPE subscription_status AS ENUM (
  'active',
  'paused',
  'cancelled',
  'expired'
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  frequency subscription_frequency NOT NULL DEFAULT 'monthly',
  custom_interval_days integer CHECK (custom_interval_days IS NULL OR custom_interval_days > 0),
  status subscription_status NOT NULL DEFAULT 'active',
  discount_percentage numeric(5,2) DEFAULT 10.00 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  next_delivery_date date NOT NULL,
  last_order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  last_delivery_date date,
  total_orders_created integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  cancellation_reason text
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate next delivery date based on frequency
CREATE OR REPLACE FUNCTION calculate_next_delivery_date(
  p_frequency subscription_frequency,
  p_custom_interval_days integer,
  p_current_date date DEFAULT CURRENT_DATE
)
RETURNS date AS $$
BEGIN
  CASE p_frequency
    WHEN 'weekly' THEN
      RETURN p_current_date + INTERVAL '7 days';
    WHEN 'biweekly' THEN
      RETURN p_current_date + INTERVAL '14 days';
    WHEN 'monthly' THEN
      RETURN p_current_date + INTERVAL '1 month';
    WHEN 'custom' THEN
      IF p_custom_interval_days IS NULL THEN
        RAISE EXCEPTION 'Custom interval days required for custom frequency';
      END IF;
      RETURN p_current_date + (p_custom_interval_days || ' days')::interval;
    ELSE
      RAISE EXCEPTION 'Invalid frequency: %', p_frequency;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate subscription price with discount
CREATE OR REPLACE FUNCTION calculate_subscription_price(
  p_product_id uuid,
  p_quantity integer,
  p_discount_percentage numeric
)
RETURNS TABLE (
  original_price numeric,
  discount_amount numeric,
  final_price numeric,
  savings numeric
) AS $$
DECLARE
  v_product_price numeric;
BEGIN
  -- Get product price
  SELECT price INTO v_product_price
  FROM products
  WHERE id = p_product_id;

  IF v_product_price IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  original_price := v_product_price * p_quantity;
  discount_amount := original_price * (p_discount_percentage / 100);
  final_price := original_price - discount_amount;
  savings := discount_amount;

  RETURN QUERY SELECT original_price, discount_amount, final_price, savings;
END;
$$ LANGUAGE plpgsql;

-- Function to get active subscriptions due for delivery
CREATE OR REPLACE FUNCTION get_due_subscriptions()
RETURNS TABLE (
  subscription_id uuid,
  user_id uuid,
  product_id uuid,
  quantity integer,
  next_delivery_date date
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.user_id,
    s.product_id,
    s.quantity,
    s.next_delivery_date
  FROM subscriptions s
  WHERE s.status = 'active'
    AND s.next_delivery_date <= CURRENT_DATE
  ORDER BY s.next_delivery_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to process subscription order (called by cron/backend)
CREATE OR REPLACE FUNCTION process_subscription_order(p_subscription_id uuid)
RETURNS uuid AS $$
DECLARE
  v_subscription subscriptions%ROWTYPE;
  v_order_id uuid;
  v_user_address text;
  v_user_city text;
  v_user_state text;
  v_user_zip text;
  v_product_price numeric;
  v_discount_amount numeric;
BEGIN
  -- Get subscription details
  SELECT * INTO v_subscription
  FROM subscriptions
  WHERE id = p_subscription_id AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active subscription not found';
  END IF;

  -- Get user's default address (from users table or last order)
  -- This is simplified - in production you'd want a separate addresses table
  
  -- Get product price
  SELECT price INTO v_product_price
  FROM products
  WHERE id = v_subscription.product_id;

  -- Calculate discount
  v_discount_amount := v_product_price * v_subscription.quantity * (v_subscription.discount_percentage / 100);

  -- Create order
  INSERT INTO orders (
    user_id,
    total_amount,
    shipping_address,
    shipping_city,
    shipping_state,
    shipping_zip_code,
    status,
    payment_status
  ) VALUES (
    v_subscription.user_id,
    (v_product_price * v_subscription.quantity) - v_discount_amount,
    COALESCE(v_user_address, 'Subscription Address'),
    COALESCE(v_user_city, 'City'),
    COALESCE(v_user_state, 'State'),
    COALESCE(v_user_zip, '000000'),
    'pending',
    'pending'
  )
  RETURNING id INTO v_order_id;

  -- Create order item
  INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    price_at_purchase
  ) VALUES (
    v_order_id,
    v_subscription.product_id,
    v_subscription.quantity,
    v_product_price
  );

  -- Update subscription
  UPDATE subscriptions
  SET
    last_order_id = v_order_id,
    last_delivery_date = CURRENT_DATE,
    next_delivery_date = calculate_next_delivery_date(
      frequency,
      custom_interval_days,
      CURRENT_DATE
    ),
    total_orders_created = total_orders_created + 1
  WHERE id = p_subscription_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_product ON subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON subscriptions(next_delivery_date) WHERE status = 'active';



-- ==========================================
-- MIGRATION: 20251102000005_create_referral_program.sql
-- ==========================================

-- Referral Program System
-- Allows users to refer friends and earn rewards

-- Create referral_status enum
CREATE TYPE referral_status AS ENUM (
  'pending',
  'completed',
  'expired',
  'cancelled'
);

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code text UNIQUE NOT NULL,
  discount_percentage numeric(5,2) DEFAULT 10.00 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  max_uses integer DEFAULT NULL CHECK (max_uses IS NULL OR max_uses > 0),
  current_uses integer DEFAULT 0 CHECK (current_uses >= 0),
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, code)
);

-- Create referrals table to track who referred whom
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referral_code_id uuid REFERENCES referral_codes(id) ON DELETE CASCADE NOT NULL,
  status referral_status DEFAULT 'pending' NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  referrer_reward_amount numeric(10,2) DEFAULT 0.00,
  referred_discount_amount numeric(10,2) DEFAULT 0.00,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referred_user_id, referral_code_id)
);

-- Enable RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS policies for referral_codes
CREATE POLICY "Users can view own referral codes"
  ON referral_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own referral codes"
  ON referral_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own referral codes"
  ON referral_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active referral codes by code"
  ON referral_codes FOR SELECT
  TO public
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- RLS policies for referrals
CREATE POLICY "Users can view own referrals as referrer"
  ON referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view own referrals as referred"
  ON referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referred_user_id);

CREATE POLICY "System can create referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update referrals"
  ON referrals FOR UPDATE
  TO authenticated
  USING (true);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id uuid)
RETURNS text AS $$
DECLARE
  v_code text;
  v_exists boolean;
BEGIN
  LOOP
    -- Generate a random 8-character code (uppercase letters and numbers)
    v_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = v_code) INTO v_exists;
    
    -- If code doesn't exist, exit loop
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to apply referral code
CREATE OR REPLACE FUNCTION apply_referral_code(
  p_code text,
  p_referred_user_id uuid
)
RETURNS TABLE (
  success boolean,
  message text,
  discount_percentage numeric,
  referral_code_id uuid,
  referrer_id uuid
) AS $$
DECLARE
  v_referral_code referral_codes%ROWTYPE;
  v_referral_id uuid;
BEGIN
  -- Get referral code details
  SELECT * INTO v_referral_code
  FROM referral_codes
  WHERE code = p_code
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR current_uses < max_uses);

  -- Check if code exists and is valid
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Invalid or expired referral code'::text, 0::numeric, NULL::uuid, NULL::uuid;
    RETURN;
  END IF;

  -- Check if user is trying to use their own code
  IF v_referral_code.user_id = p_referred_user_id THEN
    RETURN QUERY SELECT false, 'Cannot use your own referral code'::text, 0::numeric, NULL::uuid, NULL::uuid;
    RETURN;
  END IF;

  -- Check if user already used this code
  IF EXISTS(
    SELECT 1 FROM referrals
    WHERE referred_user_id = p_referred_user_id
      AND referral_code_id = v_referral_code.id
  ) THEN
    RETURN QUERY SELECT false, 'Referral code already used'::text, 0::numeric, NULL::uuid, NULL::uuid;
    RETURN;
  END IF;

  -- Create referral record
  INSERT INTO referrals (
    referrer_id,
    referred_user_id,
    referral_code_id,
    referred_discount_amount
  ) VALUES (
    v_referral_code.user_id,
    p_referred_user_id,
    v_referral_code.id,
    v_referral_code.discount_percentage
  )
  RETURNING id INTO v_referral_id;

  -- Increment usage count
  UPDATE referral_codes
  SET current_uses = current_uses + 1
  WHERE id = v_referral_code.id;

  RETURN QUERY SELECT 
    true,
    'Referral code applied successfully'::text,
    v_referral_code.discount_percentage,
    v_referral_code.id,
    v_referral_code.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to complete referral (called when referred user makes first purchase)
CREATE OR REPLACE FUNCTION complete_referral(
  p_order_id uuid,
  p_user_id uuid
)
RETURNS void AS $$
DECLARE
  v_referral referrals%ROWTYPE;
  v_reward_amount numeric;
BEGIN
  -- Find pending referral for this user
  SELECT * INTO v_referral
  FROM referrals
  WHERE referred_user_id = p_user_id
    AND status = 'pending'
  LIMIT 1;

  IF FOUND THEN
    -- Calculate reward (e.g., 10% of order total or fixed amount)
    SELECT total_amount * 0.10 INTO v_reward_amount
    FROM orders
    WHERE id = p_order_id;

    -- Update referral as completed
    UPDATE referrals
    SET 
      status = 'completed',
      order_id = p_order_id,
      referrer_reward_amount = v_reward_amount,
      completed_at = now()
    WHERE id = v_referral.id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get referral statistics
CREATE OR REPLACE FUNCTION get_referral_stats(p_user_id uuid)
RETURNS TABLE (
  total_referrals bigint,
  pending_referrals bigint,
  completed_referrals bigint,
  total_earnings numeric,
  total_code_uses bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_referrals,
    COUNT(*) FILTER (WHERE status = 'pending')::bigint as pending_referrals,
    COUNT(*) FILTER (WHERE status = 'completed')::bigint as completed_referrals,
    COALESCE(SUM(referrer_reward_amount), 0) as total_earnings,
    COALESCE((SELECT SUM(current_uses) FROM referral_codes WHERE user_id = p_user_id), 0)::bigint as total_code_uses
  FROM referrals
  WHERE referrer_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON referral_codes(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code_id);



-- ==========================================
-- MIGRATION: 20251102000006_create_chat_system.sql
-- ==========================================

-- Create chat_status enum
CREATE TYPE chat_status AS ENUM ('active', 'closed', 'waiting');

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status chat_status DEFAULT 'waiting',
  subject TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_admin_id ON chat_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions
-- Users can view their own chat sessions
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own chat sessions
CREATE POLICY "Users can create own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own chat sessions
CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
-- Users can view messages in their chat sessions
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Users can create messages in their chat sessions
CREATE POLICY "Users can create own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = session_id
      AND chat_sessions.user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

-- Function to update last_message_at on chat_sessions
CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET last_message_at = NEW.created_at
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at when a new message is created
CREATE TRIGGER trigger_update_session_last_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_last_message();

-- Function to create a new chat session
CREATE OR REPLACE FUNCTION create_chat_session(
  p_user_id UUID,
  p_subject TEXT
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  INSERT INTO chat_sessions (user_id, subject, status)
  VALUES (p_user_id, p_subject, 'waiting')
  RETURNING id INTO v_session_id;
  
  -- Create system message
  INSERT INTO chat_messages (session_id, sender_id, message, is_system_message)
  VALUES (
    v_session_id,
    p_user_id,
    'Chat session started. A support agent will be with you shortly.',
    TRUE
  );
  
  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to assign admin to chat session
CREATE OR REPLACE FUNCTION assign_chat_admin(
  p_session_id UUID,
  p_admin_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_sessions
  SET admin_id = p_admin_id, status = 'active'
  WHERE id = p_session_id;
  
  -- Create system message
  INSERT INTO chat_messages (session_id, sender_id, message, is_system_message)
  VALUES (
    p_session_id,
    p_admin_id,
    'Support agent has joined the chat.',
    TRUE
  );
END;
$$ LANGUAGE plpgsql;

-- Function to close chat session
CREATE OR REPLACE FUNCTION close_chat_session(
  p_session_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_sessions
  SET status = 'closed', closed_at = NOW()
  WHERE id = p_session_id;
  
  -- Create system message
  INSERT INTO chat_messages (session_id, sender_id, message, is_system_message)
  SELECT 
    p_session_id,
    user_id,
    'Chat session has been closed.',
    TRUE
  FROM chat_sessions
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  p_session_id UUID,
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_messages
  SET read_at = NOW()
  WHERE session_id = p_session_id
    AND sender_id != p_user_id
    AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(
  p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO v_count
  FROM chat_messages cm
  JOIN chat_sessions cs ON cm.session_id = cs.id
  WHERE cs.user_id = p_user_id
    AND cm.sender_id != p_user_id
    AND cm.read_at IS NULL;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;



-- ==========================================
-- HELPER: make_admin.sql (Adds role/admin status helper)
-- ==========================================

-- Make yourself a super admin
-- Run this in the Supabase SQL Editor AFTER running the admin system migration

-- Method 1: Update by user ID (from the table editor)
-- Copy your user ID from the user_profiles table and paste it below
UPDATE user_profiles
SET role = 'super_admin'
WHERE id = 'aa6492eb-5448-4b96-997f-2f5c2f5c9e7a';  -- Replace with YOUR actual user ID

-- Method 2: If you want to see all users first
-- Uncomment and run this query to see all users with their auth email:
/*
SELECT 
  up.id, 
  up.full_name, 
  up.role,
  au.email
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id;
*/

-- Method 3: Update by matching against auth.users email
-- Replace 'mitthuug@gmail.com' with your actual email
/*
UPDATE user_profiles
SET role = 'super_admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'mitthuug@gmail.com'
);
*/


