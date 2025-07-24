-- Phase 1: Critical Database Security Fixes

-- 1. Fix milk_tests user_id constraint - make it NOT NULL
-- First update any NULL user_id records to a default value (this shouldn't happen with proper RLS)
UPDATE milk_tests SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;

-- Now make user_id NOT NULL
ALTER TABLE milk_tests ALTER COLUMN user_id SET NOT NULL;

-- Add check constraint to ensure user_id is always set during inserts
ALTER TABLE milk_tests ADD CONSTRAINT milk_tests_user_id_not_null_check CHECK (user_id IS NOT NULL);

-- 2. Fix database function security issues
-- Fix search_path for security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT public.has_role(auth.uid(), 'admin')
$function$;

CREATE OR REPLACE FUNCTION public.search_product_types(search_term text)
RETURNS TABLE(id uuid, brand_id uuid, brand_name text, product_name text, property_names text[], flavor_names text[], product_name_id uuid, is_barista boolean)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    psv.id,
    psv.brand_id,
    psv.brand_name,
    psv.product_name,
    psv.property_names,
    psv.flavor_names,
    psv.product_name_id,
    psv.is_barista
  FROM public.product_search_view psv
  WHERE 
    psv.brand_name ILIKE '%' || search_term || '%' OR
    psv.product_name ILIKE '%' || search_term || '%' OR
    EXISTS (
      SELECT 1
      FROM unnest(psv.property_names) AS property_name
      WHERE property_name ILIKE '%' || search_term || '%'
    ) OR
    EXISTS (
      SELECT 1
      FROM unnest(psv.flavor_names) AS flavor_name
      WHERE flavor_name ILIKE '%' || search_term || '%'
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Assign default 'user' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'username',
      'user_' || substr(gen_random_uuid()::text, 1, 8)
    )
  );
  RETURN new;
END;
$function$;

-- 3. Add input validation functions for server-side validation
CREATE OR REPLACE FUNCTION public.validate_milk_test_input(
  rating_val numeric,
  notes_val text,
  shop_name_val text,
  country_code_val text
) RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate rating is between 0 and 10
  IF rating_val < 0 OR rating_val > 10 THEN
    RETURN false;
  END IF;
  
  -- Validate notes length (max 1000 characters)
  IF notes_val IS NOT NULL AND length(notes_val) > 1000 THEN
    RETURN false;
  END IF;
  
  -- Validate shop name length (max 255 characters)
  IF shop_name_val IS NOT NULL AND length(shop_name_val) > 255 THEN
    RETURN false;
  END IF;
  
  -- Validate country code format (2 letter code)
  IF country_code_val IS NOT NULL AND (length(country_code_val) != 2 OR country_code_val !~ '^[A-Z]{2}$') THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

-- 4. Add security logging table for monitoring
CREATE TABLE IF NOT EXISTS public.security_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  event_type text NOT NULL,
  event_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security log
ALTER TABLE public.security_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view security logs
CREATE POLICY "Admins can view security logs" ON public.security_log
  FOR SELECT USING (is_admin());

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type_val text,
  event_data_val jsonb DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.security_log (user_id, event_type, event_data)
  VALUES (auth.uid(), event_type_val, event_data_val);
END;
$function$;