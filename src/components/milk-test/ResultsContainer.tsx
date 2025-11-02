
import React from "react";
import { SearchBar } from "@/components/milk-test/SearchBar";
import { SearchIcon } from "@/components/milk-test/SearchIcon";
import { ResultsFilter } from "@/components/milk-test/ResultsFilter";
import { SortButton } from "@/components/milk-test/SortButton";
import { MobileFilterBar } from "@/components/milk-test/MobileFilterBar";
import { AggregatedResultsTable } from "@/components/milk-test/AggregatedResultsTable";
import { AggregatedResult, SortConfig } from "@/hooks/useAggregatedResults";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface FilterOptions {
  barista: boolean;
  properties: string[];
  flavors: string[];
  myResultsOnly: boolean;
}

interface ResultsContainerProps {
  filteredResults: AggregatedResult[];
  sortConfig: SortConfig;
  handleSort: (column: string) => void;
  onClearSort?: () => void;
  onProductClick: (productId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const ResultsContainer = ({
  filteredResults,
  sortConfig,
  handleSort,
  onClearSort,
  onProductClick,
  searchTerm,
  setSearchTerm,
  filters,
  onFiltersChange
}: ResultsContainerProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const handleMyResultsToggle = () => {
    onFiltersChange({
      ...filters,
      myResultsOnly: !filters.myResultsOnly
    });
  };

  return (
    <>
      {isMobile ? (
        <>
          <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 pt-3 pb-2">
            <MobileFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              onFiltersChange={onFiltersChange}
              sortConfig={sortConfig}
              onSort={handleSort}
              onClearSort={onClearSort}
              resultsCount={filteredResults.length}
            />
          </div>
          <div className={filters.barista || filters.properties.length > 0 || filters.flavors.length > 0 ? "pt-[170px]" : "pt-[140px]"}>
            <AggregatedResultsTable
              results={filteredResults}
              sortConfig={sortConfig}
              handleSort={handleSort}
              onProductClick={onProductClick}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </div>
        </>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden animate-fade-in">
          <CardHeader className="bg-white/50 backdrop-blur-sm pb-4 pt-6 px-6">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  className="mb-0"
                  placeholder="Search products..."
                />
              </div>
              <ResultsFilter 
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
              {user && (
                <button
                  onClick={handleMyResultsToggle}
                  className={`p-2 rounded-lg transition-colors ${
                    filters.myResultsOnly 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  aria-label="My results"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
              )}
            </div>
            
            <div className="mt-3 text-sm text-muted-foreground">
              {filteredResults.length} products
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <AggregatedResultsTable
              results={filteredResults}
              sortConfig={sortConfig}
              handleSort={handleSort}
              onProductClick={onProductClick}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};
