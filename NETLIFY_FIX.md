# Netlify Blank Page - Quick Fix Guide

## 🔧 The Issue
Your Netlify site shows a blank page because the environment variables (Supabase credentials) are missing.

## ✅ Solution: Add Environment Variables to Netlify

### Step 1: Open Netlify Dashboard
1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Select your site: `mitthuug`

### Step 2: Add Environment Variables
1. Click on **"Site settings"** (or **"Site configuration"**)
2. In the left sidebar, click **"Environment variables"**
3. Click **"Add a variable"** or **"Add environment variables"**

### Step 3: Add These Variables

Add each variable one by one:

**Variable 1:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://voyratmtxqkfntjunmbr.supabase.co`
- Scopes: Production, Deploy Previews, Branch deploys (select all)

**Variable 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveXJhdG10eHFrZm50anVubWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODEyNjIsImV4cCI6MjA3NzM1NzI2Mn0._6nEe4PwNpi8FJui-zwb_RrFR9tZ9Q9Q_6qjv8-ormQ`
- Scopes: Production, Deploy Previews, Branch deploys (select all)

**Variable 3 (Optional - for Razorpay):**
- Key: `VITE_RAZORPAY_KEY_ID`
- Value: `rzp_test_RW2mMIwwHqmKC8`
- Scopes: Production, Deploy Previews, Branch deploys (select all)

**Variable 4 (Optional):**
- Key: `VITE_PAYMENT_MODE`
- Value: `test`
- Scopes: Production, Deploy Previews, Branch deploys (select all)

### Step 4: Redeploy Your Site
After adding the variables:

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait 2-3 minutes for the build to complete

### Step 5: Verify It's Working
1. Open your site: `https://mitthuug.netlify.app`
2. Open browser console (Press F12)
3. Check for any errors
4. The homepage should now load properly

---

## 🐛 Still Having Issues?

### Check Browser Console for Errors
1. Press **F12** to open Developer Tools
2. Click the **"Console"** tab
3. Look for error messages (especially red text)
4. Common errors:
   - "Supabase client is not initialized" → Environment variables not set
   - "Failed to fetch" → Supabase URL incorrect
   - "Invalid API key" → Anon key incorrect

### Verify Build Logs
1. In Netlify, go to **"Deploys"** tab
2. Click on the latest deploy
3. Click **"Deploy log"**
4. Check for build errors
5. Verify you see: `✓ built in X seconds`

### Test Locally First
```bash
# Make sure it works locally
npm run build
npm run preview

# If local works but Netlify doesn't, it's definitely env variables
```

---

## 📋 Quick Checklist
- [ ] Environment variables added to Netlify
- [ ] All variable names start with `VITE_`
- [ ] Values copied correctly (no extra spaces)
- [ ] Site redeployed after adding variables
- [ ] Build completed successfully
- [ ] Browser console shows no errors

---

## 🎯 Expected Result
After fixing, you should see:
- ✅ Homepage loads with products
- ✅ Navigation menu works
- ✅ No console errors
- ✅ Supabase connection established
