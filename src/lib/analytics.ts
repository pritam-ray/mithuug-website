// Google Analytics 4 & Marketing Analytics Utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

// Initialize GA4
export const initGA4 = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
};

// Track page view
export const trackPageView = (path: string, title?: string) => {
  if (typeof window.gtag === 'undefined') return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
};

// E-commerce event tracking
export const trackViewItem = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', 'view_item', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Til-Gud Bites',
        item_brand: product.brand || 'MitthuuG',
        price: product.price,
      },
    ],
  });
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Til-Gud Bites',
        item_brand: 'MitthuuG',
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });

  // Meta Pixel tracking
  trackMetaPixelAddToCart(product);
};

export const trackBeginCheckout = (items: any[], value: number) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', 'begin_checkout', {
    currency: 'INR',
    value,
    items,
  });
};

export const trackPurchase = (transaction: {
  id: string;
  value: number;
  tax?: number;
  shipping?: number;
  items: any[];
}) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', 'purchase', {
    transaction_id: transaction.id,
    value: transaction.value,
    tax: transaction.tax || 0,
    shipping: transaction.shipping || 0,
    currency: 'INR',
    items: transaction.items,
  });

  // Meta Pixel tracking
  trackMetaPixelPurchase(transaction);
};

// Custom event tracking
export const trackCustomEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', eventName, params);
};

// Meta Pixel Integration
export const initMetaPixel = (pixelId: string) => {
  if (typeof window === 'undefined') return;

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );
  /* eslint-enable */

  window.fbq?.('init', pixelId);
  window.fbq?.('track', 'PageView');
};

export const trackMetaPixelAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  if (typeof window.fbq === 'undefined') return;

  window.fbq('track', 'AddToCart', {
    content_ids: [product.id],
    content_type: 'product',
    content_name: product.name,
    value: product.price * product.quantity,
    currency: 'INR',
  });
};

export const trackMetaPixelPurchase = (transaction: {
  id: string;
  value: number;
  items: any[];
}) => {
  if (typeof window.fbq === 'undefined') return;

  window.fbq('track', 'Purchase', {
    value: transaction.value,
    currency: 'INR',
    transaction_id: transaction.id,
    content_ids: transaction.items.map((item) => item.item_id),
  });
};

// Newsletter signup tracking
export const trackNewsletterSignup = (email: string) => {
  trackCustomEvent('newsletter_signup', { email_domain: email.split('@')[1] });

  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'Lead', { content_name: 'Newsletter Signup' });
  }
};

// Search tracking
export const trackSearch = (searchTerm: string) => {
  trackCustomEvent('search', { search_term: searchTerm });

  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'Search', { search_string: searchTerm });
  }
};

// Promo code usage tracking
export const trackPromoCode = (code: string, discount: number) => {
  trackCustomEvent('promo_code_applied', {
    promo_code: code,
    discount_amount: discount,
  });
};

// Export all analytics functions
export default {
  initGA4,
  initMetaPixel,
  trackPageView,
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  trackCustomEvent,
  trackNewsletterSignup,
  trackSearch,
  trackPromoCode,
};
