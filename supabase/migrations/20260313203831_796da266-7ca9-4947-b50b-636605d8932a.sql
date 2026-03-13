
-- Drop and recreate milk_tests_view with security_invoker and correct column order
DROP VIEW IF EXISTS public.milk_tests_view;

CREATE VIEW public.milk_tests_view WITH (security_invoker = true) AS
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
    mt.created_at, b.id, b.name, n.name, p.username, prod.is_barista;
