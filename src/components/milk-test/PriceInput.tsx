
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { X, AlertTriangle, Check, Trophy, Diamond } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

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
  // The price value might be empty to allow for no selection
  const priceValue = price || "";

  const handlePriceChange = (value: string) => {
    // If value is empty or the same as current (toggle off), reset it
    const newValue = value === price ? "" : value;
    setPrice(newValue);
    
    // Mark as changed even when deselecting
    if (!hasChanged) {
      setHasChanged(true);
    }
  };

  const getPriceTooltip = (value: string) => {
    switch (value) {
      case "1":
        return "Total waste of money";
      case "2":
        return "Not worth it";
      case "3":
        return "Fair price";
      case "4":
        return "Good deal";
      case "5":
        return "Great value for money";
      default:
        return "";
    }
  };

  const getPriceIcon = (value: string) => {
    switch (value) {
      case "1":
        return <X className="h-5 w-5" color="#FF0000" />;
      case "2":
        return <AlertTriangle className="h-5 w-5" color="#FFA500" />;
      case "3":
        return <Check className="h-5 w-5" color="#00A000" />;
      case "4":
        return <Trophy className="h-5 w-5" color="#FFC107" />;
      case "5":
        return <Diamond className="h-5 w-5" color="#00BFFF" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 w-full">
      <TooltipProvider>
        <ToggleGroup 
          type="single" 
          value={priceValue} 
          onValueChange={handlePriceChange}
          className="flex flex-wrap justify-between gap-2 w-full"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value={value.toString()}
                  className="flex-1 py-2 border rounded-md data-[state=on]:bg-cream-300 data-[state=on]:text-milk-500 min-w-16 flex items-center justify-center"
                  aria-label={`Rating ${value}`}
                >
                  {getPriceIcon(value.toString())}
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getPriceTooltip(value.toString())}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </TooltipProvider>
    </div>
  );
};
