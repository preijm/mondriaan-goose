
import React from "react";
import { Switch } from "@/components/ui/switch";

interface BaristaToggleProps {
  isBarista: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean; // Added optional disabled prop
}

export const BaristaToggle = ({ isBarista, onToggle, disabled = false }: BaristaToggleProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Barista</h3>
      <div className="flex items-center">
        <Switch 
          id="barista-version" 
          checked={isBarista} 
          onCheckedChange={onToggle} 
          disabled={disabled}
        />
      </div>
    </div>
  );
};
