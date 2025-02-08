
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface ShopSelectProps {
  shop: string | null;
  setShop: (shop: string) => void;
}

export const ShopSelect = ({ shop, setShop }: ShopSelectProps) => {
  const [suggestions, setSuggestions] = useState<{ name: string; country: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAddingShop, setIsAddingShop] = useState(false);
  const [newShopName, setNewShopName] = useState("");
  const [newShopCountry, setNewShopCountry] = useState("");
  const { toast } = useToast();

  const { data: shops = [], refetch: refetchShops } = useQuery({
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
    setSuggestions([]);
  };

  const handleAddNewShop = async () => {
    if (!newShopName.trim() || !newShopCountry.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both shop name and country",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('shops')
        .insert({
          name: newShopName.trim(),
          country: newShopCountry.trim(),
        });

      if (error) throw error;

      toast({
        title: "Shop added",
        description: "New shop has been added successfully",
      });

      // Reset form and refresh shops list
      setNewShopName("");
      setNewShopCountry("");
      setIsAddingShop(false);
      refetchShops();
      
      // Select the newly added shop
      setInputValue(newShopName.trim());
      setShop(newShopName.trim());
    } catch (error) {
      console.error('Error adding shop:', error);
      toast({
        title: "Error",
        description: "Failed to add new shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update input value when shop changes
  useEffect(() => {
    if (shop) {
      setInputValue(shop);
    }
  }, [shop]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
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
        <Dialog open={isAddingShop} onOpenChange={setIsAddingShop}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shop</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Shop name"
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Country (e.g., United Kingdom)"
                  value={newShopCountry}
                  onChange={(e) => setNewShopCountry(e.target.value)}
                />
              </div>
              <Button onClick={handleAddNewShop} className="w-full">
                Add Shop
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
