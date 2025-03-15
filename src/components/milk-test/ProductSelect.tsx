
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface ProductSelectProps {
  brandId: string;
  productId: string;
  setProductId: (id: string) => void;
}

interface ProductWithName {
  id: string;
  name: string;
}

export const ProductSelect = ({ brandId, productId, setProductId }: ProductSelectProps) => {
  const [suggestions, setSuggestions] = useState<ProductWithName[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      console.log('Fetching products for brand:', brandId);
      
      // Join products with names to get the product name
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, 
          names!inner(name)
        `)
        .eq('brand_id', brandId)
        .order('created_at');
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      // Transform the data to the expected format
      const productsWithNames: ProductWithName[] = data.map(product => ({
        id: product.id,
        name: product.names.name
      }));
      
      console.log('Fetched products:', productsWithNames);
      return productsWithNames;
    },
    enabled: !!brandId,
  });

  // Update input value when product changes
  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setInputValue(product.name);
      }
    } else {
      setInputValue("");
    }
  }, [productId, products]);

  useEffect(() => {
    if (!brandId || inputValue.trim() === '') {
      setSuggestions([]);
      setShowAddNew(false);
      return;
    }

    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    setSuggestions(filteredProducts);
    
    // Check if exact match (case-insensitive)
    const exactMatch = products.some(
      product => product.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    setShowAddNew(!exactMatch && inputValue.trim() !== '');
  }, [inputValue, products, brandId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Don't reset productId here - only set it when explicitly chosen
  };

  const handleSelectProduct = (selectedProduct: ProductWithName) => {
    setInputValue(selectedProduct.name);
    setProductId(selectedProduct.id);
    setIsDropdownVisible(false);
  };

  const handleAddNewProduct = async () => {
    if (!brandId || inputValue.trim() === '') return;

    // Check if product already exists for this brand (case-insensitive)
    const existingProduct = products.find(
      product => product.name.toLowerCase() === inputValue.trim().toLowerCase()
    );

    if (existingProduct) {
      console.log('Product already exists for this brand, selecting it:', existingProduct);
      handleSelectProduct(existingProduct);
      return;
    }

    try {
      // 1. First create a name entry
      const { data: nameData, error: nameError } = await supabase
        .from('names')
        .insert({ name: inputValue.trim() })
        .select()
        .single();

      if (nameError) {
        console.error('Error creating name:', nameError);
        throw nameError;
      }

      // 2. Then create the product with the name_id
      const { data, error } = await supabase
        .from('products')
        .insert({ 
          brand_id: brandId,
          name_id: nameData.id
        })
        .select(`
          id, 
          names!inner(name)
        `)
        .single();

      if (error) {
        console.error('Error inserting new product:', error);
        toast({
          title: "Error",
          description: "Failed to add new product. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "New product added successfully!",
      });
      
      // Transform the data to match our expected format
      const newProduct = {
        id: data.id,
        name: data.names.name
      };
      
      setProductId(newProduct.id);
      setInputValue(newProduct.name);
      setIsDropdownVisible(false);
    } catch (error) {
      console.error('Error in product creation:', error);
      toast({
        title: "Error",
        description: "Failed to add new product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <Input
        placeholder={brandId ? "Enter product name..." : "Select a brand first"}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
        className="w-full"
        disabled={!brandId || isLoading}
      />
      {isDropdownVisible && (suggestions.length > 0 || showAddNew) && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectProduct(suggestion);
              }}
            >
              {suggestion.name}
            </div>
          ))}
          {showAddNew && (
            <div
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-gray-700"
              onMouseDown={(e) => {
                e.preventDefault();
                handleAddNewProduct();
              }}
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
