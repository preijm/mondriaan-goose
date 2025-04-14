
import React from "react";
import { Plus } from "lucide-react";
import { Brand } from "@/hooks/useBrandData";

interface BrandSuggestionsProps {
  suggestions: Brand[];
  showAddNew: boolean;
  inputValue: string;
  onSelectBrand: (brand: Brand) => void;
  onAddNewBrand: () => void;
  isVisible: boolean;
}

export const BrandSuggestions = ({
  suggestions,
  showAddNew,
  inputValue,
  onSelectBrand,
  onAddNewBrand,
  isVisible
}: BrandSuggestionsProps) => {
  if (!isVisible || (suggestions.length === 0 && !showAddNew)) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelectBrand(suggestion);
          }}
        >
          {suggestion.name}
        </div>
      ))}
      {showAddNew && (
        <div
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-gray-700"
          onMouseDown={(e) => {
            e.preventDefault();
            onAddNewBrand();
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add "{inputValue.trim()}"
        </div>
      )}
    </div>
  );
};
