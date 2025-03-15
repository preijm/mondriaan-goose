
import React, { createContext, useContext } from "react";
import { 
  useProductRegistrationForm
} from "../hooks/useProductRegistrationForm";
import { UseProductRegistrationFormProps } from "../hooks/types";

// The context holds the entire state and handlers from useProductRegistrationForm
type ProductRegistrationContextType = ReturnType<typeof useProductRegistrationForm> & {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  duplicateAlertOpen: boolean;
  setDuplicateAlertOpen: (value: boolean) => void;
  duplicateProductId: string | null;
  setDuplicateProductId: (value: string | null) => void;
  handleSubmit: (e: React.FormEvent) => Promise<any>;
};

const ProductRegistrationContext = createContext<ProductRegistrationContextType | undefined>(undefined);

export const useProductRegistration = () => {
  const context = useContext(ProductRegistrationContext);
  if (!context) {
    throw new Error("useProductRegistration must be used within a ProductRegistrationProvider");
  }
  return context;
};

interface ProductRegistrationProviderProps {
  children: React.ReactNode;
  formProps: UseProductRegistrationFormProps;
}

export const ProductRegistrationProvider: React.FC<ProductRegistrationProviderProps> = ({ 
  children, 
  formProps 
}) => {
  const [duplicateAlertOpen, setDuplicateAlertOpen] = React.useState(false);
  const [duplicateProductId, setDuplicateProductId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const formState = useProductRegistrationForm(formProps);
  
  const value = {
    ...formState,
    isSubmitting,
    setIsSubmitting,
    duplicateAlertOpen,
    setDuplicateAlertOpen,
    duplicateProductId,
    setDuplicateProductId,
    // The handleSubmit will be overridden in the Dialog component
    handleSubmit: async (e: React.FormEvent) => Promise.resolve(null)
  };
  
  return (
    <ProductRegistrationContext.Provider value={value}>
      {children}
    </ProductRegistrationContext.Provider>
  );
};
