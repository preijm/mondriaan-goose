
import { FormSetters, ProductSubmitParams, ProductSubmitResult } from "../types";
import { addProductTypes } from "./productTypes";
import { addProductFlavors } from "./productFlavors";
import { resolveProductNameId } from "./nameResolver";
import { createNewProduct } from "./productCreator";
import { checkProductExists } from "./duplicateChecker";

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
 * Returns a promise with the existing product ID if found or the new product ID
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
}: ProductSubmitParams): Promise<ProductSubmitResult> => {
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
      return { productId: existingProductId, isDuplicate: true };
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
    return { productId: newProductId, isDuplicate: false };
    
  } catch (error) {
    console.error('Global error in product submission:', error);
    toast({
      title: "Error",
      description: "Failed to register product. Please try again.",
      variant: "destructive"
    });
    return { productId: null, isDuplicate: false };
  }
};
