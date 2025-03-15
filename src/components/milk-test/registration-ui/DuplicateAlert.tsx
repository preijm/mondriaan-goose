
import React from "react";
import { DuplicateProductAlert } from "../DuplicateProductAlert";
import { useProductRegistration } from "./ProductRegistrationContext";

interface DuplicateAlertHandlerProps {
  onSuccess: (productId: string, brandId: string) => void;
  onClose: () => void;
}

export const DuplicateAlertHandler: React.FC<DuplicateAlertHandlerProps> = ({
  onSuccess,
  onClose
}) => {
  const {
    duplicateAlertOpen,
    setDuplicateAlertOpen,
    duplicateProductId,
    brandId,
    setIsSubmitting
  } = useProductRegistration();

  const handleUseExisting = () => {
    console.log("Using existing product:", duplicateProductId);
    // Make sure to reset the submitting state
    setIsSubmitting(false);
    
    // Only call onSuccess if we have a valid product ID
    if (duplicateProductId) {
      onSuccess(duplicateProductId, brandId);
    }
    
    // Close the alert
    setDuplicateAlertOpen(false);
  };

  const handleModify = () => {
    console.log("User chose to modify inputs");
    // Reset the submitting state
    setIsSubmitting(false);
    // Close the alert
    setDuplicateAlertOpen(false);
  };

  const handleAlertOpenChange = (open: boolean) => {
    console.log("Alert open state changing to:", open);
    if (!open) {
      // When the alert is closing (via ESC key or clicking outside)
      // Reset the submitting state
      setIsSubmitting(false);
      setDuplicateAlertOpen(false);
    }
  };

  return (
    <DuplicateProductAlert
      open={duplicateAlertOpen}
      onOpenChange={handleAlertOpenChange}
      onUseExisting={handleUseExisting}
      onModify={handleModify}
    />
  );
};
