import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { useProductRegistration } from "./ProductRegistrationContext";
import { BrandSelect } from "../BrandSelect";
import { FlavorSelector } from "../FlavorSelector";
import { BaristaToggle } from "../BaristaToggle";
import { ProductOptions } from "../ProductOptions";
import { NameSelect } from "../NameSelect";

interface ProductFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: (e: React.MouseEvent) => void;
  onBrandInputReady?: (input: HTMLInputElement | null) => void;
}

export const ProductForm = forwardRef<HTMLInputElement, ProductFormProps>(({ onSubmit, onCancel, onBrandInputReady }, ref) => {
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
    flavors = [],
    isSubmitting,
    refetchFlavors
  } = useProductRegistration();

  // Form validation logic
  const isFormValid = !!brandId && !!productName;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="brand" className="block font-medium text-gray-900">
            Brand <span className="text-red-500">*</span>
          </label>
          <div className="w-full">
            <BrandSelect
              ref={ref}
              brandId={brandId}
              setBrandId={setBrandId}
              onInputReady={onBrandInputReady}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="product" className="block font-medium text-gray-900">
            Product <span className="text-red-500">*</span>
          </label>
          <NameSelect
            productName={productName}
            setProductName={setProductName}
            onNameIdChange={setNameId}
          />
        </div>

        <div className="space-y-2">
          <span className="block font-medium text-gray-900">Type</span>
          <BaristaToggle isBarista={isBarista} onToggle={setIsBarista} />
        </div>

        <div className="space-y-2">
          <span className="block font-medium text-gray-900">Properties</span>
          <ProductOptions
            selectedTypes={selectedProductTypes}
            setSelectedTypes={setSelectedProductTypes}
          />
        </div>

        <div className="space-y-2">
          <span className="block font-medium text-gray-900">Flavors</span>
          <FlavorSelector
            flavors={flavors}
            selectedFlavors={selectedFlavors}
            onFlavorToggle={handleFlavorToggle}
            refetchFlavors={refetchFlavors}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-4"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="brand"
          disabled={!isFormValid || isSubmitting}
          className="px-4"
        >
          {isSubmitting ? "Registering..." : "Register Product"}
        </Button>
      </div>
    </form>
  );
});

ProductForm.displayName = "ProductForm";
