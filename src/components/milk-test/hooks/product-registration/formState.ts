
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
 * Checks if a product with the same attributes already exists
 */
const checkProductExists = async (
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
    
    // 2. Check if a product with these attributes already exists
    const existingProductId = await checkProductExists(
      brandId, 
      finalNameId, 
      isBarista, 
      selectedProductTypes, 
      selectedFlavors
    );
    
    if (existingProductId) {
      console.log('Product already exists, using existing product ID:', existingProductId);
      toast({
        title: "Product exists",
        description: "This product already exists in the database!"
      });
      
      // Return success with the existing product ID
      onSuccess(existingProductId, brandId);
      onOpenChange(false);
      return;
    }
    
    // 3. Create a new product entry with is_barista flag set directly
    newProductId = await createNewProduct(brandId, finalNameId, isBarista);
    
    // 4. Add product types if selected
    if (selectedProductTypes.length > 0 && newProductId) {
      try {
        await addProductTypes(newProductId, selectedProductTypes, isBarista);
        console.log('Product types added successfully');
      } catch (error) {
        console.error('Failed to add product types:', error);
        // Continue with flavor addition even if types fail
      }
    }
    
    // 5. Add flavors if selected
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
