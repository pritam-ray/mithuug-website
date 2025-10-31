# MitthuuG Ecommerce Build Plan - Complete Implementation

## 🎯 Project Overview
**Goal:** Build production-ready, conversion-optimized ecommerce site for MitthuuG  
**Stack:** React 18.3 + TypeScript 5.5 + Vite 5.4 + Tailwind CSS 3.4 + Supabase  
**Timeline:** Phased deployment with iterative testing  
**Performance Targets:** LCP ≤2.5s, Lighthouse ≥90, WCAG 2.1 AA compliant

---

## ✅ Phase 1: Design System & Foundation (COMPLETED)

### 1.1 Tailwind Configuration
- [x] **MitthuuG Color Palette**
  - Ochre Gold (#C6862E) - Primary brand color
  - Chocolate Brown (#4B2E2A) - Secondary
  - Metallic Gold (#B8860B) - Accent
  - Ivory (#F6F0E1) - Background
  - Olive (#6B8E23) - Natural accent
  - All colors with 50-900 shades

- [x] **Typography System**
  - Headings: Playfair Display (serif, nostalgic)
  - Subheadings: Merriweather (readable serif)
  - Body: Inter (clean sans-serif)
  - Alt Body: Lato (fallback)
  - Responsive sizing: h1 4xl→6xl, h2 3xl→5xl

- [x] **Design Tokens**
  - Custom spacing: 18, 88, 112, 128
  - Shadows: mitthuug, mitthuug-lg, chocolate
  - Animations: slideIn, fadeIn, pulse-slow, bounce-slow
  - Gradients: gradient-mitthuug, gradient-chocolate
  - Transitions: 200ms, 300ms, 400ms durations

### 1.2 Global CSS
- [x] Google Fonts import (Playfair, Merriweather, Inter, Lato)
- [x] CSS Variables for theming
- [x] Base layer: typography, focus styles, accessibility
- [x] Component layer: buttons, cards, inputs, badges
- [x] Utility layer: animations, aspect ratios, text truncation
- [x] Media queries: print, reduced-motion, high-contrast

### 1.3 Accessibility Foundation
- [x] WCAG 2.1 AA focus indicators
- [x] Skip-to-main-content link
- [x] Reduced motion support
- [x] High contrast mode support
- [x] Semantic HTML structure

---

## 🔧 Phase 2: Core Components Library

### 2.1 Navigation Components
**Component:** `Header.tsx` (Enhanced Navbar)
```typescript
Features:
- Sticky header with scroll animation
- Multi-level mega menu for Shop
- Search bar with autocomplete
- Cart icon with badge counter
- Account dropdown
- Mobile hamburger menu
- "Mitthu Express" branding
- Free shipping banner (sticky)
```

**Component:** `MobileMenu.tsx`
```typescript
Features:
- Slide-in drawer animation
- Touch-friendly navigation
- Search integration
- Account quick access
- Close on route change
```

**Component:** `Footer.tsx` (Enhanced)
```typescript
Features:
- Newsletter signup integration
- Social media links
- Legal & policy links
- "From the Express" blog category
- FSSAI certification badge
- Payment method icons
- Sitemap structure
```

### 2.2 Product Components
**Component:** `ProductCard.tsx`
```typescript
Features:
- Image with lazy loading (WebP)
- Badges (New, Sale, Out of Stock)
- Product title (truncated)
- Price display with discount
- Quick view button
- Add to wishlist icon
- Rating stars
- Hover effects (scale, shadow)
- SKU data attributes for analytics
```

**Component:** `ProductGrid.tsx`
```typescript
Features:
- Responsive grid (1/2/3/4 columns)
- Filter sidebar
- Sort dropdown
- Pagination or infinite scroll
- Empty state handling
- Loading skeletons
```

**Component:** `ProductDetail.tsx` (Page)
```typescript
Features:
- Image gallery with zoom
- Variant selector (flavor)
- Quantity selector
- Sticky add-to-cart (mobile)
- Nutrition accordion
- Ingredients list
- Customer reviews
- Related products
- Breadcrumb navigation
- JSON-LD schema injection
```

### 2.3 Cart & Checkout Components
**Component:** `Cart.tsx` (Sidebar Drawer)
```typescript
Features:
- Slide-in from right
- Line item list with thumbnails
- Quantity +/- controls
- Remove item button
- Subtotal calculation
- Free shipping progress bar
- Promo code input
- "Continue shopping" vs "Checkout" CTAs
- Empty cart state with CTA
```

**Component:** `StickyCart.tsx` (Mobile Bottom Bar)
```typescript
Features:
- Fixed position bottom bar
- Mini cart summary
- Total price display
- Quick checkout button
- Shows only on product/cart pages
- Hides on scroll down, shows on scroll up
```

**Component:** `CheckoutForm.tsx`
```typescript
Features:
- Multi-step progress ("Your Journey")
  - Step 1: Shipping Address
  - Step 2: Delivery Options
  - Step 3: Payment Method
  - Step 4: Review Order
- Form validation with error states
- Pincode-based delivery check
- Guest vs registered checkout
- Save address for later
- Gift options (wrap, message)
- Order summary sidebar (sticky)
- Security badges
```

### 2.4 Content Components
**Component:** `HeroSection.tsx`
```typescript
Features:
- Full-width background image (WebP)
- Hero copy variants (A/B testable)
- Dual CTAs (primary + secondary)
- Scroll indicator animation
- Mobile-optimized typography
- Lazy load background
```

**Component:** `USPGrid.tsx`
```typescript
Features:
- 3-column grid (stacks on mobile)
- Icon + title + support line
- Emojis or Lucide icons
- Hover animations
- Linked to content pages
```

**Component:** `TestimonialSlider.tsx`
```typescript
Features:
- Auto-rotating carousel
- Customer photo, name, location
- Star rating
- Quote text
- Navigation dots
- Pause on hover
- Touch/swipe enabled
```

**Component:** `Newsletter.tsx` (Enhanced from existing)
```typescript
Features:
- Email validation
- Success state
- Error handling
- Privacy message
- 10% discount offer
- Klaviyo integration
```

### 2.5 UI Components
**Component:** `Modal.tsx`
```typescript
Features:
- Overlay with backdrop blur
- Close button + ESC key
- Focus trap
- Scroll lock
- Accessible (ARIA labels)
- Size variants (sm, md, lg, xl)
```

**Component:** `Toast.tsx` (Already exists - enhance)
```typescript
Enhancements:
- Position variants (top-right, bottom-right)
- Auto-dismiss timer control
- Undo action support
- Stack multiple toasts
```

**Component:** `ReviewsList.tsx`
```typescript
Features:
- Star rating summary
- Verified purchase badge
- Helpful votes
- Photo reviews
- Filter by rating
- Sort by date/helpful
- Pagination
```

**Component:** `Breadcrumb.tsx` (Already exists - keep)

---

## 📄 Phase 3: Core Pages

### 3.1 Homepage (`HomePage.tsx`)
```
Structure:
├── HeroSection (with A/B test variants)
├── USPGrid (3 USPs from content system)
├── Featured Products (New Arrivals)
├── Testimonials (4 reviews + stats)
├── Newsletter Signup
├── Blog Preview ("From the Express")
├── Instagram Feed Integration
└── Footer
```

### 3.2 Shop/Category Page (`ShopPage.tsx`)
```
Features:
- Page title with Mitthu Express naming
- Breadcrumb navigation
- Filter sidebar:
  - Flavor (Classic, Cardamom, Almond)
  - Price range
  - In stock only
- Sort dropdown:
  - Featured
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Best Selling
- ProductGrid with pagination
- SEO metadata
```

### 3.3 Product Detail Page (`ProductDetailPage.tsx`)
```
Layout:
├── Breadcrumb
├── 2-column layout (60/40)
│   ├── Left: Image Gallery
│   │   ├── Main image with zoom
│   │   ├── Thumbnail strip
│   │   └── Badge overlays
│   └── Right: Product Info
│       ├── Title + SKU
│       ├── Star rating + review count
│       ├── Price (with discount if applicable)
│       ├── Short description
│       ├── Variant selector (if multiple flavors)
│       ├── Quantity selector
│       ├── Add to Cart (primary CTA)
│       ├── Add to Wishlist (secondary)
│       ├── Delivery estimator (pincode)
│       ├── Trust badges (FSSAI, 100% Natural)
│       └── Share buttons (WhatsApp, Twitter, Copy)
├── Sticky Add to Cart (mobile)
├── Tabs/Accordion:
│   ├── Description (long_desc from JSON)
│   ├── Ingredients
│   ├── Nutrition Facts
│   ├── Storage & Shelf Life
│   └── Shipping Info
├── Customer Reviews Section
├── Related Products ("You May Also Like")
└── JSON-LD Schema (Product)
```

### 3.4 Cart Page (`CartPage.tsx`)
```
Layout:
├── Page title: "Your GUD Cart"
├── Cart empty state (if no items)
├── 2-column layout (70/30)
│   ├── Left: Cart Items List
│   │   ├── Line item cards
│   │   ├── Quantity controls
│   │   ├── Remove button
│   │   └── "Continue Shopping" link
│   └── Right: Order Summary (sticky)
│       ├── Subtotal
│       ├── Shipping estimate
│       ├── Promo code input
│       ├── Total
│       ├── Free shipping progress bar
│       └── "Proceed to Checkout" CTA
├── Recommended Products
└── Trust badges
```

### 3.5 Checkout Page (`CheckoutPage.tsx`)
```
Layout:
├── Progress bar: "Your Journey" (4 steps)
├── 2-column layout (60/40)
│   ├── Left: Checkout Form
│   │   ├── Contact Information
│   │   ├── Shipping Address
│   │   ├── Delivery Method
│   │   ├── Payment Method
│   │   └── Gift Options
│   └── Right: Order Summary (sticky)
│       ├── Mini cart items
│       ├── Subtotal
│       ├── Shipping
│       ├── Discount
│       ├── Total
│       └── Security badges
├── Place Order button
└── Return policy link
```

### 3.6 Account Dashboard (`AccountPage.tsx`)
```
Tabs:
- Profile (edit details)
- Orders (history + tracking)
- Addresses (saved addresses)
- Wishlist
- Rewards/Referrals
- Subscription Management
```

### 3.7 Blog Page (`BlogPage.tsx`)
```
Features:
- "From the Mitthu Express" branding
- Category filter
- Featured post
- Grid of articles
- SEO optimization
```

### 3.8 About/Story Page (`AboutPage.tsx`)
```
Sections:
- Hero: "The Mitthu Express Journey"
- Station 1: The Inspiration
- Station 2: Recipe Development
- Station 3: Kitchen Setup
- Station 4: Launch
- Station 5: Community
- Team photos
- FSSAI certification
- Values & Mission
```

### 3.9 FAQ Page (`FAQPage.tsx`) (Already exists - enhance)
```
Enhancements:
- JSON-LD FAQ schema
- Search functionality
- Contact CTA at bottom
```

### 3.10 Contact Page (`ContactPage.tsx`)
```
Features:
- Contact form
- WhatsApp button (primary)
- Email link
- Phone number
- Social media links
- Business hours
- Map (optional)
```

### 3.11 404 Page (`NotFoundPage.tsx`)
```
Features:
- "Lost on the Express?" messaging
- Search bar
- Popular products
- Home link
```

---

## ⚙️ Phase 4: Functionality & Integrations

### 4.1 Payment Gateway Integration
**Razorpay Setup:**
```typescript
// src/lib/payment.ts
import Razorpay from 'razorpay';

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processPayment = async (orderData) => {
  const res = await initializeRazorpay();
  if (!res) {
    alert('Razorpay SDK failed to load');
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.amount * 100, // paise
    currency: 'INR',
    name: 'MitthuuG',
    description: orderData.description,
    image: '/logo.png',
    order_id: orderData.id,
    handler: function (response) {
      // Success callback
      console.log(response.razorpay_payment_id);
      console.log(response.razorpay_order_id);
      console.log(response.razorpay_signature);
    },
    prefill: {
      name: orderData.customer.name,
      email: orderData.customer.email,
      contact: orderData.customer.phone,
    },
    theme: {
      color: '#C6862E',
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
```

**COD Implementation:**
```typescript
// src/lib/cod.ts
export const validateCOD = (pincode: string, amount: number): boolean => {
  // COD available for orders below ₹2000
  if (amount > 2000) return false;
  
  // Check serviceable pincodes
  const serviceablePincodes = [...]; // Load from API/config
  return serviceablePincodes.includes(pincode);
};
```

### 4.2 Shipping & Delivery
**Pincode Validation:**
```typescript
// src/lib/shipping.ts
export interface DeliveryEstimate {
  serviceable: boolean;
  days: number;
  express_available: boolean;
  cod_available: boolean;
}

export const checkDelivery = async (pincode: string): Promise<DeliveryEstimate> => {
  // Call Shiprocket/Delhivery API
  const response = await fetch(`/api/check-pincode/${pincode}`);
  return response.json();
};

export const calculateShipping = (weight: number, pincode: string): number => {
  // Dynamic shipping calculation
  if (weight <= 500) return 40;
  if (weight <= 1000) return 60;
  return 80;
};

export const freeShippingThreshold = 499; // INR
```

### 4.3 Subscription Engine
```typescript
// src/lib/subscription.ts
export interface Subscription {
  id: string;
  product_id: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  quantity: number;
  discount: number; // 5%
  next_delivery: Date;
  status: 'active' | 'paused' | 'cancelled';
}

export const createSubscription = async (productId: string, frequency: string) => {
  // Create recurring order in Razorpay
  const subscription = await fetch('/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ productId, frequency, discount: 5 }),
  });
  return subscription.json();
};

export const pauseSubscription = async (subscriptionId: string) => {
  // Pause without cancelling
  await fetch(`/api/subscriptions/${subscriptionId}/pause`, { method: 'POST' });
};
```

### 4.4 Promo Code Engine
```typescript
// src/lib/promos.ts
export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  min_order: number;
  expiry: Date;
  max_uses: number;
  used_count: number;
}

export const validatePromo = async (code: string, cartTotal: number): Promise<PromoCode | null> => {
  const promos: PromoCode[] = [
    { code: 'FIRST10', type: 'percentage', value: 10, min_order: 0, expiry: new Date('2025-12-31'), max_uses: 1000, used_count: 0 },
    { code: 'FESTIVEGUD', type: 'percentage', value: 15, min_order: 499, expiry: new Date('2025-11-15'), max_uses: 500, used_count: 0 },
    { code: 'FREESHIP', type: 'free_shipping', value: 0, min_order: 299, expiry: new Date('2025-12-31'), max_uses: -1, used_count: 0 },
  ];

  const promo = promos.find(p => p.code === code.toUpperCase());
  if (!promo) return null;
  if (promo.expiry < new Date()) return null;
  if (cartTotal < promo.min_order) return null;
  if (promo.max_uses > 0 && promo.used_count >= promo.max_uses) return null;

  return promo;
};

export const applyDiscount = (cartTotal: number, promo: PromoCode): number => {
  if (promo.type === 'percentage') {
    return cartTotal * (promo.value / 100);
  }
  if (promo.type === 'fixed') {
    return promo.value;
  }
  return 0;
};
```

### 4.5 Inventory Management
```typescript
// src/lib/inventory.ts
export const checkStock = async (sku: string): Promise<number> => {
  // Call Supabase or inventory API
  const { data } = await supabase
    .from('inventory')
    .select('quantity')
    .eq('sku', sku)
    .single();
  
  return data?.quantity || 0;
};

export const reserveStock = async (sku: string, quantity: number): Promise<boolean> => {
  // Reserve for 10 minutes during checkout
  const { error } = await supabase
    .from('reservations')
    .insert({ sku, quantity, expires_at: new Date(Date.now() + 600000) });
  
  return !error;
};
```

---

## 🔍 Phase 5: SEO & Performance

### 5.1 JSON-LD Structured Data
```typescript
// src/components/SEO/StructuredData.tsx
export const ProductSchema = ({ product }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.long_desc,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "MitthuuG"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://mitthuug.com/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "MitthuuG"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "287"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

### 5.2 Image Optimization
```typescript
// vite.config.ts additions
import imagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false }
        ]
      },
      webp: { quality: 80 }
    })
  ]
});
```

### 5.3 Performance Optimizations
- **Code Splitting:** React.lazy() for routes
- **Image Lazy Loading:** loading="lazy" + Intersection Observer
- **Critical CSS:** Inline above-the-fold styles
- **Preload:** Key fonts and hero image
- **CDN:** Cloudflare/Bunny CDN for static assets
- **Compression:** Brotli/GZIP on server
- **Caching:** Service Worker for offline support

---

## 📊 Phase 6: Analytics & Marketing

### 6.1 Google Analytics 4
```typescript
// src/lib/analytics.ts
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize(import.meta.env.VITE_GA4_ID);
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({ category, action, label });
};

