
import React, { useState } from "react";
import { useAggregatedResults, SortConfig } from "@/hooks/useAggregatedResults";
import { useNavigate } from "react-router-dom";
import MenuBar from "@/components/MenuBar";
import BackgroundPattern from "@/components/BackgroundPattern";
import { ResultsContainer } from "@/components/milk-test/ResultsContainer";
import { MilkCharts } from "@/components/MilkCharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, Table2 } from "lucide-react";
import { MilkTestResult } from "@/types/milk-test";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterOptions {
  barista: boolean;
  properties: string[];
  flavors: string[];
}

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'created_at', direction: 'desc' });
  const [view, setView] = useState<'table' | 'charts'>('table');
  const [filters, setFilters] = useState<FilterOptions>({
    barista: false,
    properties: [],
    flavors: []
  });

  const { data: aggregatedResults = [], isLoading } = useAggregatedResults(sortConfig);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSort = (column: string) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleClearSort = () => {
    setSortConfig({ column: 'created_at', direction: 'desc' });
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const filteredResults = aggregatedResults.filter((result) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      (result.brand_name || "").toLowerCase().includes(searchString) ||
      (result.product_name || "").toLowerCase().includes(searchString)
    );

    // Filter by Barista
    if (filters.barista && !result.is_barista) {
      return false;
    }

    // Filter by Properties
    if (filters.properties.length > 0) {
      const hasMatchingProperty = filters.properties.some(filterProp => 
        result.property_names?.includes(filterProp)
      );
      if (!hasMatchingProperty) {
        return false;
      }
    }

    // Filter by Flavors
    if (filters.flavors.length > 0) {
      const hasMatchingFlavor = filters.flavors.some(filterFlavor => 
        result.flavor_names?.includes(filterFlavor)
      );
      if (!hasMatchingFlavor) {
        return false;
      }
    }

    return matchesSearch;
  });

  // Convert AggregatedResult[] to MilkTestResult[] for MilkCharts component
  const chartsData: MilkTestResult[] = filteredResults.map(result => ({
    id: result.product_id,
    created_at: new Date().toISOString(), // Use current date as fallback
    rating: result.avg_rating,
    brand_name: result.brand_name,
    product_name: result.product_name,
    property_names: result.property_names,
    flavor_names: result.flavor_names,
    is_barista: result.is_barista,
    product_id: result.product_id,
    brand_id: result.brand_id
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <MenuBar />
        <BackgroundPattern>
          <div className="container max-w-5xl mx-auto px-4 py-8 pt-32">
            <div className="text-center mt-8">
              <div className="text-xl text-gray-600">Loading...</div>
            </div>
          </div>
        </BackgroundPattern>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MenuBar />
      <BackgroundPattern>
        <div className="container max-w-6xl mx-auto px-4 py-8 pt-32 relative z-10">
          {/* Desktop only: View switcher */}
          {!isMobile && (
            <div className="flex justify-end mb-8">
              <Tabs value={view} onValueChange={(v: 'table' | 'charts') => setView(v)} className="w-auto">
                <TabsList className="grid w-[200px] grid-cols-2 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <Table2 className="w-4 h-4" />
                    <span>Table</span>
                  </TabsTrigger>
                  <TabsTrigger value="charts" className="flex items-center gap-2">
                    <ChartBar className="w-4 h-4" />
                    <span>Charts</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Mobile: Always table view, Desktop: conditional view */}
          {isMobile || view === 'table' ? (
            <ResultsContainer 
              filteredResults={filteredResults}
              sortConfig={sortConfig}
              handleSort={handleSort}
              onClearSort={handleClearSort}
              onProductClick={navigateToProduct}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              onFiltersChange={setFilters}
            />
          ) : (
            <MilkCharts results={chartsData} />
          )}
        </div>
      </BackgroundPattern>
    </div>
  );
};

export default Results;
