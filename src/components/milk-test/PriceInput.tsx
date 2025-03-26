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
      emoji: "🚫",
      label: "Total waste of money",
      activeClass: "bg-white text-red-500 border-red-500",
    },
    {
      value: "2",
      emoji: "⚠️",
      label: "Not worth it",
      activeClass: "bg-white text-amber-500 border-amber-500",
    },
    {
      value: "3",
      emoji: "✅",
      label: "Fair price",
      activeClass: "bg-white text-green-500 border-green-500",
    },
    {
      value: "4",
      emoji: "🏆",
      label: "Good deal",
      activeClass: "bg-white text-amber-500 border-amber-500",
    },
    {
      value: "5",
      emoji: "💎",
      label: "Great value for money",
      activeClass: "bg-white text-blue-500 border-blue-500",
    },
  ];

  // For debugging
  console.log('Price quality ratio value in PriceInput:', priceValue);

  return (
    <div className="grid grid-cols-5 gap-2">
      {buttons.map(({ value, emoji, label, activeClass }) => (
        <button
          key={value}
          type="button"
          onClick={() => handlePriceChange(value)}
          className={`flex items-center justify-center py-3 px-2 rounded-lg border-2 transition-all ${
            priceValue === value
              ? `${activeClass} shadow-sm`
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
          aria-label={label}
          title={label}
        >
          <span className="text-xl">{emoji}</span>
        </button>
      ))}
    </div>
  );
};
