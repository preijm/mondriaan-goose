
import React from "react";
import { useProductRegistration } from "./ProductRegistrationContext";
import { DuplicateProductAlert } from "../DuplicateProductAlert";

export const useDuplicateHandling = (onSuccess: (productId: string, brandId: string) => void, onClose: () => void) => {
  const { 
    duplicateAlertOpen, 
    setDuplicateAlertOpen,
    duplicateProductId,
    brandId,
    toast
  } = useProductRegistration();
  
  // Use the existing product
  const handleUseExisting = () => {
    if (duplicateProductId) {
      // Call onSuccess without showing a toast - the ProductInformation component
      // will handle showing the appropriate toast
      onSuccess(duplicateProductId, brandId);
      onClose(); // Close the dialog after selecting existing product
    }
  };
  
  // Modify inputs to create a unique product
  const handleModifyInputs = () => {
    // Just close the duplicate alert dialog, main form will remain open
    setDuplicateAlertOpen(false);
  };
  
  return {
    duplicateAlertOpen,
    setDuplicateAlertOpen,
    handleUseExisting,
    handleModifyInputs
  };
};

export const DuplicateAlertHandler: React.FC<{
  onSuccess: (productId: string, brandId: string) => void;
  onClose: () => void;
}> = ({ onSuccess, onClose }) => {
  const {
    duplicateAlertOpen,
    setDuplicateAlertOpen,
    handleUseExisting,
    handleModifyInputs
  } = useDuplicateHandling(onSuccess, onClose);
  
  return (
    <DuplicateProductAlert
      open={duplicateAlertOpen}
      onOpenChange={setDuplicateAlertOpen}
      onUseExisting={handleUseExisting}
      onModify={handleModifyInputs}
    />
  );
};
