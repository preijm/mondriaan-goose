
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Brand {
  id: string;
  name: string;
}

export const useBrandData = (inputValue: string, brandId: string, setBrandId: (id: string) => void) => {
  const [suggestions, setSuggestions] = useState<Brand[]>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const { toast } = useToast();

  // Fetch brands from Supabase
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      console.log('Fetching brands from database...');
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
      
      console.log('Fetched brands:', data);
      return data || [];
    },
  });

  // Update suggestions when input changes
  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([]);
      setShowAddNew(false);
      return;
    }

    const filteredBrands = brands.filter(brand => 
      brand.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    setSuggestions(filteredBrands);
    
    // Check for exact match (case-insensitive)
    const exactMatch = brands.find(
      brand => brand.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    // If there's an exact match, select it automatically and don't show "Add new"
    if (exactMatch) {
      setBrandId(exactMatch.id);
      setShowAddNew(false);
    } else {
      // Only clear brandId if the input has changed
      if (brandId) {
        const currentBrand = brands.find(brand => brand.id === brandId);
        if (currentBrand && currentBrand.name.toLowerCase() !== inputValue.trim().toLowerCase()) {
          setBrandId('');
        }
      }
      setShowAddNew(inputValue.trim() !== '');
    }
  }, [inputValue, brands, brandId, setBrandId]);

  // Add new brand to database
  const addNewBrand = async (brandName: string) => {
    if (brandName.trim() === '') return null;

    // First, check if the brand already exists (case-insensitive)
    const existingBrand = brands.find(
      brand => brand.name.toLowerCase() === brandName.trim().toLowerCase()
    );

    if (existingBrand) {
      console.log('Brand already exists, selecting it:', existingBrand);
      return existingBrand;
    }

    try {
      const { data, error } = await supabase
        .from('brands')
        .insert({ name: brandName.trim() })
        .select()
        .single();

      if (error) {
        console.error('Error inserting new brand:', error);
        toast({
          title: "Error",
          description: "Failed to add new brand. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "New brand added successfully!",
      });
      
      console.log("New brand created:", data);
      return data;
    } catch (error) {
      console.error('Error creating brand:', error);
      return null;
    }
  };

  return {
    brands,
    suggestions,
    showAddNew,
    isLoading,
    addNewBrand
  };
};
