-- Run this SQL in your Supabase SQL Editor to update the defaults and fix existing users

-- 1. Update the default value for future rows
ALTER TABLE profiles 
ALTER COLUMN currency_preference SET DEFAULT '₹';

-- 2. Update existing rows that are set to 'USD' (assuming they want INR as per request)
-- If you want to be safer, only update if they haven't explicitly chosen USD, 
-- but since we can't distinguish default vs explicit, and the user said "it should be INR by default",
-- we will update all 'USD' to '₹'.
UPDATE profiles
SET currency_preference = '₹'
WHERE currency_preference = 'USD';

