-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow anyone to view product images (public bucket)
CREATE POLICY IF NOT EXISTS "Public Access to product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Allow authenticated users to upload product images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Policy: Allow authenticated users to update product images
CREATE POLICY IF NOT EXISTS "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- Policy: Allow authenticated users to delete product images
CREATE POLICY IF NOT EXISTS "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

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
