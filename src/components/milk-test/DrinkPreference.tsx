
import React from "react";
import { IceCream, Flame, Coffee } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DrinkPreferenceProps {
  preference: string;
  setPreference: (pref: string) => void;
}

export const DrinkPreference = ({ preference, setPreference }: DrinkPreferenceProps) => {
  const isMobile = useIsMobile();

  const buttons = [
    {
      value: "cold",
      icon: IceCream,
      label: "Cold",
      activeClass: "bg-soft-blue text-blue-600",
    },
    {
      value: "hot",
      icon: Flame,
      label: "Hot",
      activeClass: "bg-soft-peach text-orange-600",
    },
    {
      value: "coffee",
      icon: Coffee,
      label: "Coffee",
      activeClass: "bg-soft-brown text-amber-800",
    },
    {
      value: "tea",
      icon: Coffee,
      label: "Tea",
      activeClass: "bg-soft-gray text-gray-900",
      iconClass: "rotate-[15deg]",
    },
  ];

  return (
    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
      {buttons.map(({ value, icon: Icon, label, activeClass, iconClass }) => (
        <button
          key={value}
          type="button"
          onClick={() => setPreference(value)}
          className={`flex flex-col items-center p-3 rounded-lg transition-all ${
            preference === value
              ? activeClass
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Icon className={`w-8 h-8 mb-1 ${iconClass || ''}`} />
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
};
