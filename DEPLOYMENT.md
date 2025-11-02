# MitthuuG Deployment Guide

## 🚀 Quick Deploy to Netlify

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Create Netlify Account**
   - Go to [https://www.netlify.com/](https://www.netlify.com/)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Select "Deploy with GitHub"
   - Choose `pritam-ray/mithuug-website`

3. **Configure Build Settings** (auto-detected from `netlify.toml`):
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables** (CRITICAL!)
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```
   
   Find these in: Supabase Dashboard → Settings → API

5. **Deploy!** 🎉
   - Click "Deploy site"
   - Your site will be live in 2-3 minutes at `your-site.netlify.app`

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

---

## 📋 Production Deployment Checklist

### Pre-Deployment Requirements

#### 1. Environment Variables Setup
Configure these in Netlify Dashboard (Site Settings → Environment Variables):

```bash
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Payment Gateway (Optional - for production payments)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
VITE_RAZORPAY_KEY_SECRET=xxxxx  # Server-side only, never expose

# Analytics & Marketing (Optional)
VITE_GA4_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
VITE_META_PIXEL_ID=XXXXXXXXXXXXXXX

# Email Marketing
VITE_KLAVIYO_API_KEY=pk_xxxxx
VITE_KLAVIYO_LIST_ID=LIST_ID_HERE

# API Configuration
VITE_API_BASE_URL=https://api.mitthuug.com
VITE_CDN_URL=https://cdn.mitthuug.com

# Feature Flags
VITE_ENABLE_SUBSCRIPTIONS=true
VITE_ENABLE_REWARDS=true
VITE_ENABLE_REVIEWS=true

# Shipping & Delivery
VITE_FREE_SHIPPING_THRESHOLD=499
VITE_EXPRESS_SHIPPING_COST=100
VITE_STANDARD_SHIPPING_COST=40

# Error Monitoring
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

#### 2. Build Configuration Check
- [ ] Vite config optimized for production
- [ ] Tailwind CSS purging enabled
- [ ] Image compression configured
- [ ] Code splitting implemented
- [ ] Source maps disabled (or upload-only)

#### 3. Security Hardening
- [ ] HTTPS enforced
- [ ] HSTS headers configured
- [ ] CSP (Content Security Policy) set
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] XSS protection active
- [ ] CSRF tokens implemented

#### 4. Performance Optimization
- [ ] All images converted to WebP
- [ ] Lazy loading implemented
- [ ] Critical CSS inlined
- [ ] Fonts preloaded
- [ ] Brotli compression enabled
- [ ] CDN configured for static assets
- [ ] Service Worker registered

---

## 📦 Build Process

### 1. Install Dependencies
```bash
npm install --production
```

### 2. Run Type Checking
```bash
npm run typecheck
```

### 3. Run Linting
```bash
npm run lint
```

### 4. Build for Production
```bash
npm run build
```

### 5. Test Build Locally
```bash
npm run preview
```

### 6. Verify Build Output
```bash
# Check dist/ folder
ls -lh dist/
ls -lh dist/assets/

# Verify gzip sizes
gzip -c dist/assets/*.js | wc -c
gzip -c dist/assets/*.css | wc -c
```

---

## 🌐 Deployment Options

### Option 1: GitHub Pages (Current Setup)
```bash
# Deploy to GitHub Pages
npm run deploy

# This runs:
# 1. npm run build
# 2. gh-pages -d dist
```

**Post-Deployment:**
- Verify: https://pritam-ray.github.io/mithuug-website/
- Check GitHub Actions tab for deployment status
- Configure custom domain (optional)

**Custom Domain Setup:**
1. Go to Repository Settings → Pages
2. Add custom domain: `www.mitthuug.com`
3. Add CNAME file to `/public`
4. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: pritam-ray.github.io
   ```

### Option 2: Vercel (Recommended for Production)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Configure Vercel:**
1. Project Settings → Environment Variables
2. Add all `.env.production` variables
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Set Install Command: `npm install`

**Vercel Analytics:**
- Enable Web Analytics in dashboard
- Enable Speed Insights
- Configure redirects in `vercel.json`

### Option 3: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

**Configure Netlify:**
1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Option 4: AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://mitthuug-website --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 🔍 Post-Deployment Verification

### 1. Functionality Tests
- [ ] Homepage loads correctly
- [ ] Product pages accessible
- [ ] Add to cart works
- [ ] Checkout flow completes
- [ ] Payment gateway initializes
- [ ] Forms submit properly
- [ ] Search functions correctly
- [ ] Mobile menu works
- [ ] Newsletter signup works

### 2. Performance Tests
Run Lighthouse audit:
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --view

# Target scores:
# Performance: ≥ 90
# Accessibility: ≥ 90
# Best Practices: ≥ 90
# SEO: ≥ 90
```

