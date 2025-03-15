
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
  // First check if product already exists with this brand and name_id
  let finalNameId = nameId;

  try {
    // If name doesn't exist yet, create it
    if (!finalNameId) {
      const { data: newName, error: nameError } = await supabase
        .from('names')
        .insert({ name: productName.trim() })
        .select()
        .single();
      
      if (nameError) {
        console.error('Error adding product name:', nameError);
        return; // Exit early without showing an error toast
      }
      
      finalNameId = newName.id;
    }

    // Once we have a name_id, check if the product exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('name_id', finalNameId)
      .eq('brand_id', brandId)
      .maybeSingle();

    // If product exists, select it instead of showing an error
    if (existingProduct) {
      toast({
        title: "Product exists",
        description: "This product already exists and has been selected"
      });
      onSuccess(existingProduct.id, brandId);
      onOpenChange(false);
      return;
    }

    // Create the new product - improved error handling
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
      return; // Exit early without showing an error toast
    }
    
    console.log('New product created:', newProduct);
    
    // Sequentially add product types and flavors to ensure they complete
    let typesAdded = false;
    let flavorsAdded = false;

    // Add product types if selected
    if (selectedProductTypes.length > 0 || isBarista) {
      try {
        await addProductTypes(newProduct.id, selectedProductTypes, isBarista);
        typesAdded = true;
        console.log('Product types added successfully');
      } catch (error) {
        console.error('Failed to add product types:', error);
        // Continue with flavor addition even if types fail
      }
    } else {
      typesAdded = true; // No types to add, so mark as successful
    }
    
    // Add flavors if selected
    if (selectedFlavors.length > 0) {
      try {
        await addProductFlavors(newProduct.id, selectedFlavors);
        flavorsAdded = true;
        console.log('Product flavors added successfully');
      } catch (error) {
        console.error('Failed to add product flavors:', error);
        // Continue even if flavor addition fails
      }
    } else {
      flavorsAdded = true; // No flavors to add, so mark as successful
    }
    
    // Log the overall success status
    console.log('Product registration complete. Types added:', typesAdded, 'Flavors added:', flavorsAdded);
    
    toast({
      title: "Product added",
      description: "New product added successfully!"
    });
    
    // Return success even if some components failed
    onSuccess(newProduct.id, brandId);
    onOpenChange(false);
  } catch (error) {
    console.error('Global error in product submission:', error);
    // Don't show any error toast, just log it
  }
};

// Helper function to add product types
const addProductTypes = async (
  productId: string, 
  selectedTypes: string[], 
  isBarista: boolean
) => {
  if (selectedTypes.length === 0 && !isBarista) return;
  
  try {
    const finalProductTypes = isBarista 
      ? [...selectedTypes, "barista"] 
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
  } catch (error) {
    console.error('Error in addProductTypes:', error);
    throw error;
  }
};

// Helper function to add product flavors
const addProductFlavors = async (productId: string, selectedFlavors: string[]) => {
  if (selectedFlavors.length === 0) return;
  
  try {
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
  } catch (error) {
    console.error('Error in addProductFlavors:', error);
    throw error;
  }
};
