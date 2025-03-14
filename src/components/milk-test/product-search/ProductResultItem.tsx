
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProductResult {
  id: string;
  brand_name: string;
  product_name: string;
  product_types?: string[] | null;
  flavor_names: string[] | null;
}

interface ProductResultItemProps {
  product: ProductResult;
  onSelect: (productId: string) => void;
}

export const ProductResultItem = ({ product, onSelect }: ProductResultItemProps) => {
  const productTypes = product.product_types || [];
  const isBarista = productTypes.some(prop => prop.toLowerCase() === 'barista');
  
  return (
    <div 
      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col"
      onClick={() => onSelect(product.id)}
    >
      <div className="font-medium">{product.brand_name} - {product.product_name}</div>
      
      <div className="flex flex-wrap gap-2 mt-1">
        {/* Display product properties badges */}
        {productTypes.map(prop => (
          <Badge 
            key={`prop-${prop}`} 
            variant="outline" 
            className={`rounded-full px-3 py-0.5 text-xs ${
              prop.toLowerCase() === 'barista' 
                ? 'bg-cream-200 border-cream-300' 
                : 'bg-gray-100 border-gray-200'
            }`}
          >
            {prop.split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ')}
          </Badge>
        ))}
        
        {/* Display flavor badges with consistent styling */}
        {product.flavor_names && product.flavor_names.length > 0 && product.flavor_names.map(flavor => (
          <Badge 
            key={`flavor-${flavor}`} 
            variant="outline" 
            className="rounded-full px-3 py-0.5 text-xs bg-gray-100 border-gray-200 text-gray-700"
          >
            {flavor}
          </Badge>
        ))}
      </div>
    </div>
  );
};
