
import React from "react";
import { Input } from "@/components/ui/input";

interface PriceInputProps {
  price: string;
  setPrice: (price: string) => void;
}

export const PriceInput = ({ price, setPrice }: PriceInputProps) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="Enter price..."
        value={price}
        onChange={handlePriceChange}
        className="w-full"
      />
    </div>
  );
};
