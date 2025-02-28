
import React, { useState } from "react";
import { BrandSelect } from "./BrandSelect";
import { ProductSelect } from "./ProductSelect";
import { BarcodeScanner } from "./BarcodeScanner";
import { BarcodeResultDialog } from "./BarcodeResultDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [scannedBrandName, setScannedBrandName] = useState("");
  const [scannedProductName, setScannedProductName] = useState("");
  const { toast } = useToast();

  const handleScanBarcode = () => {
    setIsScannerOpen(true);
  };

  const handleBarcodeScan = async (barcodeData: string) => {
    setIsScannerOpen(false);
    
    // In a real implementation, you would make an API call to a product database
    // using the barcode data. For this example, we'll simulate a response.
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, using the barcode to generate mock data
      const mockBrandName = `Brand ${barcodeData.substring(0, 3)}`;
      const mockProductName = `Product ${barcodeData.substring(3, 7)}`;
      
      setScannedBrandName(mockBrandName);
      setScannedProductName(mockProductName);
      setIsResultDialogOpen(true);
      
      toast({
        title: "Barcode Scanned",
        description: `Barcode: ${barcodeData}`,
      });
    } catch (error) {
      console.error("Error processing barcode:", error);
      toast({
        title: "Scan Error",
        description: "Failed to process barcode data.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmProduct = async (brandName: string, productName: string) => {
    try {
      // Check if brand exists
      const { data: existingBrand } = await supabase
        .from('brands')
        .select('id')
        .eq('name', brandName)
        .maybeSingle();
      
      let brandId;
      
      if (existingBrand) {
        // Use existing brand
        brandId = existingBrand.id;
      } else {
        // Create new brand
        const { data: newBrand, error: brandError } = await supabase
          .from('brands')
          .insert({ name: brandName })
          .select()
          .single();
        
        if (brandError) throw brandError;
        brandId = newBrand.id;
      }
      
      // Update brand ID
      setBrandId(brandId);
      
      // Check if product exists for this brand
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', productName)
        .eq('brand_id', brandId)
        .maybeSingle();
      
      if (existingProduct) {
        // Use existing product
        setProductId(existingProduct.id);
      } else {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({ 
            name: productName,
            brand_id: brandId
          })
          .select()
          .single();
        
        if (productError) throw productError;
        setProductId(newProduct.id);
      }
      
      toast({
        title: "Success",
        description: "Product information updated.",
      });
    } catch (error) {
      console.error("Error saving product information:", error);
      toast({
        title: "Error",
        description: "Failed to save product information.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
      <BrandSelect 
        brandId={brandId} 
        setBrandId={setBrandId}
        onScanClick={handleScanBarcode}
      />
      <ProductSelect
        brandId={brandId}
        productId={productId}
        setProductId={setProductId}
        onScanClick={handleScanBarcode}
      />
      
      <BarcodeScanner 
        open={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
      />
      
      <BarcodeResultDialog
        open={isResultDialogOpen}
        onClose={() => setIsResultDialogOpen(false)}
        brandName={scannedBrandName}
        productName={scannedProductName}
        onConfirm={handleConfirmProduct}
      />
    </div>
  );
};
