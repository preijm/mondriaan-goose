-- Fix security linter issues

-- 1. Fix function search path issue for get_public_stats
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
SET search_path = public
AS $$
  SELECT 
    (SELECT COUNT(*) FROM public.profiles) as total_members,
    (SELECT COUNT(*) FROM public.milk_tests) as total_tests,
    (SELECT COUNT(*) FROM public.products) as total_products,
    (SELECT COUNT(*) FROM public.brands) as total_brands;
$$;