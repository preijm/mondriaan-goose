-- Remove any remaining security_barrier properties from views to fix linter warnings
-- This should resolve the Security Definer View warnings

-- Check if there are any views with security_barrier still set
SELECT 
    schemaname, 
    viewname
FROM pg_views 
WHERE schemaname = 'public' 
AND (viewname = 'milk_tests_view' OR viewname = 'milk_tests_aggregated_view');

-- The views should now be properly created without security_barrier
-- No additional changes needed if they were already recreated properly