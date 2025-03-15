
import { useToast } from "@/hooks/use-toast";

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (brandId: string, productName: string): boolean => {
    if (!brandId) {
      toast({
        title: "Missing brand",
        description: "Please select a brand for this product",
        variant: "destructive"
      });
      return false;
    }
    
    if (!productName) {
      toast({
        title: "Missing product",
        description: "Please enter a name for this product",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  return { validateForm };
};
