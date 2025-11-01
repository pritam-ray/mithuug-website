-- Fix RLS policies that cause infinite recursion
-- Run this to fix the "infinite recursion detected in policy" error

-- First, drop all existing policies on user_profiles that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- Create simple, non-recursive policies

-- 1. Users can view their own profile (no recursion)
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Users can update their own profile (no recursion)
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 3. Allow INSERT for new user profiles
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- That's it! No admin-specific policies to avoid recursion
-- Admins can still access via service role or by being the user themselves

-- Now verify the role column exists and set your role
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'customer' 
CHECK (role IN ('customer', 'admin', 'super_admin'));

-- Update your user to super_admin (replace with your actual user ID)
UPDATE user_profiles
SET role = 'super_admin'
WHERE id = 'aa6492eb-5448-4b96-997f-2f5c2f5c9e7a';

-- Verify
SELECT id, full_name, role FROM user_profiles;
