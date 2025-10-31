// Payment Gateway Integration Utilities
import config from './config';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'online' | 'cod' | 'upi';
  enabled: boolean;
  logo?: string;
  fees?: number; // in percentage
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise (₹100 = 10000 paise)
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
}

// Payment methods configuration
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'razorpay',
    name: 'Card / UPI / Netbanking',
    type: 'online',
    enabled: true,
  },
  {
    id: 'upi',
    name: 'UPI (Google Pay, PhonePe, Paytm)',
    type: 'upi',
    enabled: true,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    type: 'cod',
    enabled: true,
    fees: 2, // 2% COD fee
  },
];

// COD validation rules
export const COD_CONFIG = {
  minAmount: 99, // Minimum order for COD
  maxAmount: 10000, // Maximum order for COD
  fee: 2, // 2% COD fee
  allowedPincodes: [] as string[], // Empty = all pincodes allowed
};

// Calculate COD fee
export const calculateCODFee = (orderAmount: number): number => {
  if (orderAmount < COD_CONFIG.minAmount || orderAmount > COD_CONFIG.maxAmount) {
    return 0;
  }
  return Math.round((orderAmount * COD_CONFIG.fee) / 100);
};

// Validate COD eligibility
export const isCODEligible = (orderAmount: number, pincode?: string): boolean => {
  // Check amount limits
  if (orderAmount < COD_CONFIG.minAmount || orderAmount > COD_CONFIG.maxAmount) {
    return false;
  }

  // Check pincode if restricted
  if (COD_CONFIG.allowedPincodes.length > 0 && pincode) {
    return COD_CONFIG.allowedPincodes.includes(pincode);
  }

  return true;
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      resolve(true);
    };
    
    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (
  options: Omit<RazorpayOptions, 'key'>,
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  const isLoaded = await loadRazorpayScript();
  
  if (!isLoaded) {
    onFailure(new Error('Failed to load Razorpay SDK'));
    return;
  }

  // Get Razorpay key from config
  const razorpayKey = config.razorpay.keyId;
  
  if (!razorpayKey) {
    onFailure(new Error('Razorpay key not configured. Please add VITE_RAZORPAY_KEY_ID to .env file'));
    return;
  }

  const razorpay = new (window as any).Razorpay({
    key: razorpayKey,
    ...options,
    handler: (response: any) => {
      onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        onFailure(new Error('Payment cancelled by user'));
      },
    },
  });

  razorpay.on('payment.failed', (response: any) => {
    onFailure(response.error);
  });

  razorpay.open();
};

// Create Razorpay order (backend call)
export const createRazorpayOrder = async (
  amount: number,
  customerId?: string
): Promise<{ orderId: string; amount: number }> => {
  try {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        customerId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify Razorpay payment signature (backend call)
export const verifyRazorpayPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        paymentId,
        signature,
      }),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data.verified === true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};

// Format amount for display
export const formatAmount = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// UPI payment helper
export const generateUPILink = (
  upiId: string,
  amount: number,
  name: string,
  transactionNote: string
): string => {
  const params = new URLSearchParams({
    pa: upiId, // Payee UPI ID
    pn: name, // Payee name
    am: amount.toFixed(2), // Amount
    tn: transactionNote, // Transaction note
    cu: 'INR', // Currency
  });

  return `upi://pay?${params.toString()}`;
};

// Payment method helper
export const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
  return PAYMENT_METHODS.find((method) => method.id === id);
};

// Check if payment method is available
export const isPaymentMethodAvailable = (
  id: string,
  orderAmount: number,
  pincode?: string
): boolean => {
  const method = getPaymentMethodById(id);
  if (!method || !method.enabled) return false;

  if (method.type === 'cod') {
    return isCODEligible(orderAmount, pincode);
  }

  return true;
};

// Export all payment functions
export default {
  PAYMENT_METHODS,
  COD_CONFIG,
  calculateCODFee,
  isCODEligible,
  loadRazorpayScript,
  initiateRazorpayPayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  formatAmount,
  generateUPILink,
  getPaymentMethodById,
  isPaymentMethodAvailable,
};
