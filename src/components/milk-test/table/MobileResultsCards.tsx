import React from "react";
import { ResultCard } from "./ResultCard";
import { BaseResultsProps } from "./types";

export const MobileResultsCards = ({
  results,
  onProductClick,
  filters,
  onFiltersChange
}: Omit<BaseResultsProps, 'sortConfig' | 'handleSort'>) => {
  return (
    <div className="md:hidden p-4 space-y-3">
      {results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg mb-2">No results found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      ) : (
        results.map((result) => (
          <ResultCard
            key={result.product_id}
            result={result}
            onProductClick={onProductClick}
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
        ))
      )}
    </div>
  );
};