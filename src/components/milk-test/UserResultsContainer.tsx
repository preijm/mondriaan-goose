
import React from "react";
import { SearchBar } from "@/components/milk-test/SearchBar";
import { MyResultsTable } from "@/components/milk-test/MyResultsTable";
import { MilkTestResult } from "@/types/milk-test";
import { SortConfig } from "@/hooks/useUserMilkTests";

interface UserResultsContainerProps {
  filteredResults: MilkTestResult[];
  sortConfig: SortConfig;
  handleSort: (column: string) => void;
  onEdit: (result: MilkTestResult) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const UserResultsContainer = ({
  filteredResults,
  sortConfig,
  handleSort,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm
}: UserResultsContainerProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        className="mb-4"
        placeholder="Search by brand or product..."
      />
      
      <MyResultsTable
        results={filteredResults}
        sortConfig={sortConfig}
        handleSort={handleSort}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
