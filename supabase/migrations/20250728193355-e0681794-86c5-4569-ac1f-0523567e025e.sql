-- Ensure all authenticated users can add brands, products, flavors, and shops
-- First, let's drop any conflicting admin-only INSERT policies and recreate them properly

-- Update brands policies to allow all authenticated users to insert
DROP POLICY IF EXISTS "Admins can insert brands" ON public.brands;

-- Ensure the authenticated users policy exists for brands
DROP POLICY IF EXISTS "Authenticated users can add brands" ON public.brands;
CREATE POLICY "Authenticated users can add brands" 
ON public.brands 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure flavors policy allows authenticated users
DROP POLICY IF EXISTS "Authenticated users can add flavors" ON public.flavors;
CREATE POLICY "Authenticated users can add flavors" 
ON public.flavors 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure products policy allows authenticated users  
DROP POLICY IF EXISTS "Authenticated users can register products" ON public.products;
CREATE POLICY "Authenticated users can register products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure shops policy allows authenticated users
DROP POLICY IF EXISTS "Authenticated users can add shops" ON public.shops;
CREATE POLICY "Authenticated users can add shops" 
ON public.shops 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Also allow authenticated users to add product properties and flavors
DROP POLICY IF EXISTS "Authenticated users can add product properties" ON public.product_properties;
CREATE POLICY "Authenticated users can add product properties" 
ON public.product_properties 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can add product flavors" ON public.product_flavors;
CREATE POLICY "Authenticated users can add product flavors" 
ON public.product_flavors 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to add names (for product names)
DROP POLICY IF EXISTS "Allow authenticated users to insert names" ON public.names;
CREATE POLICY "Allow authenticated users to insert names" 
ON public.names 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);