# 🔧 Fix Signup Error - RLS Policy Issue

## ❌ Error You're Seeing

```
new row violates row-level security policy for table "user_profiles"
```

## ✅ What's Wrong

Supabase has Row-Level Security (RLS) enabled on the `user_profiles` table, but there are no policies allowing users to create their own profiles during signup.

## 🚀 Quick Fix (2 minutes)

### Step 1: Go to Supabase SQL Editor

1. Open: https://supabase.com/dashboard/project/voyratmtxqkfntjunmbr/sql
2. Click **"New query"**

### Step 2: Run the Migration

1. **Copy ALL the SQL** from this file:
   ```
   supabase/migrations/20251101000001_fix_user_profiles_rls.sql
   ```

2. **Paste** into SQL Editor

3. Click **"Run"** (bottom right)

4. You should see: ✅ **"Success"** with several "CREATE POLICY" messages

### Step 3: Test Signup Again

1. Go back to your website: http://localhost:5173/signup
2. Fill in the form
3. Click **"Create Account"**
4. ✅ **It should work now!**

## 📋 What This Migration Does

### 1. Creates RLS Policies

Allows authenticated users to:
- ✅ **INSERT** their own profile (during signup)
- ✅ **SELECT** their own profile (view their data)
- ✅ **UPDATE** their own profile (edit account info)
- ✅ **DELETE** their own profile (optional)

### 2. Creates Auto-Profile Trigger

Automatically creates a profile when a user signs up:
- Triggers when new user is created in `auth.users`
- Creates matching row in `user_profiles`
- Uses the `full_name` from signup metadata

### 3. Grants Permissions

Ensures authenticated users can access their profiles.

## 🔍 Verify It Worked

### In Supabase Dashboard:

1. Go to **Authentication** → **Policies**
2. Select table: `user_profiles`
3. You should see 4 policies:
   - ✅ Users can insert own profile on signup
   - ✅ Users can view own profile
   - ✅ Users can update own profile
   - ✅ Users can delete own profile

### Test Signup:

1. **Clear your browser cache** or use incognito mode
2. Go to http://localhost:5173/signup
3. Enter:
   - Full Name: Test User
   - Email: test@example.com
   - Password: Test123!
4. Click **"Create Account"**
5. ✅ Should redirect without error
6. Check your email for verification link

### Verify in Database:

1. Go to **Table Editor** → **user_profiles**
2. You should see a new row with:
   - `id` = user UUID
   - `full_name` = "Test User"
   - `created_at` = current timestamp

## 🎯 How It Works Now

### Old Flow (Broken):
```
User signs up
    ↓
Auth creates user in auth.users
    ↓
Frontend tries to create profile ❌ (RLS blocks it)
    ↓
ERROR: "violates row-level security policy"
```

### New Flow (Fixed):
```
User signs up with metadata
    ↓
Auth creates user in auth.users
    ↓
Database trigger automatically creates profile ✅
    ↓
RLS policies allow it because auth.uid() matches
    ↓
SUCCESS: User is signed up and redirected
```

## ⚠️ Already Have Users?

If you already created test accounts that failed, they might be in a broken state:

### Option 1: Delete Test Users
1. Go to **Authentication** → **Users**
2. Find test users with no profile
3. Click **"..."** → **"Delete user"**
4. Sign up again

### Option 2: Manually Create Profiles
```sql
-- Run this in SQL Editor to create missing profiles
INSERT INTO user_profiles (id, full_name, created_at, updated_at)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', email),
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles);
```

## 🧪 Test Different Scenarios

### Test 1: New Signup
- Go to /signup
- Create account
- ✅ Should work without errors

### Test 2: Email Verification
- Check your email
- Click verification link
- ✅ Should confirm email

### Test 3: Login After Signup
- Go to /login
- Enter credentials
- ✅ Should login successfully

### Test 4: View Profile
- After login, go to /account
- ✅ Should see your profile with full name

## 🔒 Security Notes

### What's Protected:
- ✅ Users can ONLY access their own profiles
- ✅ Users can ONLY update their own data
- ✅ Users CANNOT see other users' profiles
- ✅ Anonymous users have NO access

### The RLS Rule:
```sql
auth.uid() = id
```
This ensures the logged-in user ID matches the profile ID.

## 📊 Updated Code

I've also updated `AuthContext.tsx` to use a better approach:

### Before:
```typescript
// Manually insert profile (could fail with RLS)
await supabase.from('user_profiles').insert([...])
```

### After:
```typescript
// Use metadata - trigger creates profile automatically
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: fullName }
  }
})
```

## ✅ Summary

**Problem**: RLS policies were blocking profile creation
**Solution**: Created policies + auto-trigger
**Result**: Signup now works automatically

**Run the migration and you're done!** 🎉

---

## 🆘 Still Having Issues?

### Error: "relation 'user_profiles' does not exist"
**Fix**: Create the user_profiles table first
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Error: "permission denied for schema auth"
**Fix**: The trigger needs SECURITY DEFINER (already in migration)

### Verification Email Not Received
**Fix**: 
1. Check Supabase **Authentication** → **Email Templates**
2. Ensure "Confirm signup" is enabled
3. Check spam folder
4. For testing, you can disable email confirmation:
   - **Authentication** → **Settings** → **Email Auth**
   - Uncheck "Enable email confirmations"
