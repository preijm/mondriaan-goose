
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductRegistrationHeader } from "../ProductRegistrationHeader";
import { DialogDescription } from "@/components/ui/dialog";
import { 
  ProductRegistrationProvider,
  useProductRegistration
} from "./ProductRegistrationContext";
import { ProductForm } from "./FormSections";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface ProductRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (productId: string, brandId: string) => void;
}

// Container component that handles the form submission logic
const ProductRegistrationContainer: React.FC<ProductRegistrationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const {
    brandId,
    productName,
    originalHandleSubmit,
    setIsSubmitting,
    isSubmitting,
    toast
  } = useProductRegistration();
  
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateProductId, setDuplicateProductId] = useState<string | null>(null);
  
  // Handle dialog close to ensure isSubmitting is reset
  const handleOpenChange = (newOpen: boolean) => {
    console.log("handleOpenChange called with:", newOpen, "current isSubmitting:", isSubmitting);
    
    if (!newOpen) {
      // Reset the isSubmitting state when the dialog is closed
      setIsSubmitting(false);
      console.log("Dialog closed, isSubmitting set to false");
    }
    onOpenChange(newOpen);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the event from bubbling up to parent forms
    
    console.log("Product Registration Form - validating fields:", {
      brandId, 
      productName
    });
    
    // Validate required fields
    if (!brandId || brandId.trim() === '') {
      toast({
        title: "Missing required field",
        description: "Please enter a brand",
        variant: "destructive"
      });
      return;
    }
    
    if (!productName || productName.trim() === '') {
      toast({
        title: "Missing required field",
        description: "Please enter a product name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log("Form submission started, isSubmitting set to true");
    
    try {
      // Submit the form and check if we got a duplicate product
      const result = await originalHandleSubmit(e, true); // Skip auto-success handling
      
      if (result?.isDuplicate && result.productId) {
        // Show duplicate product dialog
        setDuplicateProductId(result.productId);
        setDuplicateDialogOpen(true);
        setIsSubmitting(false);
      } else if (result?.productId) {
        // Normal success handling for new product
        toast({
          title: "Product Registered",
          description: "Your product was registered successfully."
        });
        onSuccess(result.productId, brandId);
        onOpenChange(false);
      } else {
        // Something went wrong
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setIsSubmitting(false);
      console.log("Error occurred, isSubmitting set to false");
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle duplicate product selection
  const handleUseDuplicateProduct = () => {
    if (duplicateProductId) {
      onSuccess(duplicateProductId, brandId);
      setDuplicateDialogOpen(false);
      onOpenChange(false);
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <ProductRegistrationHeader />
          <DialogDescription className="sr-only">
            Register a new milk product with brand, product details, properties, and flavors
          </DialogDescription>
          
          <ProductForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
      
      {/* Alert dialog for duplicate products */}
      <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Product</AlertDialogTitle>
            <AlertDialogDescription>
              This product already exists with the exact same properties and flavors.
              You cannot register duplicate products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDuplicateDialogOpen(false)}>
              Edit Product
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUseDuplicateProduct}>
              Use Existing Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Wrapper component that provides the context
export const ProductRegistrationDialog: React.FC<ProductRegistrationDialogProps> = (props) => {
  return (
    <ProductRegistrationProvider formProps={props}>
      <ProductRegistrationContainer {...props} />
    </ProductRegistrationProvider>
  );
};
