-- Add comprehensive RLS policies for core tables

-- Brands table policies
CREATE POLICY "Allow authenticated users to insert brands" 
ON brands FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update brands" 
ON brands FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete brands" 
ON brands FOR DELETE 
TO authenticated 
USING (true);

-- Names table policies  
CREATE POLICY "Allow authenticated users to update names" 
ON names FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete names" 
ON names FOR DELETE 
TO authenticated 
USING (true);

-- Properties table policies
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

-- Countries table policies
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

-- Product flavors and properties policies updates
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