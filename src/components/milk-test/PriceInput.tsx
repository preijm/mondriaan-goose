
import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Coins } from "lucide-react";

interface PriceInputProps {
  price: string;
  setPrice: (price: string) => void;
}

export const PriceInput = ({
  price,
  setPrice
}: PriceInputProps) => {
  // Convert price string to number for the slider
  const priceValue = parseFloat(price) || 3; // Default to middle value (3)

  const handlePriceChange = (value: number[]) => {
    setPrice(value[0].toString());
  };

  const getPriceLabel = (value: number) => {
    switch (value) {
      case 1:
        return "❌ Total waste of money";
      case 2:
        return "⚠️ Not worth it";
      case 3:
        return "✅ Fair price";
      case 4:
        return "🏆 Good deal";
      case 5:
        return "💎 Great value for money";
      default:
        return "✅ Fair price";
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-2">
        <SliderPrimitive.Root 
          value={[priceValue]} 
          onValueChange={handlePriceChange} 
          min={1} 
          max={5} 
          step={1} 
          className="relative flex w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-cream-300" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block cursor-pointer select-none touch-none">
            <Coins className="h-5 w-5" />
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
        <div className="flex items-center gap-1 min-w-[50px] justify-center">
          <span className="flex items-center justify-center bg-cream-300 rounded-full h-8 w-8 font-semibold">
            {priceValue}
          </span>
        </div>
      </div>
      <div className="text-sm text-center font-medium">
        {getPriceLabel(priceValue)}
      </div>
    </div>
  );
};
