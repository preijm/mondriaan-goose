-- Add separate country_code and shop_name columns to milk_tests table
ALTER TABLE public.milk_tests 
ADD COLUMN country_code text,
ADD COLUMN shop_name text;

-- Migrate existing data from shop_id to new columns (only for records with valid shop_id)
UPDATE public.milk_tests 
SET 
  country_code = shops.country_code,
  shop_name = shops.name
FROM public.shops 
WHERE milk_tests.shop_id = shops.id;

-- Drop and recreate the milk_tests_view to use new columns instead of shop_id
DROP VIEW IF EXISTS public.milk_tests_view;

CREATE VIEW public.milk_tests_view AS
SELECT 
  mt.id,
  mt.user_id,
  mt.product_id,
  mt.rating,
  mt.notes,
  mt.created_at,
  mt.drink_preference,
  mt.price_quality_ratio,
  mt.picture_path,
  mt.country_code,
  mt.shop_name,
  p.brand_id,
  p.is_barista,
  b.name as brand_name,
  n.name as product_name,
  pr.username,
  ARRAY(
    SELECT f.name 
    FROM product_flavors pf 
    JOIN flavors f ON pf.flavor_id = f.id 
    WHERE pf.product_id = p.id
  ) as flavor_names,
  ARRAY(
    SELECT prop.name 
    FROM product_properties pp 
    JOIN properties prop ON pp.property_id = prop.id 
    WHERE pp.product_id = p.id
  ) as property_names
FROM milk_tests mt
LEFT JOIN products p ON mt.product_id = p.id
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN names n ON p.name_id = n.id
LEFT JOIN profiles pr ON mt.user_id = pr.id;

-- Create index for better performance on country lookups
CREATE INDEX idx_milk_tests_country_code ON public.milk_tests(country_code);

-- Create index for shop name searches
CREATE INDEX idx_milk_tests_shop_name ON public.milk_tests(shop_name);

-- Now drop the old shop_id column
ALTER TABLE public.milk_tests DROP COLUMN shop_id;