export const trackPurchase = (transaction) => {
  ReactGA.event({
    category: 'Ecommerce',
    action: 'Purchase',
    value: transaction.value,
    label: transaction.id
  });
};
```

### 6.2 Meta Pixel
```typescript
// src/lib/metaPixel.ts
export const initMetaPixel = () => {
  (function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js'));
  fbq('init', import.meta.env.VITE_META_PIXEL_ID);
  fbq('track', 'PageView');
};

export const trackAddToCart = (product) => {
  fbq('track', 'AddToCart', {
    content_ids: [product.sku],
    content_type: 'product',
    value: product.price,
    currency: 'INR'
  });
};
```

### 6.3 Klaviyo Email Flows
```typescript
// src/lib/klaviyo.ts
export const subscribeToNewsletter = async (email: string) => {
  await fetch('https://a.klaviyo.com/api/v2/list/LIST_ID/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: import.meta.env.VITE_KLAVIYO_API_KEY,
      profiles: [{ email }]
    })
  });
};

export const trackPurchaseKlaviyo = async (email: string, order) => {
  // Send to Klaviyo for post-purchase flow
  await fetch('https://a.klaviyo.com/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: import.meta.env.VITE_KLAVIYO_PUBLIC_KEY,
      event: 'Placed Order',
      customer_properties: { $email: email },
      properties: order
    })
  });
};
```

---

## 🧪 Phase 7: Testing & QA

### 7.1 Playwright E2E Tests
```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('Complete purchase with COD', async ({ page }) => {
    // Navigate to product
    await page.goto('/products/classic-til-gud-bites');
    
    // Add to cart
    await page.click('[data-testid="add-to-cart"]');
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    expect(await page.locator('[data-testid="cart-item"]').count()).toBe(1);
    
    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    
    // Fill shipping
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="phone"]', '9876543210');
    await page.fill('[name="address"]', '123 Test Street');
    await page.fill('[name="pincode"]', '400001');
    
    // Select COD
    await page.click('[data-testid="payment-cod"]');
    
    // Place order
    await page.click('[data-testid="place-order"]');
    
    // Verify success
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
  });
});
```

### 7.2 Accessibility Audit
```typescript
// tests/a11y/homepage.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Homepage should not have WCAG violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

