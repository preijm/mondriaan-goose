
import { BrandSelect } from "./BrandSelect";
import { ProductSelect } from "./ProductSelect";

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
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
      <BrandSelect 
        brandId={brandId} 
        setBrandId={setBrandId} 
      />
      <ProductSelect
        brandId={brandId}
        productId={productId}
        setProductId={setProductId}
      />
    </div>
  );
};
