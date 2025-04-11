
import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ResultsContainer } from "@/components/milk-test/ResultsContainer";
import { SortConfig, useAggregatedResults } from "@/hooks/useAggregatedResults";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Set default sort to created_at in descending order to show latest tests first
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'created_at', direction: 'desc' });

  // Fetch aggregated results with average ratings
  const { data: aggregatedResults = [], isLoading: isLoadingAggregated } = useAggregatedResults(sortConfig);

  const navigate = useNavigate();

  const handleSort = (column: string) => {
    setSortConfig(current => {
      // If clicking on the same column, toggle direction
      if (current.column === column) {
        return {
          column,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      
      // If clicking on a different column, default to desc direction
      return {
        column,
        direction: 'desc'
      };
    });
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

  if (isLoadingAggregated) {
    return (
      <div className="min-h-screen bg-milk-100 py-8 px-4">
        <div className="container max-w-5xl mx-auto">
          <Navigation />
          <div className="text-center mt-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk-100 py-8 px-4">
      <div className="container max-w-5xl mx-auto">
        <Navigation />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Results</h1>
        
        <ResultsContainer 
          filteredResults={filteredResults}
          sortConfig={sortConfig}
          handleSort={handleSort}
          onProductClick={navigateToProduct}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default Results;
