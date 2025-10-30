# MitthuuG - Premium Indian GUD Bites E-Commerce Store

![MitthuuG Logo](https://img.shields.io/badge/MitthuuG-Premium%20GUD%20Bites-C6862E?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

> **Nostalgia meets freshness.** Handcrafted sesame & jaggery delights with a modern twist. 🚂✨

---

## 🎯 About MitthuuG

MitthuuG is a premium Indian snack brand specializing in handcrafted GUD (jaggery) bites made with sesame seeds. We're reviving traditional Indian sweets with a contemporary approach — no refined sugar, no preservatives, just honest ingredients that taste like home.

**Brand Philosophy:** The "Mitthu Express Journey" — celebrating each milestone as a station in our story of bringing nostalgia to modern snackers.

---

## ✨ Features

### 🛍️ E-Commerce Functionality
- Product catalog with 5 SKUs
- Advanced filtering (category, price range, search)
- Shopping cart with persistent storage
- Product detail pages with nutrition facts
- Wishlist functionality
- User authentication & profiles
- Order management system
- Review & rating system

### 🎨 Design & UX
- **Brand Colors:** Ochre Gold (#C6862E), Chocolate Brown (#4B2E2A)
- **Typography:** Playfair Display (headings) + Inter (body)
- **Responsive:** Mobile-first design, works on all devices
- **Accessibility:** WCAG 2.1 compliant
- **Performance:** Optimized builds with Vite

### 📱 Pages Included
1. **HomePage** - Hero, USPs, featured products, Mitthu Express CTA
2. **ShopPage** - Full catalog with filters and search
3. **ProductDetailPage** - Nutrition highlights, ingredients, reviews
4. **AboutPage** - Brand story with 5-station journey timeline
5. **AccountPage** - User profile and order history
6. **CheckoutPage** - Secure checkout flow
7. **LoginPage** & **SignUpPage** - Authentication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd mitthuug_2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

Visit http://localhost:5173/ to see your site!

### Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the migration: `supabase/migrations/20251030091406_create_products_and_users_tables.sql`
3. Seed products: `supabase/seed_products.sql`
4. Update `src/lib/supabase.ts` with your credentials

---

## 📁 Project Structure

```
mitthuug_2/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Cart.tsx
│   │   ├── Footer.tsx       # ✨ Redesigned
│   │   ├── Navbar.tsx       # ✨ Redesigned
│   │   ├── ProductCard.tsx  # ✨ Redesigned
│   │   └── ReviewSection.tsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── data/                # ✨ NEW - Content & Products
│   │   ├── content.ts       # All copy (hero, USPs, FAQs, etc.)
│   │   └── products.ts      # Product catalog with nutrition data
│   ├── lib/
│   │   └── supabase.ts      # Supabase client
│   ├── pages/               # Main application pages
│   │   ├── AboutPage.tsx    # ✨ Redesigned with journey
│   │   ├── HomePage.tsx     # ✨ Redesigned with branding
│   │   ├── ProductDetailPage.tsx  # ✨ Enhanced with nutrition
│   │   ├── ShopPage.tsx     # ✨ Enhanced with filters
│   │   ├── AccountPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SignUpPage.tsx
│   ├── types/
│   │   └── database.ts      # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── index.css            # ✨ Updated with fonts
│   └── main.tsx             # Entry point
├── supabase/
│   ├── migrations/          # Database schema
│   └── seed_products.sql    # ✨ NEW - Product seeding
├── public/                  # Static assets
├── tailwind.config.js       # ✨ Updated with brand colors
├── vite.config.ts           # Vite configuration
├── package.json
├── IMPLEMENTATION_SUMMARY.md  # ✨ Technical docs
├── QUICK_REFERENCE.md         # ✨ Developer guide
├── DEVELOPMENT_GUIDE.md       # ✨ Testing & deployment
└── README.md                  # This file
```

---

## 🎨 Design System

### Color Palette
```css
Ochre Gold:     #C6862E (Primary brand color)
Chocolate:      #4B2E2A (Text & dark backgrounds)
Metallic Gold:  #B8860B (Accents & badges)
Ivory:          #F6F0E1 (Backgrounds)
Olive Green:    #6B8E23 (Natural/organic indicators)
```

Each color has 50-900 shade variants (e.g., `ochre-50`, `ochre-100`, ..., `ochre-900`).

### Typography
- **Headings:** Playfair Display (serif, bold)
- **Body:** Inter (sans-serif)
- **Alternatives:** Merriweather (serif), Lato (sans-serif)

### Component Patterns
See `QUICK_REFERENCE.md` for button styles, cards, sections, and more.

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 5.4.21** - Build tool & dev server
- **Tailwind CSS 3.4.1** - Utility-first styling
- **React Router 7.9.5** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row-level security
  - Real-time subscriptions
  - Storage for images

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Type checking

---

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## 🌐 Deployment

### Recommended: Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Alternative: Netlify
1. Build: `npm run build`
2. Publish directory: `dist`
3. Add environment variables

### Environment Variables
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📊 Product Data

### Current Catalog (5 SKUs)
1. **Classic Til-Gud Bites** - ₹349 (250g) - Bestseller
2. **Cardamom Til-Gud Bites** - ₹399 (250g) - New
3. **Almond Til-Gud Bites** - ₹499 (250g) - New & Bestseller
4. **Trial Pack** - ₹99 (50g)
5. **Premium Gift Box** - ₹799 (500g) - Bestseller

Each product includes:
- Detailed descriptions
- Nutrition facts (energy, protein, fats, carbs, minerals)
- Complete ingredients list
- SEO metadata
- Category & weight information

---

## 🎯 Brand Voice

### Characteristics
- **Warm & Inviting:** "Welcome aboard the Mitthu Express!"
- **Witty:** Using Hinglish phrases like "GUD vibes"
- **Nostalgic:** References to grandmother's recipes
- **Modern:** Contemporary packaging and storytelling
- **Artisan:** Emphasis on handcrafted quality

### Key Phrases
- "All aboard the Mitthu Express! 🚂"
- "No refined sugar, just honest ingredients"
- "From desk to Diwali"
- "Crafted with ❤️ in India"

---

## 📈 SEO & Marketing

### Built-in Features
- Meta tags for all pages
- Semantic HTML structure
- Alt text for images
- Structured data ready (JSON-LD)
- Open Graph tags
- Fast loading times

### Marketing Integration Ready
- Newsletter signup in footer
- Social media links (Instagram)
- Email capture system
- Analytics tracking (add your GA4 ID)
- Facebook Pixel ready

---

## 🔐 Security

- ✅ Row-level security (RLS) enabled on all tables
- ✅ Environment variables for secrets
- ✅ Input validation on forms
- ✅ HTTPS enforced in production
- ✅ Secure authentication via Supabase
- ✅ XSS protection

---

## 🧪 Testing

### Manual Testing Checklist
See `DEVELOPMENT_GUIDE.md` for comprehensive testing steps.

### Key Areas
- Product browsing & filtering
- Cart functionality
- Checkout process
- User authentication
- Responsive design
- Cross-browser compatibility

---

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete technical documentation of all changes
- **QUICK_REFERENCE.md** - Developer guide with code examples and patterns
- **DEVELOPMENT_GUIDE.md** - Testing, deployment, and troubleshooting
- **README.md** - This file (project overview)

---

## 🤝 Contributing

This is a custom project for MitthuuG. For changes:
1. Test locally
2. Update documentation
3. Ensure mobile responsiveness
4. Maintain brand guidelines

---

## 📄 License

MIT License - Feel free to use this code for your own projects.

---

## 🎉 Acknowledgments

### Inspiration
- Traditional Indian GUD (jaggery) sweets
- Artisan food brands
- E-commerce best practices

### Assets
- Images: Pexels (placeholder images)
- Icons: Lucide React
- Fonts: Google Fonts

---

## 📞 Contact

**MitthuuG**
- Email: hello@mitthuug.com
- Instagram: @mitthuug
- Website: [Coming Soon]

---

## 🚂 The Mitthu Express Journey

This website represents our journey from **Station 1** (The First Bite) to **Station 5** (Launch Day) and beyond. Each station is a milestone in bringing traditional Indian snacks to the modern world.

**Next Station:** Your successful launch! 🎊

---

**Built with ❤️ for preserving Indian food traditions**

*Last Updated: October 30, 2025*
