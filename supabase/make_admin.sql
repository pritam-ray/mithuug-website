-- Make yourself a super admin
-- Run this in the Supabase SQL Editor AFTER running the admin system migration

-- First, find your user ID by checking your email
-- Replace 'your-email@example.com' with your actual email address

UPDATE user_profiles
SET role = 'super_admin'
WHERE email = 'your-email@example.com';

-- If you don't know your email, you can list all users:
-- SELECT id, email, full_name, role FROM user_profiles;

-- Or if you know your user ID directly:
-- UPDATE user_profiles SET role = 'super_admin' WHERE id = 'your-user-id-here';
