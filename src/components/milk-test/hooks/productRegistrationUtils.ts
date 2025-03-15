
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

    // 2. Check if a product with the exact same brand_id and name_id already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id, brand_id, name_id')
      .eq('name_id', finalNameId)
      .eq('brand_id', brandId)
      .maybeSingle();

    if (existingProduct) {
      console.log('Found existing product with same brand and name:', existingProduct);
      
      // 3. If product exists, check if it has the exact same properties and flavors
      const { data: existingProductProperties } = await supabase
        .from('product_properties')
        .select('property_id')
        .eq('product_id', existingProduct.id);
      
      const { data: existingProductFlavors } = await supabase
        .from('product_flavors')
        .select('flavor_id')
        .eq('product_id', existingProduct.id);
      
      // Get IDs for selected product types
      const { data: propertyData } = await supabase
        .from('properties')
        .select('id, key')
        .in('key', [...selectedProductTypes, ...(isBarista ? ['barista'] : [])]);
      
      // Get IDs for selected flavors
      const { data: flavorData } = await supabase
        .from('flavors')
        .select('id, key')
        .in('key', selectedFlavors);
      
      // Convert to arrays of ids for comparison
      const existingPropertyIds = (existingProductProperties || []).map(p => p.property_id).sort();
      const existingFlavorIds = (existingProductFlavors || []).map(f => f.flavor_id).sort();
      
      const newPropertyIds = (propertyData || []).map(p => p.id).sort();
      const newFlavorIds = (flavorData || []).map(f => f.id).sort();
      
      // Compare arrays to check if they have the same values
      const propertiesMatch = JSON.stringify(existingPropertyIds) === JSON.stringify(newPropertyIds);
      const flavorsMatch = JSON.stringify(existingFlavorIds) === JSON.stringify(newFlavorIds);
      
      console.log('Properties match:', propertiesMatch);
      console.log('Flavors match:', flavorsMatch);
      
      if (propertiesMatch && flavorsMatch) {
        // This is a true duplicate - same brand, name, properties and flavors
        toast({
          title: "Duplicate Product",
          description: "This exact product already exists with the same brand, name, properties and flavors.",
          variant: "destructive"
        });
        return;
      }
      
      // Not a true duplicate, just the same brand and name but different properties/flavors
      newProductId = existingProduct.id;
      console.log('Using existing product ID but updating properties/flavors:', newProductId);
      
      // Remove existing properties and flavors to replace with new ones
      if (!propertiesMatch) {
        await supabase
          .from('product_properties')
          .delete()
          .eq('product_id', newProductId);
      }
      
      if (!flavorsMatch) {
        await supabase
          .from('product_flavors')
          .delete()
          .eq('product_id', newProductId);
      }
      
    } else {
      // Product doesn't exist with this brand and name, create a new one
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
      
      toast({
        title: "Product added",
        description: "New product added successfully!"
      });
    }
    
    if (!newProductId) {
      throw new Error('Failed to create or find product');
    }
    
    // 4. Add product types if selected
    if ((selectedProductTypes.length > 0 || isBarista) && newProductId) {
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
