
import React from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BrandSelect } from "./BrandSelect";
import { NameSelect } from "./NameSelect";
import { ProductOptions } from "./ProductOptions";
import { Separator } from "@/components/ui/separator";
import { ProductRegistrationHeader } from "./ProductRegistrationHeader";
import { BaristaToggle } from "./BaristaToggle";
import { FlavorSelector } from "./FlavorSelector";
import { useProductRegistrationForm } from "./hooks/useProductRegistrationForm";

interface ProductRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (productId: string, brandId: string) => void;
}

export const ProductRegistrationDialog = ({
  open,
  onOpenChange,
  onSuccess
}: ProductRegistrationDialogProps) => {
  const {
    brandId,
    setBrandId,
    productName,
    setProductName,
    nameId,
    setNameId,
    selectedProductTypes,
    setSelectedProductTypes,
    isBarista,
    setIsBarista,
    selectedFlavors,
    handleFlavorToggle,
    isSubmitting,
    handleSubmit,
    flavors
  } = useProductRegistrationForm({ open, onOpenChange, onSuccess });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <ProductRegistrationHeader />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Brand *</h3>
            <BrandSelect brandId={brandId} setBrandId={setBrandId} />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Product *</h3>
            <NameSelect 
              productName={productName} 
              setProductName={setProductName} 
              onNameIdChange={setNameId} 
            />
          </div>
          
          <Separator />
          
          <BaristaToggle 
            isBarista={isBarista} 
            onToggle={setIsBarista} 
          />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Properties</h3>
            <ProductOptions 
              selectedTypes={selectedProductTypes} 
              setSelectedTypes={setSelectedProductTypes} 
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Flavors</h3>
            <FlavorSelector 
              flavors={flavors} 
              selectedFlavors={selectedFlavors} 
              onFlavorToggle={handleFlavorToggle} 
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-black text-white"
            >
              {isSubmitting ? "Registering..." : "Register Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
