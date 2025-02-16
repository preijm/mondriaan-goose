
import { BrandSelect } from "./BrandSelect";
import { Input } from "@/components/ui/input";

interface ProductInformationProps {
  brandId: string;
  setBrandId: (id: string) => void;
  productName: string;
  setProductName: (name: string) => void;
}

export const ProductInformation = ({
  brandId,
  setBrandId,
  productName,
  setProductName,
}: ProductInformationProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
      <BrandSelect 
        brandId={brandId} 
        setBrandId={setBrandId} 
      />
      <Input
        placeholder="Product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
