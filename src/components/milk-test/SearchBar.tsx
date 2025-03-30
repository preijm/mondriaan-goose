
import React from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  className?: string;
}

export const SearchBar = ({ searchTerm, setSearchTerm, className }: SearchBarProps) => {
  return (
    <div className={className}>
      <Input
        placeholder="Search by brand or product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
