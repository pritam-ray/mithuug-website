// Promo Code & Discount Utilities

export interface PromoCode {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'freeShipping';
  value: number; // percentage (10 = 10%) or fixed amount (100 = ₹100)
  minOrderValue?: number;
  maxDiscount?: number; // for percentage discounts
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  firstOrderOnly?: boolean;
  applicableProducts?: string[]; // product IDs/SKUs
  enabled: boolean;
}

// Active promo codes (in production, fetch from database)
export const PROMO_CODES: PromoCode[] = [
  {
    code: 'WELCOME10',
    description: 'Get 10% off on your first order',
    type: 'percentage',
    value: 10,
    minOrderValue: 299,
    maxDiscount: 150,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    usedCount: 0,
    firstOrderOnly: true,
    enabled: true,
  },
  {
    code: 'TILGUD50',
    description: 'Flat ₹50 off on orders above ₹499',
    type: 'fixed',
    value: 50,
    minOrderValue: 499,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    usedCount: 0,
    enabled: true,
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    type: 'freeShipping',
    value: 0,
    minOrderValue: 0,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    usedCount: 0,
    enabled: true,
  },
  {
    code: 'FESTIVE15',
    description: 'Festive Special: 15% off',
    type: 'percentage',
    value: 15,
    minOrderValue: 599,
    maxDiscount: 200,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-01-31'),
    usageLimit: 100,
    usedCount: 0,
    enabled: true,
  },
  {
    code: 'BULK20',
    description: '20% off on orders above ₹999',
    type: 'percentage',
    value: 20,
    minOrderValue: 999,
    maxDiscount: 300,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    usedCount: 0,
    enabled: true,
  },
];

export interface PromoValidationResult {
  valid: boolean;
  message: string;
  discount?: number;
  freeShipping?: boolean;
  promoCode?: PromoCode;
}

// Validate promo code
export const validatePromoCode = (
  code: string,
  orderAmount: number,
  isFirstOrder: boolean = false,
  productIds: string[] = []
): PromoValidationResult => {
  const promo = PROMO_CODES.find(
    (p) => p.code.toUpperCase() === code.toUpperCase()
  );

  if (!promo) {
    return {
      valid: false,
      message: 'Invalid promo code',
    };
  }

  if (!promo.enabled) {
    return {
      valid: false,
      message: 'This promo code is no longer active',
    };
  }

  // Check validity period
  const now = new Date();
  if (now < promo.validFrom || now > promo.validUntil) {
    return {
      valid: false,
      message: 'This promo code has expired',
    };
  }

  // Check usage limit
  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
    return {
      valid: false,
      message: 'This promo code has reached its usage limit',
    };
  }

  // Check first order requirement
  if (promo.firstOrderOnly && !isFirstOrder) {
    return {
      valid: false,
      message: 'This promo code is only valid for first-time customers',
    };
  }

  // Check minimum order value
  if (promo.minOrderValue && orderAmount < promo.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order value of ₹${promo.minOrderValue} required`,
    };
  }

  // Check applicable products
  if (promo.applicableProducts && promo.applicableProducts.length > 0) {
    const hasApplicableProduct = productIds.some((id) =>
      promo.applicableProducts?.includes(id)
    );
    if (!hasApplicableProduct) {
      return {
        valid: false,
        message: 'This promo code is not applicable to items in your cart',
      };
    }
  }

  // Calculate discount
  if (promo.type === 'freeShipping') {
    return {
      valid: true,
      message: 'Free shipping applied!',
      discount: 0,
      freeShipping: true,
      promoCode: promo,
    };
  }

  let discount = 0;
  if (promo.type === 'percentage') {
    discount = Math.round((orderAmount * promo.value) / 100);
    if (promo.maxDiscount) {
      discount = Math.min(discount, promo.maxDiscount);
    }
  } else if (promo.type === 'fixed') {
    discount = promo.value;
  }

  return {
    valid: true,
    message: `Promo code applied! You saved ₹${discount}`,
    discount,
    freeShipping: false,
    promoCode: promo,
  };
};

// Apply promo code
export const applyPromoCode = (
  code: string,
  orderAmount: number,
  isFirstOrder?: boolean,
  productIds?: string[]
): PromoValidationResult => {
  return validatePromoCode(code, orderAmount, isFirstOrder, productIds);
};

// Get active promo codes for display
export const getActivePromoCodes = (): PromoCode[] => {
  const now = new Date();
  return PROMO_CODES.filter(
    (promo) =>
      promo.enabled &&
      now >= promo.validFrom &&
      now <= promo.validUntil &&
      (!promo.usageLimit || promo.usedCount < promo.usageLimit)
  );
};

// Get best promo code for order
export const getBestPromoCode = (
  orderAmount: number,
  isFirstOrder: boolean = false,
  productIds: string[] = []
): PromoCode | null => {
  const activePromos = getActivePromoCodes();
  let bestPromo: PromoCode | null = null;
  let maxDiscount = 0;

  activePromos.forEach((promo) => {
    const result = validatePromoCode(
      promo.code,
      orderAmount,
      isFirstOrder,
      productIds
    );
    if (result.valid && result.discount && result.discount > maxDiscount) {
      maxDiscount = result.discount;
      bestPromo = promo;
    }
  });

  return bestPromo;
};

// Format promo code for display
export const formatPromoCode = (promo: PromoCode): string => {
  if (promo.type === 'percentage') {
    return `${promo.value}% OFF${promo.maxDiscount ? ` (max ₹${promo.maxDiscount})` : ''}`;
  } else if (promo.type === 'fixed') {
    return `₹${promo.value} OFF`;
  } else {
    return 'FREE SHIPPING';
  }
};

// Check if promo code is expired
export const isPromoCodeExpired = (promo: PromoCode): boolean => {
  return new Date() > promo.validUntil;
};

// Get promo code expiry text
export const getPromoExpiryText = (promo: PromoCode): string => {
  const now = new Date();
  const expiryDate = promo.validUntil;
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) {
    return 'Expired';
  } else if (daysUntilExpiry === 0) {
    return 'Expires today';
  } else if (daysUntilExpiry === 1) {
    return 'Expires tomorrow';
  } else if (daysUntilExpiry <= 7) {
    return `Expires in ${daysUntilExpiry} days`;
  } else {
    return `Valid until ${expiryDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
  }
};

// Export all promo functions
export default {
  PROMO_CODES,
  validatePromoCode,
  applyPromoCode,
  getActivePromoCodes,
  getBestPromoCode,
  formatPromoCode,
  isPromoCodeExpired,
  getPromoExpiryText,
};
