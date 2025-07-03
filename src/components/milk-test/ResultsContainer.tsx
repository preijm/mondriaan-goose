
import React from "react";
import { SearchBar } from "@/components/milk-test/SearchBar";
import { AggregatedResultsTable } from "@/components/milk-test/AggregatedResultsTable";
import { AggregatedResult, SortConfig } from "@/hooks/useAggregatedResults";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface ResultsContainerProps {
  filteredResults: AggregatedResult[];
  sortConfig: SortConfig;
  handleSort: (column: string) => void;
  onProductClick: (productId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ResultsContainer = ({
  filteredResults,
  sortConfig,
  handleSort,
  onProductClick,
  searchTerm,
  setSearchTerm
}: ResultsContainerProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden animate-fade-in">
      <CardHeader className="bg-white/50 backdrop-blur-sm pb-4 pt-6 px-6">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          className="mb-0"
          placeholder="Search by brand or product..."
        />
      </CardHeader>
      <CardContent className="p-0">
        <AggregatedResultsTable
          results={filteredResults}
          sortConfig={sortConfig}
          handleSort={handleSort}
          onProductClick={onProductClick}
        />
      </CardContent>
    </Card>
  );
};
