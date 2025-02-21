
import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";

interface PriceInputProps {
  price: string;
  setPrice: (price: string) => void;
}

export const PriceInput = ({ price, setPrice }: PriceInputProps) => {
  const handlePriceChange = (value: number[]) => {
    setPrice(value[0].toFixed(2));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point with up to 2 decimal places
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 5) {
        setPrice(value);
      }
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <SliderPrimitive.Root
          value={[parseFloat(price) || 0]}
          onValueChange={handlePriceChange}
          min={0}
          max={5}
          step={0.01}
          className="relative flex w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-cream-300" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block cursor-pointer select-none touch-none">
            <span className="text-lg">€</span>
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
        <div className="flex items-center min-w-[80px]">
          <span className="mr-1 font-semibold">€</span>
          <Input
            type="text"
            value={price}
            onChange={handleInputChange}
            className="w-16 text-right"
          />
        </div>
      </div>
    </div>
  );
};
