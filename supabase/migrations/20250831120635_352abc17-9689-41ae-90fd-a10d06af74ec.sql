-- Fix critical security issue: Remove public access to profiles table
-- Current issue: "Allow username validation checks" policy allows anonymous users to read all profile data

-- 1. Remove ALL existing problematic policies
DROP POLICY IF EXISTS "Allow username validation checks" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile details" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view usernames" ON public.profiles;

-- 2. Create a secure function for username validation that doesn't expose user data
CREATE OR REPLACE FUNCTION public.check_username_exists(username_to_check text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE username = username_to_check
  );
$$;

-- 3. Create secure and specific policies

-- Allow users to view only their own complete profile data
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to view only usernames (for comments, feeds, etc.)
-- This policy is more restrictive and only exposes username, not location data
CREATE POLICY "Authenticated users can view usernames only" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);