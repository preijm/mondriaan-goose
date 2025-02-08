
import { Input } from "@/components/ui/input";
import { BrandSelect } from "./BrandSelect";

interface ProductInformationProps {
  brand: string;
  setBrand: (brand: string) => void;
  productName: string;
  setProductName: (name: string) => void;
}

export const ProductInformation = ({
  brand,
  setBrand,
  productName,
  setProductName,
}: ProductInformationProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
      <BrandSelect brand={brand} setBrand={setBrand} />
      <Input
        placeholder="Product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
