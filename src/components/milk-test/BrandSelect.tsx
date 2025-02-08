
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface BrandSelectProps {
  brand: string;
  setBrand: (brand: string) => void;
}

export const BrandSelect = ({ brand, setBrand }: BrandSelectProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(brand);
  const [showAddNew, setShowAddNew] = useState(false);
  const { toast } = useToast();

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      console.log('Fetching brands from database...');
      const { data, error } = await supabase
        .from('brands')
        .select('name')
        .order('name');
      
      if (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
      
      console.log('Fetched brands:', data);
      return data || [];
    },
  });

  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([]);
      setShowAddNew(false);
      return;
    }

    const filteredBrands = brands
      .map(b => b.name)
      .filter(name => 
        name.toLowerCase().includes(inputValue.toLowerCase())
      );

    setSuggestions(filteredBrands);
    
    // Show add new option only if there's no exact match
    const exactMatch = brands.some(
      b => b.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    setShowAddNew(!exactMatch && inputValue.trim() !== '');
  }, [inputValue, brands]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelectBrand = (selectedBrand: string) => {
    setInputValue(selectedBrand);
    setBrand(selectedBrand);
    setSuggestions([]); // Hide dropdown by clearing suggestions
    setShowAddNew(false); // Hide the "Add new" option
  };

  const handleAddNewBrand = async () => {
    if (inputValue.trim() === '') return;

    const { error } = await supabase
      .from('brands')
      .insert({ name: inputValue.trim() });

    if (error) {
      console.error('Error inserting new brand:', error);
      toast({
        title: "Error",
        description: "Failed to add new brand. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "New brand added successfully!",
    });
    
    setBrand(inputValue.trim());
    setSuggestions([]); // Hide dropdown by clearing suggestions
    setShowAddNew(false);
  };

  return (
    <div className="relative">
      <Input
        placeholder="Enter brand name..."
        value={inputValue}
        onChange={handleInputChange}
        className="w-full"
      />
      {(suggestions.length > 0 || showAddNew) && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectBrand(suggestion)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {suggestion}
            </div>
          ))}
          {showAddNew && (
            <div
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-blue-600"
              onClick={handleAddNewBrand}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add "{inputValue.trim()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
