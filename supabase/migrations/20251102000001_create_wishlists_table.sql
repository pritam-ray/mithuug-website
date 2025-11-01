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
