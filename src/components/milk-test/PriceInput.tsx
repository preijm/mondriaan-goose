
import React, { useState } from "react";
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
  const priceValue = parseFloat(price) || 5; // Default to middle value (5)

  const handlePriceChange = (value: number[]) => {
    setPrice(value[0].toFixed(1));
  };

  const getPriceLabel = (value: number) => {
    if (value <= 3) return "Poor value";
    if (value <= 5) return "Fair value";
    if (value <= 7) return "Good value";
    return "Excellent value";
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Low value</span>
        <span className="text-sm text-muted-foreground">High value</span>
      </div>
      <div className="flex items-center gap-2">
        <SliderPrimitive.Root 
          value={[priceValue]} 
          onValueChange={handlePriceChange} 
          min={1} 
          max={10} 
          step={0.1} 
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
          <span className="flex items-center justify-center bg-cream-300 rounded-full h-8 w-12 font-semibold">
            {priceValue.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="text-sm text-center font-medium">
        {getPriceLabel(priceValue)}
      </div>
      <div className="text-xs text-muted-foreground text-center">
        How would you rate the value for money?
      </div>
    </div>
  );
};
