
import { supabase } from "@/integrations/supabase/client";
import { FormSetters, ProductSubmitParams } from "./types";

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
    if (!finalNameId) {
      // If we don't have a nameId, check if the name exists in the names table (case-insensitive)
      const { data: existingNames } = await supabase
        .from('names')
        .select('id')
        .ilike('name', productName.trim())
        .maybeSingle();
      
      if (existingNames) {
        finalNameId = existingNames.id;
        console.log('Found existing name:', existingNames);
      } else {
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
        
        finalNameId = newName.id;
        console.log('Created new name:', newName);
      }
    }

    // 2. Always create a new product entry, regardless of existing products with the same name and brand
    console.log('Creating new product with:', { brandId, nameId: finalNameId });
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({
        brand_id: brandId,
        name_id: finalNameId
      })
      .select()
      .single();
    
    if (productError) {
      console.error('Error adding product:', productError);
      throw productError;
    }
    
    console.log('New product created:', newProduct);
    newProductId = newProduct.id;
    
    // 3. Add product types if selected
    if ((selectedProductTypes.length > 0 || isBarista) && newProductId) {
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

// Helper function to add product types
const addProductTypes = async (
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

// Helper function to add product flavors
const addProductFlavors = async (productId: string, selectedFlavors: string[]) => {
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
