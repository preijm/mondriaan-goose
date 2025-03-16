
import React from "react";
import { CoffeeIcon, Milk, TeaCup } from "../icons/DrinkIcons";
import { ColdIcon, HotIcon } from "../icons/TemperatureIcons";

interface DrinkPreferenceIconProps {
  preference: string | null | undefined;
  className?: string;
}

export const DrinkPreferenceIcon = ({ preference, className = "w-6 h-6" }: DrinkPreferenceIconProps) => {
  if (!preference) return null;
  
  switch (preference.toLowerCase()) {
    case "cold":
      return <ColdIcon className={className} />;
    case "hot":
      return <HotIcon className={className} />;
    case "coffee":
      return <CoffeeIcon className={className} />;
    case "tea":
      return <TeaCup className={className} />;
    default:
      return <Milk className={className} />;
  }
};