## 🚀 Phase 8: Deployment

### 8.1 Environment Variables
```bash
# .env.production
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
VITE_GA4_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=XXXXXXXXXXXXXXX
VITE_KLAVIYO_API_KEY=pk_xxxxx
VITE_API_BASE_URL=https://api.mitthuug.com
```

### 8.2 Deployment Checklist
- [ ] All environment variables set
- [ ] GA4 tracking verified
- [ ] Meta Pixel events firing
- [ ] Razorpay test mode disabled
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] SSL certificate active
- [ ] CDN configured
- [ ] Error monitoring (Sentry) active
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place

### 8.3 Build & Deploy Commands
```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to GitHub Pages (current setup)
npm run deploy

# Deploy to Vercel (alternative)
vercel --prod

# Deploy to Netlify (alternative)
netlify deploy --prod
```

---

## 📈 Phase 9: Post-Launch Monitoring

### 9.1 KPIs to Track (First 90 Days)
| Metric | Goal | Measurement Tool |
|--------|------|------------------|
| Conversion Rate | ≥ 3.5% | GA4 |
| Average Order Value | ₹350+ | GA4 + Database |
| Repeat Purchase Rate | ≥ 20% | Database |
| Email Signup Rate | ≥ 5% | Klaviyo |
| Cart Abandonment | < 70% | GA4 |
| Page Load Time | < 2.5s | Lighthouse |
| Bounce Rate | < 40% | GA4 |
| Customer Acquisition Cost | TBD | Ads Manager |

