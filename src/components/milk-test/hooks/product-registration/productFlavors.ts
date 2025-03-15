
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds flavors to a product
 */
export const addProductFlavors = async (productId: string, selectedFlavors: string[]) => {
  if (selectedFlavors.length === 0) return;
  
  console.log('Adding flavors:', selectedFlavors, 'to product ID:', productId);
  
  // Get the flavor IDs from their keys
  const { data: flavorData, error: flavorLookupError } = await supabase
    .from('flavors')
    .select('id, key')
    .in('key', selectedFlavors);
  
  if (flavorLookupError) {
    console.error('Error looking up flavor IDs:', flavorLookupError);
    throw flavorLookupError;
  } 
  
  if (flavorData && flavorData.length > 0) {
    console.log('Found flavor data:', flavorData);
    const flavorLinks = flavorData.map(flavor => ({
      product_id: productId,
      flavor_id: flavor.id
    }));
    
    const { error: flavorError } = await supabase
      .from('product_flavors')
      .insert(flavorLinks);
    
    if (flavorError) {
      console.error('Error adding flavors:', flavorError);
      throw flavorError;
    }
    
    console.log('Successfully added flavors:', flavorLinks);
  } else {
    console.log('No matching flavors found for keys:', selectedFlavors);
  }
};
