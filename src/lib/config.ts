// Environment Configuration Helper

interface EnvironmentConfig {
  // Supabase
  supabase: {
    url: string;
    anonKey: string;
  };
  
  // Razorpay
  razorpay: {
    keyId: string;
    keySecret: string;
    isTestMode: boolean;
  };
  
  // Analytics
  analytics: {
    ga4MeasurementId?: string;
    metaPixelId?: string;
  };
  
  // App
  app: {
    name: string;
    url: string;
    supportEmail: string;
    supportPhone?: string;
  };
  
  // UPI
  upi?: {
    id: string;
  };
}

// Validate required environment variables
const validateEnv = () => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_RAZORPAY_KEY_ID',
  ];

  const missing = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing environment variables: ${missing.join(', ')}\n` +
      'Please create a .env file based on .env.example'
    );
  }
};

// Initialize environment config
const getConfig = (): EnvironmentConfig => {
  validateEnv();

  return {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    },
    razorpay: {
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
      keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '',
      isTestMode: import.meta.env.VITE_PAYMENT_MODE !== 'live',
    },
    analytics: {
      ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
      metaPixelId: import.meta.env.VITE_META_PIXEL_ID,
    },
    app: {
      name: import.meta.env.VITE_APP_NAME || 'MitthuuG',
      url: import.meta.env.VITE_APP_URL || 'https://pritam-ray.github.io/mithuug-website',
      supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@mitthuug.com',
      supportPhone: import.meta.env.VITE_SUPPORT_PHONE,
    },
    upi: import.meta.env.VITE_UPI_ID
      ? { id: import.meta.env.VITE_UPI_ID }
      : undefined,
  };
};

// Export singleton config instance
export const config = getConfig();

// Helper to check if app is in production
export const isProduction = import.meta.env.PROD;

// Helper to check if app is in development
export const isDevelopment = import.meta.env.DEV;

// Helper to get base URL
export const getBaseUrl = () => {
  if (isProduction) {
    return config.app.url;
  }
  return 'http://localhost:5173';
};

// Export config as default
export default config;
