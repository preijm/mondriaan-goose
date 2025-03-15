
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProductFlavors } from "./useProductFlavors";
import { useFormValidation } from "./formValidation";
import { 
  handleProductSubmit, 
  resetFormState 
} from "./product-registration";
import { UseProductRegistrationFormProps } from "./types";

export const useProductRegistrationForm = ({
  open,
  onOpenChange,
  onSuccess
}: UseProductRegistrationFormProps) => {
  // Form state
  const [brandId, setBrandId] = useState("");
  const [productName, setProductName] = useState("");
  const [nameId, setNameId] = useState<string | null>(null);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [isBarista, setIsBarista] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { validateForm } = useFormValidation();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      resetFormState({
        setBrandId,
        setProductName,
        setNameId,
        setSelectedProductTypes,
        setIsBarista,
        setSelectedFlavors,
        setIsSubmitting
      });
    }
  }, [open]);

  // Fetch product_flavors
  const { data: flavors = [] } = useProductFlavors();
  
  const handleFlavorToggle = (flavorKey: string) => {
    setSelectedFlavors(prev => 
      prev.includes(flavorKey) 
        ? prev.filter(key => key !== flavorKey) 
        : [...prev, flavorKey]
    );
  };

  const handleBaristaToggle = (checked: boolean) => {
    setIsBarista(checked);
  };
  
  const handleSubmit = async (e: React.FormEvent, skipAutoSuccess = false) => {
    e.preventDefault();
    
    console.log("Submitting form with:", {
      brandId,
      productName,
      brandIdEmpty: !brandId || brandId.trim() === '',
      productNameEmpty: !productName || productName.trim() === ''
    });
    
    // Only validate the required fields: brandId and productName
    if (!validateForm(brandId, productName)) {
      return null;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await handleProductSubmit({
        brandId,
        productName,
        nameId,
        selectedProductTypes,
        isBarista,
        selectedFlavors,
        toast,
        onSuccess: skipAutoSuccess ? () => {} : onSuccess,
        onOpenChange: skipAutoSuccess ? () => {} : onOpenChange
      });
      
      setIsSubmitting(false);
      return result;
    } catch (error) {
      console.error('Error adding product:', error);
      setIsSubmitting(false);
      return null;
    }
  };

  return {
    brandId,
    setBrandId,
    productName,
    setProductName,
    nameId,
    setNameId,
    selectedProductTypes,
    setSelectedProductTypes,
    isBarista,
    setIsBarista: handleBaristaToggle,
    selectedFlavors,
    handleFlavorToggle,
    isSubmitting,
    handleSubmit,
    flavors
  };
};
