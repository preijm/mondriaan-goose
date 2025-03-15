
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds product types to a newly created product
 */
export const addProductTypes = async (
  productId: string, 
  selectedProductTypes: string[], 
  isBarista: boolean
): Promise<void> => {
  // Skip if there are no product types to add and it's not a barista product
  if (selectedProductTypes.length === 0 && !isBarista) {
    return;
  }
  
  console.log('Adding product types:', { productId, selectedProductTypes, isBarista });
  
  try {
    // 1. Fetch property IDs for the selected types
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id, key')
      .in('key', selectedProductTypes);
    
    if (propError) {
      console.error('Error fetching property IDs:', propError);
      throw propError;
    }
    
    // 2. Create array of property ID mappings
    const propertyMappings = properties.map(prop => ({
      product_id: productId,
      property_id: prop.id
    }));
    
    // 3. Insert the mappings into product_properties table
    if (propertyMappings.length > 0) {
      const { error: insertError } = await supabase
        .from('product_properties')
        .insert(propertyMappings);
      
      if (insertError) {
        console.error('Error inserting product properties:', insertError);
        throw insertError;
      }
    }
    
    console.log('Product types added successfully');
  } catch (error) {
    console.error('Failed to add product types:', error);
    throw error;
  }
};