### 3. SEO Verification
- [ ] Meta tags render correctly
- [ ] Open Graph tags present
- [ ] Twitter Cards configured
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Canonical URLs correct

### 4. Analytics Verification
- [ ] GA4 tracking code fires
- [ ] Pageview events recorded
- [ ] E-commerce events tracked
- [ ] Meta Pixel events fire
- [ ] GTM container loads
- [ ] Conversion tracking works

### 5. Security Tests
- [ ] HTTPS redirects work
- [ ] Security headers present
- [ ] No mixed content warnings
- [ ] CSP violations: 0
- [ ] XSS vulnerabilities: None
- [ ] SQL injection protected

---

## 🔧 Troubleshooting

### Build Fails

**Error: Out of memory**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routing Issues (404 on refresh)

**GitHub Pages:**
Add `404.html` that redirects to `index.html`

**Vercel/Netlify:**
Configure rewrites in `vercel.json` or `netlify.toml`

### Environment Variables Not Loading

**Check:**
1. Variables prefixed with `VITE_`
2. `.env.production` file exists
3. Variables not quoted (in most cases)
4. Rebuild after adding new variables

### Slow Load Times

**Diagnose:**
```bash
# Analyze bundle size
npm run build -- --mode analyze

# Check for large dependencies
npx vite-bundle-visualizer
```

**Fix:**
- Code split large routes
- Lazy load images
- Enable compression
- Use CDN for assets

---

## 🔄 Rollback Procedure

### GitHub Pages
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard COMMIT_HASH
git push origin main --force
```

### Vercel
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback DEPLOYMENT_URL
```

### Netlify
1. Go to Netlify Dashboard
2. Site Settings → Deploys
3. Click on previous successful deploy
4. Click "Publish deploy"

---

## 📊 Monitoring & Alerts

### Setup Uptime Monitoring
**UptimeRobot (Free):**
1. Create account
2. Add monitor for homepage
3. Set check interval: 5 minutes
4. Add alert contacts (email, Slack)

**Better Uptime:**
1. More detailed monitoring
2. Status page included
3. Incident management

### Error Tracking with Sentry
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});
```

### Performance Monitoring
- Use Vercel Analytics / Netlify Analytics
- Enable Google PageSpeed Insights API
- Set up Core Web Vitals tracking in GA4
- Monitor bundle sizes with Bundlewatch

---

## 📝 Deployment Logs

### Maintain Deployment History
```markdown
# DEPLOYMENT_LOG.md

## 2025-11-01 - Initial Production Deploy
- **Version:** 1.0.0
- **Platform:** GitHub Pages
- **Deployed by:** Pritam Ray
- **Changes:** Initial launch with 5 products
- **Performance:** LCP 2.1s, FID 45ms, CLS 0.05
- **Issues:** None

## 2025-11-05 - Add Subscription Feature
- **Version:** 1.1.0
- **Platform:** GitHub Pages
- **Deployed by:** Pritam Ray
- **Changes:** Subscription engine, new product variants
- **Performance:** LCP 2.3s, FID 50ms, CLS 0.06
- **Issues:** Razorpay test mode still active (fixed immediately)
```

---

## 🎯 Production Readiness Checklist

### Final Checks Before Go-Live
- [ ] All environment variables set
- [ ] Payment gateway in LIVE mode
- [ ] Test purchases completed successfully
- [ ] Email flows tested
- [ ] SMS notifications working
- [ ] Backup strategy in place
- [ ] SSL certificate valid
- [ ] Domain configured
- [ ] CDN active
- [ ] Analytics tracking verified
- [ ] Error monitoring active
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Security scan completed
- [ ] Legal pages reviewed
- [ ] FSSAI details visible
- [ ] Return policy clear
- [ ] Privacy policy compliant
- [ ] Terms of service updated
- [ ] Support channels tested
- [ ] Social media links verified

---

## 📞 Support & Resources

### Documentation
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deploy](https://reactrouter.com/en/main/guides/spa)
- [Tailwind Production](https://tailwindcss.com/docs/optimizing-for-production)

### Contact
- **Technical Issues:** tech@mitthuug.com
- **Deployment Support:** deploy@mitthuug.com
- **Emergency Hotline:** +91-XXXXXXXXXX

---

**Last Updated:** 2025-11-01  
**Maintained By:** MitthuuG DevOps Team
