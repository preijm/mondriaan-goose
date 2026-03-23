CREATE OR REPLACE VIEW public.milk_tests_private_view
WITH (security_invoker=on) AS
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
  b.id AS brand_id,
  b.name AS brand_name,
  n.name AS product_name,
  pp.username,
  prod.is_barista,
  COALESCE(
    ARRAY_AGG(DISTINCT prop.name) FILTER (WHERE prop.name IS NOT NULL),
    ARRAY[]::text[]
  ) AS property_names,
  COALESCE(
    ARRAY_AGG(DISTINCT fl.name) FILTER (WHERE fl.name IS NOT NULL),
    ARRAY[]::text[]
  ) AS flavor_names
FROM public.milk_tests mt
LEFT JOIN public.products prod ON mt.product_id = prod.id
LEFT JOIN public.brands b ON prod.brand_id = b.id
LEFT JOIN public.names n ON prod.name_id = n.id
LEFT JOIN public.profiles_public pp ON mt.user_id = pp.id
LEFT JOIN public.product_properties pprop ON prod.id = pprop.product_id
LEFT JOIN public.properties prop ON pprop.property_id = prop.id
LEFT JOIN public.product_flavors pf ON prod.id = pf.product_id
LEFT JOIN public.flavors fl ON pf.flavor_id = fl.id
GROUP BY
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
  b.id,
  b.name,
  n.name,
  pp.username,
  prod.is_barista;

DROP VIEW IF EXISTS public.milk_tests_view;

CREATE VIEW public.milk_tests_view
WITH (security_invoker=on) AS
SELECT
  mt.id,
  mt.product_id,
  mt.rating,
  mt.country_code,
  mt.price_quality_ratio,
  mt.drink_preference,
  mt.created_at,
  b.id AS brand_id,
  b.name AS brand_name,
  n.name AS product_name,
  prod.is_barista,
  COALESCE(
    ARRAY_AGG(DISTINCT prop.name) FILTER (WHERE prop.name IS NOT NULL),
    ARRAY[]::text[]
  ) AS property_names,
  COALESCE(
    ARRAY_AGG(DISTINCT fl.name) FILTER (WHERE fl.name IS NOT NULL),
    ARRAY[]::text[]
  ) AS flavor_names
FROM public.milk_tests mt
LEFT JOIN public.products prod ON mt.product_id = prod.id
LEFT JOIN public.brands b ON prod.brand_id = b.id
LEFT JOIN public.names n ON prod.name_id = n.id
LEFT JOIN public.product_properties pprop ON prod.id = pprop.product_id
LEFT JOIN public.properties prop ON pprop.property_id = prop.id
LEFT JOIN public.product_flavors pf ON prod.id = pf.product_id
LEFT JOIN public.flavors fl ON pf.flavor_id = fl.id
GROUP BY
  mt.id,
  mt.product_id,
  mt.rating,
  mt.country_code,
  mt.price_quality_ratio,
  mt.drink_preference,
  mt.created_at,
  b.id,
  b.name,
  n.name,
  prod.is_barista;

REVOKE ALL ON TABLE public.milk_tests_private_view FROM PUBLIC;
REVOKE ALL ON TABLE public.milk_tests_private_view FROM anon;
GRANT SELECT ON TABLE public.milk_tests_private_view TO authenticated;

REVOKE ALL ON TABLE public.milk_tests_view FROM PUBLIC;
GRANT SELECT ON TABLE public.milk_tests_view TO anon, authenticated;