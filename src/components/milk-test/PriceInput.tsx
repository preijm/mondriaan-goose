
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Coins } from "lucide-react";

interface PriceInputProps {
  price: string;
  setPrice: (price: string) => void;
  hasChanged: boolean;
  setHasChanged: (hasChanged: boolean) => void;
}

export const PriceInput = ({
  price,
  setPrice,
  hasChanged,
  setHasChanged
}: PriceInputProps) => {
  // Convert price string to number for the toggle group
  const priceValue = price ? price.toString() : "3";

  const handlePriceChange = (value: string) => {
    if (value) {
      setPrice(value);
      if (!hasChanged) {
        setHasChanged(true);
      }
    }
  };

  const getPriceLabel = (value: string) => {
    switch (value) {
      case "1":
        return "❌ Total waste of money";
      case "2":
        return "⚠️ Not worth it";
      case "3":
        return "✅ Fair price";
      case "4":
        return "🏆 Good deal";
      case "5":
        return "💎 Great value for money";
      default:
        return "✅ Fair price";
    }
  };

  return (
    <div className="space-y-4 w-full">
      <ToggleGroup 
        type="single" 
        value={priceValue} 
        onValueChange={handlePriceChange}
        className="flex flex-wrap justify-between gap-2 w-full"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <ToggleGroupItem 
            key={value} 
            value={value.toString()}
            className="flex-1 py-2 border rounded-md data-[state=on]:bg-cream-300 data-[state=on]:text-milk-500 min-w-16"
            aria-label={`Rating ${value}`}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold">{value}</span>
              {value === parseInt(priceValue) && <Coins className="h-5 w-5" />}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
      <div className="text-sm text-center font-medium">
        {getPriceLabel(priceValue)}
      </div>
    </div>
  );
};
