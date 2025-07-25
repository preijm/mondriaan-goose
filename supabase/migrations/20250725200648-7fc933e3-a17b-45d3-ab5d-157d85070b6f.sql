-- Remove duplicate shops, keeping only unique shop names
-- First, let's create a temporary table with unique shop names
WITH unique_shops AS (
  SELECT DISTINCT 
    -- Remove country codes in parentheses from shop names
    CASE 
      WHEN name ~ '\s*\([A-Z]{2}\)\s*$' THEN 
        TRIM(REGEXP_REPLACE(name, '\s*\([A-Z]{2}\)\s*$', ''))
      ELSE name 
    END as clean_name,
    MIN(id) as keep_id
  FROM shops 
  WHERE name IS NOT NULL AND name != ''
  GROUP BY 
    CASE 
      WHEN name ~ '\s*\([A-Z]{2}\)\s*$' THEN 
        TRIM(REGEXP_REPLACE(name, '\s*\([A-Z]{2}\)\s*$', ''))
      ELSE name 
    END
)
-- Delete all shops except the ones we want to keep
DELETE FROM shops 
WHERE id NOT IN (SELECT keep_id FROM unique_shops);

-- Update the remaining shop names to remove country codes
UPDATE shops 
SET name = TRIM(REGEXP_REPLACE(name, '\s*\([A-Z]{2}\)\s*$', ''))
WHERE name ~ '\s*\([A-Z]{2}\)\s*$';

-- Also remove the country_code since we're not using it for shop identification
UPDATE shops SET country_code = NULL;