import React from "react";
import { BaseResultsProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { formatScore } from "@/lib/scoreFormatter";
import { getScoreBadgeVariant } from "@/lib/scoreUtils";

export const MobileResultsCards = ({
  results,
  onProductClick,
  filters,
  onFiltersChange
}: Omit<BaseResultsProps, 'sortConfig' | 'handleSort'>) => {
  return (
    <>
      {results.length === 0 ? (
        <div className="md:hidden text-center py-12 text-gray-500">
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg mb-2">No results found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      ) : (
        <div className="md:hidden">
          {/* Table Header */}
          <div className="bg-muted/50 border-b border-border sticky top-0 z-10">
            <div className="grid grid-cols-[1fr_80px_60px] gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground">
              <div>Product</div>
              <div className="text-center">Score</div>
              <div className="text-center">Tests</div>
            </div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-border bg-white">
            {results.map((result) => (
              <div
                key={result.product_id}
                onClick={() => onProductClick(result.product_id)}
                className="grid grid-cols-[1fr_80px_60px] gap-2 px-3 py-3 hover:bg-muted/50 cursor-pointer transition-colors items-center"
              >
                {/* Product Info */}
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {result.brand_name} - {result.product_name}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.is_barista && (
                      <Badge variant="barista" className="text-xs">Barista</Badge>
                    )}
                    {result.flavor_names?.slice(0, 2).map((flavor) => (
                      <Badge key={flavor} variant="flavor" className="text-xs capitalize">
                        {flavor}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Score */}
                <div className="text-center">
                  <Badge variant={getScoreBadgeVariant(result.avg_rating)} className="text-sm font-bold">
                    {formatScore(result.avg_rating)}
                  </Badge>
                </div>
                
                {/* Test Count */}
                <div className="text-center text-sm text-muted-foreground font-medium">
                  {result.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};