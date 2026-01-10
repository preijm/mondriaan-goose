import { Badge } from "@/components/ui/badge";
import { Coffee, Tag, Droplet } from "lucide-react";

interface FeedProductInfoProps {
  brandName: string;
  productName: string;
  isBarista?: boolean;
  propertyNames?: string[];
  flavorNames?: string[];
}

export const FeedProductInfo = ({ 
  brandName, 
  productName, 
  isBarista, 
  propertyNames, 
  flavorNames 
}: FeedProductInfoProps) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-border/50">
      <span className="text-sm font-semibold text-foreground" translate="no">
        {brandName} - {productName}
      </span>
      {isBarista && (
        <Badge variant="barista" className="text-xs font-medium px-1.5 py-0.5">
          <Coffee className="w-3 h-3 mr-1" />
          Barista
        </Badge>
      )}
      {propertyNames?.slice(0, 2).map(property => (
        <Badge key={property} variant="category" className="text-xs font-medium px-1.5 py-0.5">
          <Tag className="w-3 h-3 mr-1" />
          {property.replace(/_/g, ' ')}
        </Badge>
      ))}
      {flavorNames?.slice(0, 1).map(flavor => (
        <Badge key={flavor} variant="flavor" className="text-xs font-medium px-1.5 py-0.5">
          <Droplet className="w-3 h-3 mr-1" />
          {flavor}
        </Badge>
      ))}
    </div>
  );
};
