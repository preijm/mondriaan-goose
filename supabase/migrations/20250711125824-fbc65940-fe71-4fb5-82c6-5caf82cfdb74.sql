-- Add missing critical RLS policies for products, shops, and flavors tables

-- Products table - add missing UPDATE and DELETE policies
CREATE POLICY "Allow authenticated users to update products" 
ON products FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete products" 
ON products FOR DELETE 
TO authenticated 
USING (true);

-- Shops table - add missing UPDATE and DELETE policies  
CREATE POLICY "Allow authenticated users to update shops" 
ON shops FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete shops" 
ON shops FOR DELETE 
TO authenticated 
USING (true);

-- Flavors table - add missing UPDATE and DELETE policies
CREATE POLICY "Allow authenticated users to update flavors" 
ON flavors FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete flavors" 
ON flavors FOR DELETE 
TO authenticated 
USING (true);