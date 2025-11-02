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
