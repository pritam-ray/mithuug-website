export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images?: string[];
  category: string;
  flavors?: string[];
  weight: string;
  ingredients: string[];
  stock_quantity: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  default_shipping_address?: Address;
  default_billing_address?: Address;
  created_at: string;
  updated_at: string;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  user_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'payment_pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  
  // Payment Information
  payment_id?: string;  // Razorpay payment ID
  payment_method: 'razorpay' | 'cod' | 'upi' | 'bank_transfer';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  
  // Pricing Breakdown
  total_amount: number;
  subtotal_amount: number;
  discount_amount: number;
  shipping_fee: number;
  cod_fee: number;
  
  // Promo Code
  promo_code?: string;
  
  // Addresses
  shipping_address: Address;
  billing_address: Address;
  
  // Shipping Tracking
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  estimated_delivery_start?: string;
  estimated_delivery_end?: string;
  shipping_zone?: string;
  
  // Additional Metadata
  notes?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relations
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
  product?: Product;
}

export interface CartItem extends Product {
  quantity: number;
}
