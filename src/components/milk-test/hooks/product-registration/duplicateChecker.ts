
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a product with the same attributes already exists
 * Returns the existing product ID if found, null otherwise
 */
export const checkProductExists = async (
  brandId: string,
  nameId: string,
  isBarista: boolean,
  selectedProductTypes: string[],
  selectedFlavors: string[]
): Promise<string | null> => {
  console.log('Checking if product exists with:', { 
    brandId, 
    nameId, 
    isBarista, 
    selectedProductTypes, 
    selectedFlavors 
  });
  
  try {
    // 1. Find products with the same brand and name
    const { data: existingProducts, error } = await supabase
      .from('products')
      .select('id, is_barista')
      .eq('brand_id', brandId)
      .eq('name_id', nameId);
    
    if (error) {
      console.error('Error checking for existing products:', error);
      throw error;
    }
    
    if (!existingProducts || existingProducts.length === 0) {
      console.log('No products found with the same brand and name');
      return null; // No products with same brand and name
    }
    
    // 2. For each matching product, check if properties and flavors match
    for (const product of existingProducts) {
      // Skip if barista status doesn't match
      if (product.is_barista !== isBarista) {
        console.log(`Product ${product.id} has different barista status, continuing...`);
        continue;
      }
      
      // Check product properties
      const { data: productProperties, error: propError } = await supabase
        .from('product_properties')
        .select('property_id')
        .eq('product_id', product.id);
      
      if (propError) {
        console.error('Error fetching product properties:', propError);
        continue;
      }
      
      // Get property keys for the existing product
      const { data: properties, error: propKeysError } = await supabase
        .from('properties')
        .select('key')
        .in('id', productProperties.map(p => p.property_id) || []);
      
      if (propKeysError) {
        console.error('Error fetching property keys:', propKeysError);
        continue;
      }
      
      const existingPropertyKeys = properties.map(p => p.key);
      
      // Check if property sets are different lengths
      if (existingPropertyKeys.length !== selectedProductTypes.length) {
        console.log(`Product ${product.id} has different number of properties, continuing...`);
        continue;
      }
      
      // Check if all selected properties exist in the product
      const propertiesMatch = selectedProductTypes.every(type => 
        existingPropertyKeys.includes(type)
      );
      
      if (!propertiesMatch) {
        console.log(`Product ${product.id} has different properties, continuing...`);
        continue;
      }
      
      // Check product flavors
      const { data: productFlavors, error: flavorError } = await supabase
        .from('product_flavors')
        .select('flavor_id')
        .eq('product_id', product.id);
      
      if (flavorError) {
        console.error('Error fetching product flavors:', flavorError);
        continue;
      }
      
      // Get flavor keys for the existing product
      const { data: flavors, error: flavorKeysError } = await supabase
        .from('flavors')
        .select('key')
        .in('id', productFlavors.map(f => f.flavor_id) || []);
      
      if (flavorKeysError) {
        console.error('Error fetching flavor keys:', flavorKeysError);
        continue;
      }
      
      const existingFlavorKeys = flavors.map(f => f.key);
      
      // Check if flavor sets are different lengths
      if (existingFlavorKeys.length !== selectedFlavors.length) {
        console.log(`Product ${product.id} has different number of flavors, continuing...`);
        continue;
      }
      
      // Check if all selected flavors exist in the product
      const flavorsMatch = selectedFlavors.every(flavor => 
        existingFlavorKeys.includes(flavor)
      );
      
      if (!flavorsMatch) {
        console.log(`Product ${product.id} has different flavors, continuing...`);
        continue;
      }
      
      // If we got here, we found a matching product
      console.log(`Found matching product: ${product.id}`);
      return product.id;
    }
    
    // No matching product found
    console.log('No matching product found after detailed comparison');
    return null;
    
  } catch (error) {
    console.error('Error checking for existing product:', error);
    return null; // Continue with product creation in case of error
  }
};
