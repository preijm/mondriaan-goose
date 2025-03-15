
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds product types to a newly created product
 */
export const addProductTypes = async (
  productId: string, 
  selectedProductTypes: string[], 
  isBarista: boolean
): Promise<void> => {
  // Skip if there are no product types to add (but still need to update is_barista)
  if (selectedProductTypes.length === 0 && !isBarista) {
    return;
  }
  
  console.log('Adding product types and barista status:', { productId, selectedProductTypes, isBarista });
  
  try {
    // Update the product's is_barista field directly
    if (isBarista) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_barista: true })
        .eq('id', productId);
      
      if (updateError) {
        console.error('Error updating barista status:', updateError);
        throw updateError;
      }
    }
    
    // Skip property mapping if no selected types
    if (selectedProductTypes.length === 0) {
      return;
    }
    
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
    
    console.log('Product types and barista status added successfully');
  } catch (error) {
    console.error('Failed to add product types or update barista status:', error);
    throw error;
  }
};
