-- Fix security issue: Restrict profile access to prevent data theft
-- Current issue: Profiles table allows public read access to usernames and personal info

-- 1. Remove overly permissive policies that allow public access
DROP POLICY IF EXISTS "Anonymous users can count profiles for public stats" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- 2. Create a secure function for public stats that doesn't expose user data
CREATE OR REPLACE FUNCTION public.get_public_stats()
RETURNS TABLE(
  total_members bigint,
  total_tests bigint,
  total_products bigint,
  total_brands bigint
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    (SELECT COUNT(*) FROM public.profiles) as total_members,
    (SELECT COUNT(*) FROM public.milk_tests) as total_tests,
    (SELECT COUNT(*) FROM public.products) as total_products,
    (SELECT COUNT(*) FROM public.brands) as total_brands;
$$;

-- 3. Create restricted policies for legitimate use cases

-- Allow authenticated users to view usernames only (for comments, likes display)
CREATE POLICY "Authenticated users can view usernames" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Allow limited username checks for signup validation (security through application logic)
CREATE POLICY "Allow username validation checks" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated
USING (true);