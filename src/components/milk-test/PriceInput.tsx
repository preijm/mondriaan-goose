
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  // Ensure price is a string and default to empty string if null/undefined
  const priceValue = price || "";

  const handlePriceChange = (value: string) => {
    // Always update the price when a button is clicked
    setPrice(value);
    
    // Mark as changed if not already changed
    if (!hasChanged) {
      setHasChanged(true);
    }
    
    // For debugging
    console.log('Price quality ratio selected:', value);
  };

  const buttons = [
    {
      value: "1",
      emoji: "😡",
      label: "Total waste of money",
      activeClass: "bg-soft-pink text-red-600",
    },
    {
      value: "2",
      emoji: "😕",
      label: "Not worth it",
      activeClass: "bg-soft-yellow text-yellow-600",
    },
    {
      value: "3",
      emoji: "😐",
      label: "Fair price",
      activeClass: "bg-soft-green text-green-600",
    },
    {
      value: "4",
      emoji: "😊",
      label: "Good deal",
      activeClass: "bg-amber-100 text-amber-600",
    },
    {
      value: "5",
      emoji: "🤩",
      label: "Great value for money",
      activeClass: "bg-soft-blue text-blue-600",
    },
  ];

  // For debugging
  console.log('Price quality ratio value in PriceInput:', priceValue);

  return (
    <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-5 gap-4'}`}>
      {buttons.map(({ value, emoji, label, activeClass }) => (
        <button
          key={value}
          type="button"
          onClick={() => handlePriceChange(value)}
          className={`flex flex-col items-center p-3 rounded-lg transition-all ${
            priceValue === value
              ? activeClass
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          aria-label={label}
          title={label}
        >
          <span className="text-2xl mb-1">{emoji}</span>
          {!isMobile && <span className="text-sm text-center">{label}</span>}
        </button>
      ))}
    </div>
  );
};
