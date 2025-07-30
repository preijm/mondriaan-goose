-- Fix RLS policy for profiles table to allow anonymous users to count profiles
-- Drop the existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a single clear policy that allows anyone to view profiles (needed for member count)
CREATE POLICY "Public profiles viewable by all" 
ON public.profiles 
FOR SELECT 
USING (true);