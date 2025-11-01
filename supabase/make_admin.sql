-- Make yourself a super admin
-- Run this in the Supabase SQL Editor AFTER running the admin system migration

-- Method 1: Update by user ID (from the table editor)
-- Copy your user ID from the user_profiles table and paste it below
UPDATE user_profiles
SET role = 'super_admin'
WHERE id = 'aa6492eb-5448-4b96-997f-2f5c2f5c9e7a';  -- Replace with YOUR actual user ID

-- Method 2: If you want to see all users first
-- Uncomment and run this query to see all users with their auth email:
/*
SELECT 
  up.id, 
  up.full_name, 
  up.role,
  au.email
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id;
*/

-- Method 3: Update by matching against auth.users email
-- Replace 'mitthuug@gmail.com' with your actual email
/*
UPDATE user_profiles
SET role = 'super_admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'mitthuug@gmail.com'
);
*/
