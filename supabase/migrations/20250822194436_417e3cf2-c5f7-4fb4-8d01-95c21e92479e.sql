-- Ensure anonymous users can access count statistics for public metrics
-- Allow anonymous users to perform count queries on milk_tests for homepage statistics
CREATE POLICY "Anonymous users can count milk tests for public stats" 
ON public.milk_tests 
FOR SELECT 
TO anon
USING (true);

-- Allow anonymous users to count profiles for member statistics  
CREATE POLICY "Anonymous users can count profiles for public stats"
ON public.profiles
FOR SELECT
TO anon  
USING (true);

-- Allow anonymous users to count brands for brand statistics
CREATE POLICY "Anonymous users can count brands for public stats"
ON public.brands
FOR SELECT
TO anon
USING (true);