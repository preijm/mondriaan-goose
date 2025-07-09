
import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface RatingSelectProps {
  rating: number;
  setRating: (rating: number) => void;
}

const getRatingColor = (rating: number) => {
  if (rating >= 8.5) return "bg-emerald-600";
  if (rating >= 7.5) return "bg-sky-700"; 
  if (rating >= 5.5) return "bg-orange-600";
  return "bg-red-600";
};

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
            <SliderPrimitive.Range className={`absolute h-full ${getRatingColor(rating)}`} />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block cursor-pointer select-none touch-none">
            <span className="text-lg">🥛</span>
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
        <span className={`min-w-[4ch] text-right flex items-center justify-center ${getRatingColor(rating)} text-white rounded-full h-8 w-8 font-semibold`}>
          {rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
};
