-- Seed MitthuuG Products Database
-- Run this in your Supabase SQL Editor to populate initial data

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('GUD Bites', 'gud-bites', 'Our signature sesame and jaggery bites collection', 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg'),
  ('Gift Sets', 'gift-sets', 'Curated gift boxes perfect for celebrations', 'https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg'),
  ('Trial Packs', 'trial-packs', 'Try our flavors in smaller portions', 'https://images.pexels.com/photos/1028637/pexels-photo-1028637.jpeg')
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
INSERT INTO products (
  name, 
  description, 
  price, 
  image_url, 
  category, 
  weight, 
  ingredients, 
  stock_quantity, 
  is_new, 
  is_bestseller
) VALUES
  (
    'Classic Til-Gud Bites',
    'Our signature Til-Gud Bites combine earthy sesame seeds with pure jaggery, delivering warmth, crunch, and nostalgia in every bite. Handcrafted in small batches using traditional recipes passed down through generations.',
    349,
    'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg',
    'gud-bites',
    '250g',
    ARRAY['Sesame seeds (49%)', 'Jaggery (49%)', 'Cardamom', 'Ghee'],
    50,
    false,
    true
  ),
  (
    'Cardamom Til-Gud Bites',
    'Infused with premium green cardamom, these bites offer an aromatic twist to the classic recipe. Perfect for those who love a hint of spice with their sweetness.',
    399,
    'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg',
    'gud-bites',
    '250g',
    ARRAY['Sesame seeds (48%)', 'Jaggery (48%)', 'Green cardamom (3%)', 'Ghee'],
    45,
    true,
    false
  ),
  (
    'Almond Til-Gud Bites',
    'Luxury meets tradition with crunchy almonds adding a premium touch to our classic GUD bites. A sophisticated treat for special occasions.',
    499,
    'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg',
    'gud-bites',
    '250g',
    ARRAY['Sesame seeds (40%)', 'Jaggery (40%)', 'Almonds (18%)', 'Cardamom', 'Ghee'],
    30,
    true,
    true
  ),
  (
    'Trial Pack',
    'Can''t decide which flavor? Our trial pack includes all three varieties in convenient 50g portions. Perfect for first-time customers or gifting.',
    99,
    'https://images.pexels.com/photos/1028637/pexels-photo-1028637.jpeg',
    'trial-packs',
    '50g',
    ARRAY['Assorted varieties'],
    100,
    false,
    false
  ),
  (
    'Premium Gift Box',
    'Our most popular gift option featuring 500g of assorted GUD bites in premium packaging. Perfect for Diwali, weddings, or corporate gifting.',
    799,
    'https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg',
    'gift-sets',
    '500g',
    ARRAY['Classic Til-Gud', 'Cardamom Til-Gud', 'Almond Til-Gud'],
    25,
    false,
    true
  )
ON CONFLICT DO NOTHING;

-- Verify the insertion
SELECT name, price, weight, is_new, is_bestseller FROM products ORDER BY price;
