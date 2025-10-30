Prompt B — Enhanced Bolt Build & Implementation System for MitthuuG

ROLE & GOAL:You are a senior ecommerce developer and product designer tasked with building, optimizing, and deploying the complete MitthuuG ecommerce experience. The site must be mobile-first, conversion-optimized, lightning fast, and infused with the emotional storytelling of the “Mitthu Express” journey.You will use Bolt (or a similar site builder framework) to create production-ready templates, components, and integrations. Every step must align with the design, brand, and content system produced in Prompt A.

1. BRAND IMPLEMENTATION FRAMEWORK

- Integrate colors, fonts, and tone exactly as defined in Prompt A.  - Visual storytelling must feel like a continuation of Mitthu Express — warm, honest, handcrafted.  - All typography, icons, and motion design should reflect nostalgia + modernity.  

2. DESIGN SYSTEM

Colors:  Primary — Ochre Gold #C6862E  Secondary — Chocolate Brown #4B2E2A  Accent — Metallic Gold #B8860B  Background — Ivory #F6F0E1  Natural Accent — Olive #6B8E23  Typography:  Headings — Playfair Display or Merriweather  Body — Inter or Lato  Fallback — system fontsIconography:  Line icons for: freshness, handmade, secure checkout, fast shipping, nostalgia.

3. PAGES & COMPONENTS

Pages to build:  - Home  - Category (with filters and sort)  - Product Detail  - Cart  - Checkout  - Account Dashboard  - Blog  - About / Story  - FAQ  - Contact (WhatsApp + Email)  - 404 / Maintenance  Reusable Components:  Header, Footer, ProductCard, Modal, StickyCart, ReviewsList, HeroSection, USPGrid, TestimonialSlider, NewsletterForm.

4. FUNCTIONAL REQUIREMENTS

Payment Gateways: Razorpay, PayU, Stripe, UPI, Wallets, COD.  Shipping: Pincode-based delivery, express shipping, dynamic rates, free shipping above ₹599.  Inventory: Variant-level tracking with “low stock” and “out of stock” triggers.  Subscription: Enable recurring purchases with 5% discount and “pause anytime” feature.  Promo Engine: Coupon codes, bundle discounts, gift wrap upsell, referral codes.  Reviews: Integrate Yotpo or Stamped.io for product reviews and UGC.  Search: Typo-tolerant, auto-suggest search bar.  

5. UX & PERFORMANCE REQUIREMENTS

- Mobile-first layout.  - Largest Contentful Paint (LCP) ≤ 2.5s on 4G.  - TTFB < 500ms.  - Accessibility: WCAG 2.1 AA compliance.  - SEO score ≥ 90 on Lighthouse.  - Responsive breakpoints: 360px / 768px / 1024px / 1440px.  - Sticky Add-to-Cart on mobile product pages.  - Lazy load all images (WebP).  

6. SITE STRUCTURE & NAVIGATION

Top Navigation: Shop, About, Blog, Contact.  Secondary Bar: Offers, Gift Packs, Subscriptions.  Footer: Newsletter, Legal, Policies, Social links.  Use consistent storytelling tone — tie sections to Mitthu Express episodes.  Example: “Station 5 — The Logo Story” links to the brand blog category.

7. SEO & STRUCTURED DATA

Implement JSON-LD structured data:  - Product schema for all SKUs (title, price, availability, image, rating, brand).  - Organization schema for MitthuuG (with social handles).  - FAQ schema for support page.  Add canonical tags, hreflang readiness, sitemap.xml, robots.txt, and meta tags from Prompt A.  Optimize Open Graph and Twitter Card previews (1200×630).  

8. ANALYTICS & MARKETING INTEGRATIONS

- Google Analytics 4 + GTM (track impressions, add-to-cart, checkout, purchases).  - Meta Pixel (retargeting and conversions).  - Klaviyo (email flows and segmentation).  - Server-side conversion API webhook for accuracy.  - UGC / Review plugin sync with homepage carousel.  

9. SECURITY & COMPLIANCE

- Enforce HTTPS + HSTS.  - Cookie consent banner (India compliant).  - Privacy Policy, Terms, and FSSAI info linked in footer.  - Secure tokenized payments.  - Rate limit API endpoints for spam protection.  

10. PERFORMANCE & DEPLOYMENT

Use image CDN, GZIP/Brotli compression, and minified CSS/JS.  Inline critical CSS for hero.  Deploy via staging → production workflow with versioning.  Monitor uptime via Sentry.  

11. TESTING & QA

Manual Tests:  - Purchase flow (guest checkout + coupon + COD).  - Subscription flow.  - Mobile UX + image loading.  - Analytics events validation.  Automated Tests:  - Playwright scripts for add-to-cart, checkout, and subscription.  - Accessibility audit using axe-core.  

12. A/B TESTING FRAMEWORK

Run experiments for:  1. Hero headline variants.  2. CTA color vs copy.  3. Product layout (tabs vs accordion).  4. Price anchoring with bundles.  5. Limited edition urgency banners.  Each experiment must define:  - Hypothesis  - Metric to track (CTR, CR, Bounce Rate)  - Sample size (min 200 visitors per variant)  

13. DEPLOYMENT CHECKLIST

☑ GA4 & Meta Pixel firing correctly.  ☑ Checkout & payment flow successful.  ☑ SEO audit ≥ 90 score.  ☑ Accessibility audit passes all critical items.  ☑ Images compressed and lazy loaded.  ☑ FSSAI info visible on About page.  

14. OUTPUT FORMAT

Deliverables must include:  1. Complete Bolt build plan (step-by-step).  2. Code/config snippets for each template & component.  3. Product JSON import file (from Prompt A).  4. README with environment variables, testing, and rollback steps.  

15. PERFORMANCE TRACKING & REPORTING

Track first 90-day KPIs:  - Conversion Rate (goal ≥ 3.5%)  - Average Order Value (₹350+)  - Repeat Purchase Rate (≥ 20%)  - Email Signup Rate (≥ 5%)  - CAC from paid campaigns  Generate a 30-day analytics summary for stakeholders.  

16. ITERATION & IMPROVEMENT

After first deploy:  - Conduct 3 usability tests with 5 users each.  - Identify top 5 friction points and fix high-impact issues.  - A/B test hero variants for 14 days minimum.  

17. MITTHU EXPRESS CONNECTION

Integrate subtle references to “stations” throughout the UI:  - Progress bar in the checkout called “Your Journey”.  - Blog category titled “From the Express”.  - Home section named “Next Stop: Gifting Season”.  This connects the ecommerce site with your Instagram storytelling universe.  

END OF PROMPT B

Once completed, export the final build plan and test results in Markdown for review.  Do not request confirmations. Begin full implementation immediately using the JSON and content from Prompt A.


