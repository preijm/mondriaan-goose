
import React from "react";
import { Switch } from "@/components/ui/switch";

interface BaristaToggleProps {
  isBarista: boolean;
  onToggle: (checked: boolean) => void;
}

export const BaristaToggle = ({ isBarista, onToggle }: BaristaToggleProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Barista Version</h3>
      <div className="flex items-center">
        <Switch id="barista-version" checked={isBarista} onCheckedChange={onToggle} />
      </div>
    </div>
  );
};
