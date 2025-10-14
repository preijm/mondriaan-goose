import React from "react";
import { ProductPropertyBadges } from "@/components/milk-test/ProductPropertyBadges";
import { Badge } from "@/components/ui/badge";
import { getScoreBadgeVariant } from "@/lib/scoreUtils";
import { formatScore } from "@/lib/scoreFormatter";
import { format } from "date-fns";
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
  const getScoreColor = (rating: number) => {
    if (rating >= 8.5) return "bg-[#00bf63]";
    if (rating >= 7.5) return "bg-[#2144ff]"; 
    if (rating >= 5.5) return "bg-[#f59e0b]";
    return "bg-[#ff4b51]";
  };

  return (
    <div
      className="bg-card backdrop-blur-sm rounded-2xl shadow-lg border border-border p-5 cursor-pointer hover:shadow-xl transition-shadow animate-fade-in w-full"
      onClick={() => onProductClick(result.product_id)}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Product info */}
        <div className="flex-1 space-y-3">
          {/* Brand - Product name */}
          <h2 className="text-lg font-bold text-foreground leading-tight">
            <span translate="no">{result.brand_name || "Unknown Brand"}</span> - {result.product_name || "Unknown Product"}
          </h2>
          
          {/* Badges */}
          {(result.is_barista || (result.property_names && result.property_names.length > 0) || (result.flavor_names && result.flavor_names.length > 0)) && (
            <div className="flex flex-wrap gap-1.5">
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
            </div>
          )}
          
          {/* Bottom row - Tests count and date */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{result.count}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {result.count === 1 ? 'Test' : 'Tests'}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {format(new Date(result.most_recent_date), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
        
        {/* Right side - Large circular score */}
        <div className={`w-20 h-20 rounded-full ${getScoreColor(result.avg_rating)} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <span className="text-2xl font-bold text-white">
            {formatScore(result.avg_rating)}
          </span>
        </div>
      </div>
    </div>
  );
};