### 9.2 A/B Tests to Run
1. **Hero Headline** (14-day test)
   - Variant A: "GUD vibes, pure nostalgia 🍯"
   - Variant B: "The til-gud you grew up with. Now better."
   - Metric: CTA click-through rate

2. **Product CTA Button** (14-day test)
   - Variant A: "Add to Cart"
   - Variant B: "Try MitthuuG Now"
   - Metric: Add-to-cart conversion

3. **Pricing Display** (7-day test)
   - Variant A: "₹249 per 100g box"
   - Variant B: "₹249 (₹2.49 per bite)"
   - Metric: Checkout completion rate

### 9.3 Usability Testing
- Conduct 3 rounds with 5 users each
- Tasks:
  1. Find and purchase Classic Til-Gud
  2. Apply promo code
  3. Check delivery for pincode
  4. Subscribe to newsletter
  5. Read FAQ and contact support
- Identify friction points and prioritize fixes

---

## 🔄 Phase 10: Iteration & Improvements

### 10.1 Week 1-2 Post-Launch
- [ ] Monitor error logs daily
- [ ] Fix critical bugs within 24 hours
- [ ] Collect customer feedback
- [ ] Review analytics dashboards
- [ ] Optimize underperforming pages

### 10.2 Week 3-4 Post-Launch
- [ ] Implement high-impact UX improvements
- [ ] Launch first A/B test
- [ ] Add customer reviews to products
- [ ] Optimize images further
- [ ] Improve mobile checkout flow

