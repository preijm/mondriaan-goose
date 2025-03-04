
import React from "react";
import { IceCream, Flame, Coffee } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DrinkPreferenceProps {
  preference: string;
  setPreference: (pref: string) => void;
}

// Custom TeaCup SVG icon component
const TeaCup = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <path fill="currentColor" d="M5 2h2v3H5zm4 0h2v3H9zm4 0h2v3h-2zm6 7h-2V7H3v11c0 1.654 1.346 3 3 3h8c1.654 0 3-1.346 3-3h2c1.103 0 2-.897 2-2v-5c0-1.103-.897-2-2-2m-4 9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9h10zm2-2v-5h2l.002 5z"/>
  </svg>
);

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
      icon: TeaCup,
      label: "Tea",
      activeClass: "bg-soft-gray text-gray-900",
    },
  ];

  return (
    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
      {buttons.map(({ value, icon: Icon, label, activeClass }) => (
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
          <Icon className="w-8 h-8 mb-1" />
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
};
