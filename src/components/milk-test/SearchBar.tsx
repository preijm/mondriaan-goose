
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
    // Sanitize dangerous characters without trimming so spaces are preserved
    const sanitized = value
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');

    // Basic length guard only
    if (sanitized.length <= 100) {
      setSearchTerm(sanitized);
    }
  };

  return (
    <div className={className}>
      <div className="relative">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 w-full"
          maxLength={100}
        />
      </div>
    </div>
  );
};
