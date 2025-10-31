// Shipping & Delivery Utilities

export interface ShippingZone {
  id: string;
  name: string;
  states: string[];
  deliveryDays: {
    min: number;
    max: number;
  };
  shippingFee: number;
  freeShippingThreshold?: number;
}

export interface DeliveryEstimate {
  zone: string;
  deliveryDays: string;
  shippingFee: number;
  freeShippingEligible: boolean;
  estimatedDate: {
    min: Date;
    max: Date;
  };
}

// Shipping zones configuration
export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'metro',
    name: 'Metro Cities',
    states: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana'],
    deliveryDays: { min: 2, max: 4 },
    shippingFee: 0,
    freeShippingThreshold: 0,
  },
  {
    id: 'tier1',
    name: 'Tier 1 Cities',
    states: [
      'Gujarat',
      'West Bengal',
      'Rajasthan',
      'Punjab',
      'Haryana',
      'Kerala',
      'Uttar Pradesh',
    ],
    deliveryDays: { min: 3, max: 5 },
    shippingFee: 50,
    freeShippingThreshold: 499,
  },
  {
    id: 'tier2',
    name: 'Tier 2/3 Cities',
    states: [
      'Madhya Pradesh',
      'Chhattisgarh',
      'Odisha',
      'Jharkhand',
      'Bihar',
      'Assam',
      'Uttarakhand',
      'Himachal Pradesh',
      'Goa',
    ],
    deliveryDays: { min: 4, max: 7 },
    shippingFee: 75,
    freeShippingThreshold: 499,
  },
  {
    id: 'remote',
    name: 'Remote Areas',
    states: [
      'Jammu and Kashmir',
      'Ladakh',
      'Arunachal Pradesh',
      'Nagaland',
      'Manipur',
      'Mizoram',
      'Tripura',
      'Meghalaya',
      'Sikkim',
      'Andaman and Nicobar Islands',
      'Lakshadweep',
    ],
    deliveryDays: { min: 7, max: 10 },
    shippingFee: 100,
    freeShippingThreshold: 999,
  },
];

// Pincode to state mapping (sample, expand as needed)
const PINCODE_TO_STATE: Record<string, string> = {
  // Delhi
  '110': 'Delhi',
  
  // Maharashtra
  '400': 'Maharashtra', // Mumbai
  '411': 'Maharashtra', // Pune
  
  // Karnataka
  '560': 'Karnataka', // Bangalore
  
  // Tamil Nadu
  '600': 'Tamil Nadu', // Chennai
  
  // Telangana
  '500': 'Telangana', // Hyderabad
  
  // Gujarat
  '380': 'Gujarat', // Ahmedabad
  
  // West Bengal
  '700': 'West Bengal', // Kolkata
  
  // Add more mappings as needed
};

// Get state from pincode
export const getStateFromPincode = (pincode: string): string | null => {
  if (!pincode || pincode.length < 3) return null;
  
  const prefix = pincode.substring(0, 3);
  return PINCODE_TO_STATE[prefix] || null;
};

// Get shipping zone by state
export const getShippingZone = (state: string): ShippingZone => {
  const zone = SHIPPING_ZONES.find((z) => 
    z.states.some((s) => s.toLowerCase() === state.toLowerCase())
  );
  
  return zone || SHIPPING_ZONES[SHIPPING_ZONES.length - 1]; // Default to remote
};

// Validate pincode format
export const isValidPincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Check if pincode is serviceable
export const isPincodeServiceable = (pincode: string): boolean => {
  if (!isValidPincode(pincode)) return false;
  
  // For now, all valid pincodes are serviceable
  // In production, check against a database or API
  return true;
};

// Calculate shipping fee
export const calculateShippingFee = (
  pincode: string,
  orderAmount: number
): number => {
  if (!isValidPincode(pincode)) return 0;
  
  const state = getStateFromPincode(pincode);
  if (!state) return SHIPPING_ZONES[0].shippingFee; // Default to metro
  
  const zone = getShippingZone(state);
  
  // Check if eligible for free shipping
  if (
    zone.freeShippingThreshold !== undefined &&
    orderAmount >= zone.freeShippingThreshold
  ) {
    return 0;
  }
  
  return zone.shippingFee;
};

// Get delivery estimate
export const getDeliveryEstimate = (
  pincode: string,
  orderAmount: number
): DeliveryEstimate | null => {
  if (!isValidPincode(pincode)) return null;
  
  const state = getStateFromPincode(pincode);
  const zone = state ? getShippingZone(state) : SHIPPING_ZONES[0];
  
  const shippingFee = calculateShippingFee(pincode, orderAmount);
  const freeShippingEligible = 
    zone.freeShippingThreshold !== undefined &&
    orderAmount >= zone.freeShippingThreshold;
  
  // Calculate estimated delivery dates
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + zone.deliveryDays.min);
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + zone.deliveryDays.max);
  
  return {
    zone: zone.name,
    deliveryDays: `${zone.deliveryDays.min}-${zone.deliveryDays.max} days`,
    shippingFee,
    freeShippingEligible,
    estimatedDate: {
      min: minDate,
      max: maxDate,
    },
  };
};

// Format delivery date range
export const formatDeliveryDateRange = (estimate: DeliveryEstimate): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  
  const minDate = estimate.estimatedDate.min.toLocaleDateString('en-IN', options);
  const maxDate = estimate.estimatedDate.max.toLocaleDateString('en-IN', options);
  
  return `${minDate} - ${maxDate}`;
};

// Calculate amount needed for free shipping
export const amountForFreeShipping = (
  pincode: string,
  currentAmount: number
): number => {
  if (!isValidPincode(pincode)) return 0;
  
  const state = getStateFromPincode(pincode);
  const zone = state ? getShippingZone(state) : SHIPPING_ZONES[0];
  
  if (zone.freeShippingThreshold === undefined) return 0;
  
  const remaining = zone.freeShippingThreshold - currentAmount;
  return remaining > 0 ? remaining : 0;
};

// Get free shipping threshold for pincode
export const getFreeShippingThreshold = (pincode: string): number => {
  if (!isValidPincode(pincode)) return SHIPPING_ZONES[0].freeShippingThreshold || 0;
  
  const state = getStateFromPincode(pincode);
  const zone = state ? getShippingZone(state) : SHIPPING_ZONES[0];
  
  return zone.freeShippingThreshold || 0;
};

// Shipping status helpers
export const SHIPPING_STATUSES = {
  PENDING: 'Order Placed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
} as const;

export type ShippingStatus = keyof typeof SHIPPING_STATUSES;

export const getShippingStatusLabel = (status: ShippingStatus): string => {
  return SHIPPING_STATUSES[status] || 'Unknown';
};

// Export all shipping functions
export default {
  SHIPPING_ZONES,
  getStateFromPincode,
  getShippingZone,
  isValidPincode,
  isPincodeServiceable,
  calculateShippingFee,
  getDeliveryEstimate,
  formatDeliveryDateRange,
  amountForFreeShipping,
  getFreeShippingThreshold,
  SHIPPING_STATUSES,
  getShippingStatusLabel,
};
