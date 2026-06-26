# MitthuuG - Premium Indian GUD Bites E-Commerce Store

[![MitthuuG Header](https://img.shields.io/badge/MitthuuG-Premium%20GUD%20Bites-C6862E?style=for-the-badge&logoColor=white)](http://localhost:5175/)
[![Deployment - Netlify](https://img.shields.io/badge/Deploy-Netlify-00AD9F?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TypeScript%20%7C%20Supabase-4B2E2A?style=for-the-badge)](https://react.dev)

> **Nostalgia meets freshness.** Handcrafted sesame & jaggery delights with a modern twist. All natural, zero refined sugar, zero preservatives. 🚂✨

---

## 🎯 About MitthuuG

MitthuuG is a premium Indian snack brand reviving traditional sesame and jaggery (GUD) treats. Combining heritage family recipes with contemporary design and packaging, MitthuuG brings the warmth of home-style sweets to modern, health-conscious consumers.

### Brand Philosophy: The Mitthu Express
Our storytelling is framed as a **5-station nostalgic journey** (The First Bite, Spreading Warmth, Perfecting the Blend, Sharing the Love, and Launch Day), inviting customers to ride along as they explore our handcrafted creations.

---

## ✨ Key Features

### 🛍️ Comprehensive E-Commerce Experience
* **Product Catalog & Filtering:** Dynamic, interactive shop with search, category filtering, and price sliders.
* **Detailed Product Spotlights:** Deep-dives into ingredients, complete nutritional profiles (energy, carbs, protein, healthy fats), and customer reviews.
* **Nostalgic User Cart:** Fully responsive checkout-ready sliding cart drawer and dedicated cart page.
* **Unified Free Shipping Threshold:** Automatically updates shipping progress indicators based on a consistent **₹499** threshold.

### 🔌 Resilient Data Architecture
* **Hybrid Data Cache System:** Integrated with Supabase but designed with a custom **automatic local fallback**. If Supabase is empty or encounters connection errors, the app gracefully falls back to local product data, ensuring zero downtime and fully populated pages.

### 💬 Interactive Support & Engagement
* **Live Chat Widget:** A fully-integrated customer support chat widget allowing users to ask questions directly, backed by an admin chat console.
* **Wishlist System:** Allows logged-in users to save their favorite snacks for later.

### 🎨 Visual & Interactive Excellence
* **Harmonious Brand Palette:** Curated Ochre Gold (`#C6862E`), Chocolate Brown (`#4B2E2A`), Ivory (`#F6F0E1`), and Organic Olive Green.
* **Custom Typography:** Sophisticated combination of Playfair Display and Inter.
* **Micro-Animations:** Fluid layout transitions and card hover animations powered by Framer Motion.

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 18 (TypeScript)
* **Build System:** Vite 5
* **CSS & Layout:** Tailwind CSS 3
* **State & Routing:** React Router Dom 7 & React Context
* **Backend & Database:** Supabase (Auth, PostgreSQL DB, RLS, Storage)
* **Payment Processing:** Razorpay Integration
* **Animations:** Framer Motion
* **Icons:** Lucide React

---

## ⚙️ Environment Variables

To run the application locally or deploy it to production, create a `.env` file in the root directory (based on `.env.example`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay Configuration (Test/Live Keys)
VITE_RAZORPAY_KEY_ID=rzp_test_yourKeyHere

# Deployment Target (netlify or gh-pages)
VITE_DEPLOY_TARGET=netlify
```

> [!WARNING]
> Keep your `.env` file secure. Never commit it to GitHub. It is ignored by git in this project.

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Node.js** (v18.x or higher)
* **NPM** (v9.x or higher)

### Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/pritam-ray/mithuug-website.git
   cd mithuug-website
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Add your real Supabase & Razorpay keys inside .env
   ```

4. **Launch Dev Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

5. **Production Build & Preview:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📂 Folder Structure

```
mitthuug-website/
├── public/                 # Static assets (logos, icons, etc.)
├── src/
│   ├── components/         # Reusable UI elements (Navbar, Footer, Cart, ProductCard)
│   │   └── mobile/         # Mobile-specific UI elements (CartDrawer, MobileMenu)
│   ├── context/            # Global React Context providers (Auth, Cart, Chat)
│   ├── data/               # Static local content & product copy
│   ├── lib/                # API clients and utilities (Supabase, Razorpay, dataCache)
│   ├── pages/              # Page components (Home, Shop, Product Details, Auth, Policies)
│   ├── types/              # TS interface and database definitions
│   ├── App.tsx             # Root component and router config
│   ├── index.css           # Global styles and Tailwind imports
│   └── main.tsx            # Main application entry point
├── supabase/               # SQL migrations and database setup scripts
│   ├── migrations/         # PostgreSQL schema tables
│   └── seed_products.sql   # SQL insert scripts for product metadata
├── eslint.config.js        # ESLint rule configurations
├── tailwind.config.js      # Custom theme, colors, and layout tokens
├── vite.config.ts          # Vite build and target configuration
└── netlify.toml            # Netlify SPA redirect rules & security headers
```

---

## ⚡ Deployment to Netlify

This website is fully optimized for **Netlify** deployment using the pre-configured `netlify.toml` file, which includes client-side SPA routing rewrites.

### Continuous Deployment via GitHub (Recommended)
1. **Push your code** to your GitHub repository.
2. Log in to your [Netlify Dashboard](https://app.netlify.com/).
3. Click **Add new site** > **Import an existing project**.
4. Choose **GitHub** and authorize Netlify to access your repository.
5. Select the `mithuug-website` repository.
6. **Configure Build Settings:**
   * **Branch to deploy:** `main`
   * **Build command:** `npm run build`
   * **Publish directory:** `dist`
7. **Add Environment Variables:**
   Go to *Site configuration* > *Environment variables* and add:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
   * `VITE_RAZORPAY_KEY_ID`
   * `VITE_DEPLOY_TARGET` = `netlify`
8. Click **Deploy site**. Netlify will automatically build and publish your site on every push to `main`.

---

## 📜 License & Copyright

Designed and built for **MitthuuG**.
Licensed under the [MIT License](LICENSE).
