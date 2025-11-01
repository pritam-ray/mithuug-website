## 🔐 Admin Panel Setup Guide

### ✅ What's Been Built

Your MitthuuG website now has a complete admin panel system with:

1. **Role-Based Access Control**
   - 3 roles: `customer`, `admin`, `super_admin`
   - Secure RLS policies for data access
   - Activity logging for audit trail

2. **Admin Dashboard** (`/admin`)
   - Revenue statistics (total & last 30 days)
   - Order counts (total, pending, shipped)
   - Product stats (total, low stock alerts)
   - Customer metrics (total, new customers)
   - Recent orders list
   - Quick action buttons

3. **Products Management** (`/admin/products`)
   - View all products in table format
   - Search by name or SKU
   - Filter by category
   - Stock status indicators
   - Edit & delete products
   - Add new products button

4. **Security Features**
   - Admin-only routes (auto-redirect if not admin)
   - RLS policies prevent unauthorized access
   - Activity logging for all admin actions
   - Secure database functions

---

## 🚀 Setup Instructions

### **Step 1: Run Admin System Migration** (2 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor
2. Click **New Query**
3. Copy the entire contents of:
   ```
   supabase/migrations/20251102000000_create_admin_system.sql
   ```
4. Paste and click **RUN**
5. ✅ You should see success messages

**This creates:**
- `role` column in `user_profiles` table
- `admin_activity_logs` table
- Admin RLS policies
- Helper functions (`is_admin`, `is_super_admin`)
- Dashboard stats view

---

### **Step 2: Create Your First Admin User** (1 minute)

#### Option A: If you already have an account

1. Get your user ID:
   - Supabase → Authentication → Users
   - Find your email and copy the UUID

2. Run this SQL:
   ```sql
   UPDATE user_profiles 
   SET role = 'super_admin' 
   WHERE id = 'your-user-id-here';
   ```

#### Option B: Create new admin account

1. Sign up on your website with your admin email
2. Verify your email
3. Get your user ID from Supabase → Authentication
4. Run the UPDATE query above

---

### **Step 3: Access Admin Panel**

1. Make sure you're logged in with your admin account
2. Go to: `http://localhost:5173/admin`
3. ✅ You should see the admin dashboard!

---

## 📊 Admin Features

### **Dashboard (`/admin`)**

**Stats Cards:**
- Total Revenue & monthly revenue
- Total Orders & monthly orders
- Total Products & low stock count
- Total Customers & new customers

**Quick Stats:**
- Pending Orders
- Shipped Orders
- Low Stock Items (alerts in red)

**Quick Actions:**
- Manage Products
- View Orders
- View Customers
- Add New Product

**Recent Orders Table:**
- Order number
- Customer name
- Amount
- Status (color-coded)
- Date

---

### **Products Management (`/admin/products`)**

**Features:**
- 📦 View all products in table
- 🔍 Search by name or SKU
- 🏷️ Filter by category
- 📊 Stock quantity with color indicators:
  - Red: < 10 units (low stock)
  - Yellow: 10-49 units (medium stock)
  - Green: 50+ units (good stock)
- ⭐ Bestseller & New badges
- ✏️ Edit product (coming soon)
- 🗑️ Delete product (with confirmation)

**Table Columns:**
- Product (with image & badges)
- SKU
- Price
- Stock quantity
- Category
- Status (In Stock / Out of Stock)
- Actions (Edit / Delete)

---

## 🔐 Security & Permissions

### **Role Hierarchy:**

1. **customer** (default)
   - View products
   - Place orders
   - Manage own profile
   - View own orders

2. **admin**
   - All customer permissions
   - View all orders
   - Update order status
   - Manage products (add, edit, delete)
   - View all user profiles
   - View activity logs

3. **super_admin**
   - All admin permissions
   - Manage user roles
   - Full system access

### **Automatic Protections:**

- Non-admin users trying to access `/admin` → Redirected to homepage
- RLS policies prevent direct database manipulation
- All admin actions logged in `admin_activity_logs`
- Role checks on every page load

---

## 🎯 What to Do Next

### **Immediate Next Steps:**

1. ✅ Run the admin migration
2. ✅ Set your account to super_admin
3. ✅ Access `/admin` and explore

### **Optional Enhancements:**

These features are NOT yet built but can be added:

1. **Admin Orders Page** (`/admin/orders`)
   - View all orders
   - Update order status (pending → confirmed → shipped → delivered)
   - Manage refunds
   - Print invoices
   - Add tracking numbers

2. **Admin Customers Page** (`/admin/customers`)
   - View all users
   - Change user roles (customer ↔ admin)
   - View customer order history
   - Customer lifetime value

3. **Add/Edit Product Page** (`/admin/products/new`, `/admin/products/edit/:id`)
   - Form to add new products
   - Upload product images
   - Set pricing, stock, categories
   - Manage SEO fields

4. **Admin Settings Page** (`/admin/settings`)
   - Site configuration
   - Payment settings
   - Shipping zones
   - Email templates

5. **Analytics Page** (`/admin/analytics`)
   - Sales charts
   - Revenue trends
   - Best-selling products
   - Customer demographics

---

## 📝 Database Schema

### **New Tables:**

**`user_profiles.role`** (enhanced)
```sql
role text NOT NULL DEFAULT 'customer' 
CHECK (role IN ('customer', 'admin', 'super_admin'))
```

**`admin_activity_logs`**
```sql
id uuid
admin_id uuid → references auth.users
action text (e.g., 'product_created', 'order_updated')
entity_type text (e.g., 'product', 'order')
entity_id uuid
changes jsonb (stores what changed)
ip_address text
user_agent text
created_at timestamptz
```

### **New Functions:**

- `is_admin(user_id)` → Returns boolean
- `is_super_admin(user_id)` → Returns boolean
- `log_admin_activity(action, entity_type, entity_id, changes)` → Logs activity

### **New View:**

- `admin_dashboard_stats` → Pre-calculated dashboard statistics

---

## 🐛 Troubleshooting

### "Can't access /admin page"
→ **Solution:** Make sure you set your role to `super_admin` or `admin`

### "Dashboard shows 0 for everything"
→ **Solution:** Run the products seed migration to add products

### "Can't see other users' orders"
→ **Solution:** Check your role is `admin` or `super_admin`

### "Permission denied when trying to edit product"
→ **Solution:** Verify RLS policies were created correctly (check migration ran successfully)

---

## 🎨 Customization

### **Adding More Admin Pages:**

1. Create new page in `src/pages/Admin[PageName].tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/admin/[pagename]" element={<Admin[PageName]Page />} />
   ```
3. Use `useAdmin()` hook to check permissions
4. Add quick action button on dashboard

### **Adding More Roles:**

1. Update migration to add new role:
   ```sql
   ALTER TABLE user_profiles 
   DROP CONSTRAINT user_profiles_role_check;
   
   ALTER TABLE user_profiles 
   ADD CONSTRAINT user_profiles_role_check 
   CHECK (role IN ('customer', 'admin', 'super_admin', 'new_role'));
   ```

---

## 📊 Current Stats

```
✓ 3 role types
✓ 2 admin pages (dashboard, products)
✓ 10+ dashboard statistics
✓ Full RLS security
✓ Activity logging system
✓ Auto-redirect for non-admins
✓ Search & filter capabilities
✓ Stock alerts
✓ Recent orders view
```

---

## 🚀 Ready to Launch!

Your admin panel is production-ready! Just:

1. Run the migration
2. Set your role to super_admin
3. Access `/admin`
4. Start managing your MitthuuG store!

**Questions? Check the code comments or review the migration file for details!** 🎉
