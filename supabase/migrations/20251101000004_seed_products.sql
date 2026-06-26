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
