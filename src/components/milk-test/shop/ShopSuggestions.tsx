
import React from "react";

interface ShopSuggestionsProps {
  suggestions: { name: string; country_code: string }[];
  onSelect: (shop: { name: string; country_code: string }) => void;
}

export const ShopSuggestions = ({ suggestions, onSelect }: ShopSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.name}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(suggestion)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestion.name} ({suggestion.country_code})
        </div>
      ))}
    </div>
  );
};
