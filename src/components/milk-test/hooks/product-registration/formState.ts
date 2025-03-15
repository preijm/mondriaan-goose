
import { supabase } from "@/integrations/supabase/client";
import { FormSetters, ProductSubmitParams } from "../types";
import { addProductTypes } from "./productTypes";
import { addProductFlavors } from "./productFlavors";

/**
 * Resets all form fields to their initial state
 */
export const resetFormState = ({
  setBrandId,
  setProductName,
  setNameId,
  setSelectedProductTypes,
  setIsBarista,
  setSelectedFlavors,
  setIsSubmitting
}: FormSetters) => {
  setBrandId("");
  setProductName("");
  setNameId(null);
  setSelectedProductTypes([]);
  setIsBarista(false);
  setSelectedFlavors([]);
  setIsSubmitting(false);
};

/**
 * Handles the submission of a new product
 */
export const handleProductSubmit = async ({
  brandId,
  productName,
  nameId,
  selectedProductTypes,
  isBarista,
  selectedFlavors,
  toast,
  onSuccess,
  onOpenChange
}: ProductSubmitParams) => {
  let finalNameId = nameId;
  let newProductId = null;

  console.log('Starting product submission with:', { 
    brandId, 
    productName, 
    nameId, 
    selectedProductTypes, 
    isBarista, 
    selectedFlavors 
  });

  try {
    // 1. First handle the name_id resolution
    finalNameId = await resolveProductNameId(productName, finalNameId);
    
    // 2. Create a new product entry with is_barista flag set directly
    newProductId = await createNewProduct(brandId, finalNameId, isBarista);
    
    // 3. Add product types if selected
    if (selectedProductTypes.length > 0 && newProductId) {
      try {
        await addProductTypes(newProductId, selectedProductTypes, isBarista);
        console.log('Product types added successfully');
      } catch (error) {
        console.error('Failed to add product types:', error);
        // Continue with flavor addition even if types fail
      }
    }
    
    // 4. Add flavors if selected
    if (selectedFlavors.length > 0 && newProductId) {
      try {
        await addProductFlavors(newProductId, selectedFlavors);
        console.log('Product flavors added successfully');
      } catch (error) {
        console.error('Failed to add product flavors:', error);
        // Continue even if flavor addition fails
      }
    }
    
    console.log('Product registration complete for product ID:', newProductId);
    
    toast({
      title: "Product added",
      description: "New product added successfully!"
    });
    
    // Return success
    onSuccess(newProductId, brandId);
    onOpenChange(false);
  } catch (error) {
    console.error('Global error in product submission:', error);
    toast({
      title: "Error",
      description: "Failed to register product. Please try again.",
      variant: "destructive"
    });
  }
};

/**
 * Resolves the product name ID by either using an existing one or creating a new one
 */
const resolveProductNameId = async (productName: string, existingNameId: string | null): Promise<string> => {
  if (existingNameId) return existingNameId;
  
  // If we don't have a nameId, check if the name exists in the names table (case-insensitive)
  const { data: existingNames } = await supabase
    .from('names')
    .select('id')
    .ilike('name', productName.trim())
    .maybeSingle();
  
  if (existingNames) {
    console.log('Found existing name:', existingNames);
    return existingNames.id;
  } 
  
  // Create a new name if it doesn't exist
  const { data: newName, error: nameError } = await supabase
    .from('names')
    .insert({ name: productName.trim() })
    .select()
    .single();
  
  if (nameError) {
    console.error('Error adding product name:', nameError);
    throw nameError;
  }
  
  console.log('Created new name:', newName);
  return newName.id;
};

/**
 * Creates a new product in the database
 */
const createNewProduct = async (brandId: string, nameId: string, isBarista: boolean): Promise<string> => {
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
