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
