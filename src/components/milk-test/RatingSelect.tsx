import React from "react";

interface RatingSelectProps {
  rating: number;
  setRating: (rating: number) => void;
}

export const RatingSelect = ({ rating, setRating }: RatingSelectProps) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
        <span
          key={value}
          className={`text-xl cursor-pointer ${
            value <= rating ? "" : "opacity-20"
          }`}
          onClick={() => setRating(value)}
        >
          🥛
        </span>
      ))}
    </div>
  );
};