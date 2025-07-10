import React from "react";
import { ProductPropertyBadges } from "@/components/milk-test/ProductPropertyBadges";
import { Badge } from "@/components/ui/badge";
import { getScoreBadgeVariant } from "@/lib/scoreUtils";
import { formatScore } from "@/lib/scoreFormatter";
import { AggregatedResult, FilterOptions } from "./types";

interface ResultCardProps {
  result: AggregatedResult;
  onProductClick: (productId: string) => void;
  filters?: FilterOptions;
  onFiltersChange?: (filters: FilterOptions) => void;
}

export const ResultCard = ({
  result,
  onProductClick,
  filters,
  onFiltersChange
}: ResultCardProps) => {
  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 cursor-pointer hover:shadow-xl transition-shadow animate-fade-in"
      onClick={() => onProductClick(result.product_id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
          <div>
            <div className="text-xs text-gray-500">Brand</div>
            <h2 className="text-xl font-bold text-gray-900">{result.brand_name || "Unknown Brand"}</h2>
          </div>
          <div>
            <div className="text-xs text-gray-500">Product</div>
            <div className="flex items-center">
              <h3 className="" style={{fontSize: '20px'}}>{result.product_name || "Unknown Product"}</h3>
               {(result.is_barista || (result.property_names && result.property_names.length > 0) || (result.flavor_names && result.flavor_names.length > 0)) && (
                 <ProductPropertyBadges 
                   isBarista={result.is_barista}
                   propertyNames={result.property_names}
                   flavorNames={result.flavor_names}
                   compact={true}
                   displayType="all"
                   inline={true}
                   filters={filters}
                   onFiltersChange={onFiltersChange}
                 />
               )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-2 font-medium">Score</div>
            <Badge variant={getScoreBadgeVariant(result.avg_rating)} className="px-2.5 py-1.5 text-sm font-bold min-w-[50px] justify-center">
              {formatScore(result.avg_rating)}
            </Badge>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-2 font-medium">Tests</div>
            <Badge variant="testCount" className="px-2.5 py-1.5 text-sm font-medium min-w-[40px] justify-center">
              {result.count}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};