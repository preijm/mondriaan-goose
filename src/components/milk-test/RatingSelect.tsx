
import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface RatingSelectProps {
  rating: number;
  setRating: (rating: number) => void;
}

export const RatingSelect = ({ rating, setRating }: RatingSelectProps) => {
  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <SliderPrimitive.Root
          value={[rating]}
          onValueChange={(value) => setRating(value[0])}
          min={0}
          max={10}
          step={0.1}
          className="relative flex w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-cream-300" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-cream-300 bg-background" />
        </SliderPrimitive.Root>
        <span className="min-w-[4ch] text-right flex items-center justify-center bg-cream-300 rounded-full h-8 w-8 font-semibold">
          {rating.toFixed(1)}
        </span>
      </div>
      <div className="flex justify-between px-2 text-[10px]">
        {[0, 2, 4, 6, 8, 10].map((value) => (
          <span key={value} className="text-gray-500">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};
