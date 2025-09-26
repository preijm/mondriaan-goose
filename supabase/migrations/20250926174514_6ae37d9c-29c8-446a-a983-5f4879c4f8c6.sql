-- Allow all users (including unauthenticated) to add flavors
DROP POLICY IF EXISTS "Authenticated users can add flavors" ON public.flavors;

CREATE POLICY "All users can add flavors" 
ON public.flavors 
FOR INSERT 
WITH CHECK (true);