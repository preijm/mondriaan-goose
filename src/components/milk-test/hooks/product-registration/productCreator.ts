
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a new product in the database
 */
export const createNewProduct = async (brandId: string, nameId: string, isBarista: boolean): Promise<string> => {
  console.log('Creating new product with:', { brandId, nameId, isBarista });
  
  const { data: newProduct, error: productError } = await supabase
    .from('products')
    .insert({
      brand_id: brandId,
      name_id: nameId,
      is_barista: isBarista
    })
    .select()
    .single();
  
  if (productError) {
    console.error('Error adding product:', productError);
    throw productError;
  }
  
  console.log('New product created:', newProduct);
  return newProduct.id;
};
