
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SearchBox } from "./product-search/SearchBox";
import { SearchResults } from "./product-search/SearchResults";
import { useProductSearch } from "./product-search/useProductSearch";
import { SelectedProduct } from "./product-search/SelectedProduct";
import { ProductRegistrationDialog } from "./ProductRegistrationDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ProductSearchProps {
  brandId: string;
  productId: string;
  setBrandId: (id: string) => void;
  setProductId: (id: string) => void;
}

export const ProductSearch = ({
  brandId,
  productId,
  setBrandId,
  setProductId
}: ProductSearchProps) => {
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    isDropdownVisible,
    setIsDropdownVisible,
    selectedProduct
  } = useProductSearch({
    initialProductId: productId
  });

  // If brandId or productId change externally, make sure we update
  useEffect(() => {
    if (selectedProduct && selectedProduct.brand_id !== brandId) {
      setBrandId(selectedProduct.brand_id);
    }
  }, [selectedProduct, setBrandId, brandId]);

  const handleSelectProduct = (selectedId: string) => {
    setProductId(selectedId);
    setIsDropdownVisible(false);
  };

  const handleProductRegistrationSuccess = (newProductId: string, newBrandId: string) => {
    setBrandId(newBrandId);
    setProductId(newProductId);
    setIsDropdownVisible(false);
  };

  // For debugging purposes
  console.log("Search results:", searchResults);
  console.log("Is dropdown visible:", isDropdownVisible);
  console.log("Search term length:", searchTerm.length);
  console.log("Selected product ID:", productId);

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchBox
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onFocus={() => setIsDropdownVisible(true)}
        />
        
        <Button 
          type="button"
          variant="outline"
          className="absolute right-2 top-1 h-8"
          onClick={() => setShowRegistrationDialog(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add New
        </Button>
        
        {selectedProduct && <SelectedProduct product={{
          ...selectedProduct,
          product_properties: selectedProduct.product_types // Add for compatibility
        }} />}
        
        {/* Search results dropdown - modified to ensure visibility */}
        <SearchResults 
          results={searchResults}
          searchTerm={searchTerm}
          isLoading={isLoading}
          onSelectProduct={handleSelectProduct}
          isVisible={searchTerm.length >= 2 && !productId}
        />
      </div>
      
      <ProductRegistrationDialog
        open={showRegistrationDialog}
        onOpenChange={setShowRegistrationDialog}
        onSuccess={handleProductRegistrationSuccess}
      />
    </div>
  );
};
