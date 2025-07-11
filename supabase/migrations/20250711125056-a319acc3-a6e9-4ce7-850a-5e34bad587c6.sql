-- Add missing RLS policies for core tables (avoiding duplicates)

-- Brands table policies (only missing ones)
CREATE POLICY "Allow authenticated users to update brands" 
ON brands FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete brands" 
ON brands FOR DELETE 
TO authenticated 
USING (true);

-- Names table policies (only missing ones)
CREATE POLICY "Allow authenticated users to update names" 
ON names FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete names" 
ON names FOR DELETE 
TO authenticated 
USING (true);

-- Properties table policies (all missing)
CREATE POLICY "Allow authenticated users to insert properties" 
ON properties FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update properties" 
ON properties FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete properties" 
ON properties FOR DELETE 
TO authenticated 
USING (true);

-- Countries table policies (all missing)
CREATE POLICY "Allow authenticated users to insert countries" 
ON countries FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update countries" 
ON countries FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete countries" 
ON countries FOR DELETE 
TO authenticated 
USING (true);

-- Product flavors and properties policies updates (missing ones)
CREATE POLICY "Allow authenticated users to update product_flavors" 
ON product_flavors FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete product_flavors" 
ON product_flavors FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to update product_properties" 
ON product_properties FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete product_properties" 
ON product_properties FOR DELETE 
TO authenticated 
USING (true);