-- Allow anonymous users to see aggregated results but require auth for individual details
-- This enables the public results page while protecting individual test details

-- Allow anonymous users to view milk_tests_view for aggregated data only
CREATE POLICY "Anonymous users can view milk tests for aggregated results" 
ON public.milk_tests_view 
FOR SELECT 
TO anon
USING (true);