### 10.3 Month 2-3 Post-Launch
- [ ] Add new product variants
- [ ] Launch subscription service
- [ ] Implement loyalty program
- [ ] Add live chat support
- [ ] Create seasonal campaigns

---

## 📚 Documentation

### Required Documentation Files:
1. **README.md** - Setup and deployment instructions
2. **CONTRIBUTING.md** - Code standards and PR process
3. **API_DOCS.md** - Backend API documentation
4. **COMPONENTS.md** - Component library guide
5. **DEPLOYMENT.md** - Production deployment guide
6. **TROUBLESHOOTING.md** - Common issues and fixes

---

## ✅ Success Criteria

### Technical
- ✅ Lighthouse score ≥ 90
- ✅ WCAG 2.1 AA compliant
- ✅ LCP ≤ 2.5s
- ✅ TTFB < 500ms
- ✅ Zero critical errors in production

### Business
- ✅ Conversion rate ≥ 3.5%
- ✅ Average order value ₹350+
- ✅ Email signup rate ≥ 5%
- ✅ 99.9% uptime
- ✅ Customer satisfaction score ≥ 4.5/5

### Content
- ✅ All content from Prompt A integrated
- ✅ Mitthu Express storytelling consistent
- ✅ Brand voice maintained across all pages
- ✅ SEO metadata complete
- ✅ All 5 products live with full data

---

**Next Steps:** Begin implementation of Phase 2 components, starting with navigation and product components.
