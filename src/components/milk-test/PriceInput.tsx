
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, AlertTriangle, Check, Trophy, Diamond } from "lucide-react";

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
      icon: X,
      label: "Total waste of money",
      activeClass: "bg-white text-red-500",
      iconColor: "text-red-500",
    },
    {
      value: "2",
      icon: AlertTriangle,
      label: "Not worth it",
      activeClass: "bg-white text-amber-500",
      iconColor: "text-amber-500",
    },
    {
      value: "3",
      icon: Check,
      label: "Fair price",
      activeClass: "bg-white text-green-500",
      iconColor: "text-green-500",
    },
    {
      value: "4",
      icon: Trophy,
      label: "Good deal",
      activeClass: "bg-white text-amber-500", 
      iconColor: "text-amber-500",
    },
    {
      value: "5",
      icon: Diamond,
      label: "Great value for money",
      activeClass: "bg-white text-blue-500",
      iconColor: "text-blue-500",
    },
  ];

  // For debugging
  console.log('Price quality ratio value in PriceInput:', priceValue);

  return (
    <div className="grid grid-cols-5 gap-2">
      {buttons.map(({ value, icon: Icon, label, activeClass, iconColor }) => (
        <button
          key={value}
          type="button"
          onClick={() => handlePriceChange(value)}
          className={`flex items-center justify-center py-3 px-2 rounded-lg border transition-all ${
            priceValue === value
              ? `${activeClass} border-gray-300`
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
          aria-label={label}
          title={label}
        >
          <Icon className={`w-6 h-6 ${priceValue === value ? '' : iconColor}`} />
        </button>
      ))}
    </div>
  );
};
