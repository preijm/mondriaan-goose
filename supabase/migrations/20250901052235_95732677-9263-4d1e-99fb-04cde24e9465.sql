-- Create security definer functions to access all milk test data
-- This enables authenticated users to see everyone's results

-- Function to get all milk tests (for social feed) - only for authenticated users
CREATE OR REPLACE FUNCTION public.get_all_milk_tests()
RETURNS TABLE (
    id uuid,
    user_id uuid,
    product_id uuid,
    rating numeric,
    notes text,
    shop_name text,
    country_code text,
    price_quality_ratio text,
    picture_path text,
    drink_preference text,
    created_at timestamp with time zone,
    brand_id uuid,
    brand_name text,
    product_name text,
    username text,
    is_barista boolean,
    property_names text[],
    flavor_names text[]
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT 
        mt.id,
        mt.user_id,
        mt.product_id,
        mt.rating,
        mt.notes,
        mt.shop_name,
        mt.country_code,
        mt.price_quality_ratio,
        mt.picture_path,
        mt.drink_preference,
        mt.created_at,
        b.id as brand_id,
        b.name as brand_name,
        n.name as product_name,
        p.username,
        prod.is_barista,
        COALESCE(
            ARRAY_AGG(DISTINCT prop.name) FILTER (WHERE prop.name IS NOT NULL),
            ARRAY[]::text[]
        ) as property_names,
        COALESCE(
            ARRAY_AGG(DISTINCT fl.name) FILTER (WHERE fl.name IS NOT NULL),
            ARRAY[]::text[]
        ) as flavor_names
    FROM public.milk_tests mt
    LEFT JOIN public.products prod ON mt.product_id = prod.id
    LEFT JOIN public.brands b ON prod.brand_id = b.id
    LEFT JOIN public.names n ON prod.name_id = n.id
    LEFT JOIN public.profiles p ON mt.user_id = p.id
    LEFT JOIN public.product_properties pp ON prod.id = pp.product_id
    LEFT JOIN public.properties prop ON pp.property_id = prop.id
    LEFT JOIN public.product_flavors pf ON prod.id = pf.product_id
    LEFT JOIN public.flavors fl ON pf.flavor_id = fl.id
    GROUP BY 
        mt.id, mt.user_id, mt.product_id, mt.rating, mt.notes, mt.shop_name, 
        mt.country_code, mt.price_quality_ratio, mt.picture_path, mt.drink_preference, 
        mt.created_at, b.id, b.name, n.name, p.username, prod.is_barista
    ORDER BY mt.created_at DESC;
$$;

-- Function to get aggregated milk test data (for public results page)
CREATE OR REPLACE FUNCTION public.get_aggregated_milk_tests()
RETURNS TABLE (
    product_id uuid,
    rating numeric,
    price_quality_ratio text,
    country_code text,
    drink_preference text,
    created_at timestamp with time zone,
    brand_name text,
    product_name text,
    is_barista boolean,
    property_names text[],
    flavor_names text[]
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT 
        mt.product_id,
        mt.rating,
        mt.price_quality_ratio,
        mt.country_code,
        mt.drink_preference,
        mt.created_at,
        b.name as brand_name,
        n.name as product_name,
        prod.is_barista,
        COALESCE(
            ARRAY_AGG(DISTINCT prop.name) FILTER (WHERE prop.name IS NOT NULL),
            ARRAY[]::text[]
        ) as property_names,
        COALESCE(
            ARRAY_AGG(DISTINCT fl.name) FILTER (WHERE fl.name IS NOT NULL),
            ARRAY[]::text[]
        ) as flavor_names
    FROM public.milk_tests mt
    LEFT JOIN public.products prod ON mt.product_id = prod.id
    LEFT JOIN public.brands b ON prod.brand_id = b.id
    LEFT JOIN public.names n ON prod.name_id = n.id
    LEFT JOIN public.product_properties pp ON prod.id = pp.product_id
    LEFT JOIN public.properties prop ON pp.property_id = prop.id
    LEFT JOIN public.product_flavors pf ON prod.id = pf.product_id
    LEFT JOIN public.flavors fl ON pf.flavor_id = fl.id
    GROUP BY 
        mt.product_id, mt.rating, mt.price_quality_ratio, mt.country_code, 
        mt.drink_preference, mt.created_at, b.name, n.name, prod.is_barista;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_all_milk_tests() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_aggregated_milk_tests() TO anon, authenticated;