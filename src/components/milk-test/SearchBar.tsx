
import React from "react";
import { Input } from "@/components/ui/input";
import { validateSearchInput, sanitizeInput } from "@/lib/security";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  className,
  placeholder = "Search by brand or product..." 
}: SearchBarProps) => {
  const handleSearchChange = (value: string) => {
    // Sanitize input to prevent XSS
    const sanitized = sanitizeInput(value);
    
    // Validate input length and content
    const validation = validateSearchInput(sanitized);
    
    if (validation.isValid || sanitized === "") {
      setSearchTerm(sanitized);
    }
  };

  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="max-w-sm"
        maxLength={100} // Prevent overly long inputs
      />
    </div>
  );
};
