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
