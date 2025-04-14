
import React, { useState } from "react";
import { useAggregatedResults, SortConfig } from "@/hooks/useAggregatedResults";
import { useNavigate } from "react-router-dom";
import MenuBar from "@/components/MenuBar";
import { ResultsContainer } from "@/components/milk-test/ResultsContainer";
import { MilkCharts } from "@/components/MilkCharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, Table2 } from "lucide-react";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'created_at', direction: 'desc' });
  const [view, setView] = useState<'table' | 'charts'>('table');

  const { data: aggregatedResults = [], isLoading } = useAggregatedResults(sortConfig);
  const navigate = useNavigate();

  const handleSort = (column: string) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const filteredResults = aggregatedResults.filter((result) => {
    const searchString = searchTerm.toLowerCase();
    return (
      (result.brand_name || "").toLowerCase().includes(searchString) ||
      (result.product_name || "").toLowerCase().includes(searchString)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <MenuBar />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80">
          <div className="container max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mt-8">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MenuBar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Results Overview</h1>
            <Tabs value={view} onValueChange={(v: 'table' | 'charts') => setView(v)} className="w-auto">
              <TabsList className="grid w-[200px] grid-cols-2 bg-white/50 backdrop-blur-sm">
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

          {view === 'table' ? (
            <ResultsContainer 
              filteredResults={filteredResults}
              sortConfig={sortConfig}
              handleSort={handleSort}
              onProductClick={navigateToProduct}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          ) : (
            <MilkCharts results={filteredResults} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
