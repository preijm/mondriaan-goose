
import React from "react";
import { Badge } from "@/components/ui/badge";

interface FlavorSelectorProps {
  flavors: Array<{ id: string; name: string; key: string }>;
  selectedFlavors: string[];
  onFlavorToggle: (flavorKey: string) => void;
}

export const FlavorSelector = ({ 
  flavors, 
  selectedFlavors, 
  onFlavorToggle 
}: FlavorSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {flavors.map(flavor => (
        <Badge 
          key={flavor.id} 
          variant="outline" 
          className={`
            rounded-full px-4 py-1 cursor-pointer transition-all 
            ${selectedFlavors.includes(flavor.key) 
              ? 'bg-blue-500 text-white border-blue-600 font-medium shadow-sm hover:bg-blue-600' 
              : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'}
          `} 
          onClick={() => onFlavorToggle(flavor.key)}
        >
          {flavor.name}
        </Badge>
      ))}
    </div>
  );
};
