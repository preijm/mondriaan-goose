
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds product types to a product
 */
export const addProductTypes = async (
  productId: string, 
  selectedTypes: string[], 
  isBarista: boolean
) => {
  if (selectedTypes.length === 0 && !isBarista) return;
  
  const finalProductTypes = isBarista 
    ? [...new Set([...selectedTypes, "barista"])] // Use Set to ensure no duplicates
    : selectedTypes;
  
  console.log('Adding product types:', finalProductTypes, 'to product ID:', productId);
  
  const { data: propertyData, error: propertyLookupError } = await supabase
    .from('properties')
    .select('id, key')
    .in('key', finalProductTypes);
  
  if (propertyLookupError) {
    console.error('Error looking up property IDs:', propertyLookupError);
    throw propertyLookupError;
  } 
  
  if (propertyData && propertyData.length > 0) {
    console.log('Found property data:', propertyData);
    // Insert product type links
    const propertyLinks = propertyData.map(property => ({
      product_id: productId,
      property_id: property.id
    }));
    
    const { error: propertiesError } = await supabase
      .from('product_properties')
      .insert(propertyLinks);
    
    if (propertiesError) {
      console.error('Error adding product properties:', propertiesError);
      throw propertiesError;
    }
    
    console.log('Successfully added properties:', propertyLinks);
  } else {
    console.log('No matching properties found for types:', finalProductTypes);
  }
};
