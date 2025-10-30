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
