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

-- Add check constraint for payment method
ALTER TABLE orders
  ADD CONSTRAINT valid_payment_method 
  CHECK (payment_method IN ('razorpay', 'cod', 'upi', 'bank_transfer'));

-- Add check constraint for payment status
ALTER TABLE orders
  ADD CONSTRAINT valid_payment_status 
  CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded'));

-- Add check constraint for order status
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS valid_order_status,
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
CREATE POLICY "Users can update own order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO anon;

COMMENT ON TABLE orders IS 'Customer orders with full payment and shipping tracking';
