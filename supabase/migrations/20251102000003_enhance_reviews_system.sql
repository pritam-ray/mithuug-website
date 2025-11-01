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

-- Add admin policy to view all reviews (for moderation)
CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add admin policy to update any review
CREATE POLICY "Admins can update any review"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

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
