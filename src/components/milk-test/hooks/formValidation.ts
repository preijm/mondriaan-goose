
import { useToast } from "@/hooks/use-toast";

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (brandId: string, productName: string): boolean => {
    // Create a list of missing fields
    const missingFields = [];
    
    if (!brandId || brandId.trim() === '') {
      missingFields.push("brand");
    }
    
    if (!productName || productName.trim() === '') {
      missingFields.push("product name");
    }
    
    // If there are missing fields, show one toast with all missing fields
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please enter: ${missingFields.join(" and ")}`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  return { validateForm };
};
