
import React from "react";
import { Input } from "@/components/ui/input";

interface ShopSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ShopSearchInput = ({ value, onChange }: ShopSearchInputProps) => {
  return (
    <Input
      placeholder="Search for shop..."
      value={value}
      onChange={onChange}
      className="w-full focus-visible:ring-primary/70"
      autoComplete="off"
    />
  );
};
