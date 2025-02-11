
import React from "react";
import { Input } from "@/components/ui/input";

interface ShopSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ShopSearchInput = ({ value, onChange }: ShopSearchInputProps) => {
  return (
    <Input
      placeholder="Enter shop name..."
      value={value}
      onChange={onChange}
      className="w-full"
    />
  );
};
