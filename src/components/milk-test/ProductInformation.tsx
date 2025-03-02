
import React, { useState } from "react";
import { ProductSearch } from "./ProductSearch";
import { ProductRegistrationDialog } from "./ProductRegistrationDialog";
import { useToast } from "@/components/ui/use-toast";

interface ProductInformationProps {
  brandId: string;
  setBrandId: (id: string) => void;
  productId: string;
  setProductId: (id: string) => void;
}

export const ProductInformation = ({
  brandId,
  setBrandId,
  productId,
  setProductId,
}: ProductInformationProps) => {
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSelectProduct = (productId: string, brandId: string) => {
    setProductId(productId);
    setBrandId(brandId);
    if (productId) {
      toast({
        title: "Product selected",
        description: "You've selected an existing product",
      });
    }
  };

  const handleAddNewProduct = () => {
    setIsRegistrationDialogOpen(true);
  };

  const handleProductAdded = (productId: string, brandId: string) => {
    setProductId(productId);
    setBrandId(brandId);
    toast({
      title: "New product added",
      description: "Your new product has been registered and selected",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
      
      <ProductSearch 
        onSelectProduct={handleSelectProduct}
        onAddNew={handleAddNewProduct}
        selectedProductId={productId}
      />
      
      <ProductRegistrationDialog 
        open={isRegistrationDialogOpen}
        onOpenChange={setIsRegistrationDialogOpen}
        onSuccess={handleProductAdded}
      />
    </div>
  );
};
