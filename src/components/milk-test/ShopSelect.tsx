
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ShopSelectProps {
  shop: string | null;
  setShop: (shop: string) => void;
  setCountry: (country: string) => void;
}

export const ShopSelect = ({ shop, setShop, setCountry }: ShopSelectProps) => {
  const [suggestions, setSuggestions] = useState<{ name: string; country: string }[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { data: shops = [] } = useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      console.log('Fetching all shops');
      const { data, error } = await supabase
        .from('shops')
        .select('name, country')
        .order('name');
      
      if (error) {
        console.error('Error fetching shops:', error);
        throw error;
      }
      
      console.log('Fetched shops:', data);
      return data || [];
    },
  });

  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filteredShops = shops.filter(s => 
      s.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    setSuggestions(filteredShops);
  }, [inputValue, shops]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelectShop = (selectedShop: { name: string; country: string }) => {
    setInputValue(selectedShop.name);
    setShop(selectedShop.name);
    setCountry(selectedShop.country);
    setSuggestions([]);
  };

  // Update input value when shop changes
  useEffect(() => {
    if (shop) {
      setInputValue(shop);
    }
  }, [shop]);

  return (
    <div className="relative">
      <Input
        placeholder="Enter shop name..."
        value={inputValue}
        onChange={handleInputChange}
        className="w-full"
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.name}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectShop(suggestion)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {suggestion.name} ({suggestion.country})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
