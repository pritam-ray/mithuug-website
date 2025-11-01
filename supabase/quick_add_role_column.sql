-- Quick script to add role column if it doesn't exist
-- Run this FIRST before running the full admin migration

-- Add role column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'customer' 
CHECK (role IN ('customer', 'admin', 'super_admin'));

-- Add index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Now make your user a super admin
-- Replace the ID with your actual user ID from the user_profiles table
UPDATE user_profiles
SET role = 'super_admin'
WHERE id = 'aa6492eb-5448-4b96-997f-2f5c2f5c9e7a';

-- Verify it worked
SELECT id, full_name, role FROM user_profiles WHERE role = 'super_admin';
