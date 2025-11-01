-- COMPLETE FIX for infinite recursion in user_profiles RLS policies
-- This removes ALL problematic policies and functions, then creates simple ones

-- Step 1: Drop ALL existing policies on user_profiles
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_profiles';
    END LOOP;
END $$;

-- Step 2: Drop helper functions that cause recursion
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_super_admin();

-- Step 3: Disable RLS temporarily to add the role column
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Add role column if it doesn't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'customer';

-- Step 5: Add constraint if it doesn't exist
DO $$ 
BEGIN
    ALTER TABLE user_profiles
    ADD CONSTRAINT user_profiles_role_check 
    CHECK (role IN ('customer', 'admin', 'super_admin'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Step 6: Update your user to super_admin (REPLACE WITH YOUR USER ID)
UPDATE user_profiles
SET role = 'super_admin'
WHERE id = 'aa6492eb-5448-4b96-997f-2f5c2f5c9e7a';

-- Step 7: Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 8: Create SIMPLE, non-recursive policies

-- Anyone authenticated can view their own profile
CREATE POLICY "users_select_own"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Anyone authenticated can insert their own profile  
CREATE POLICY "users_insert_own"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Anyone authenticated can update their own profile
CREATE POLICY "users_update_own"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 9: Verify the setup
SELECT id, full_name, role FROM user_profiles;
