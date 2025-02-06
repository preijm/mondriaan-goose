import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { BrandSelect } from "./milk-test/BrandSelect";
import { CountrySelect } from "./milk-test/CountrySelect";
import { IngredientsSelect } from "./milk-test/IngredientsSelect";
import { RatingSelect } from "./milk-test/RatingSelect";

const countries = [
  { code: "US", name: "United States" },
  { code: "NL", name: "Netherlands" },
  { code: "GB", name: "United Kingdom" },
  { code: "IT", name: "Italy" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "CA", name: "Canada" },
].sort((a, b) => a.name.localeCompare(b.name));

export const AddMilkTest = () => {
  const [rating, setRating] = useState(0);
  const [brand, setBrand] = useState("");
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [notes, setNotes] = useState("");
  const [isBarista, setIsBarista] = useState(false);
  const [country, setCountry] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [allIngredients, setAllIngredients] = useState<string[]>([
    "Milk",
    "Water",
    "Oats",
    "Almonds",
    "Soy",
    "Coconut",
    "Cashews",
    "Rice",
    "Pea Protein",
  ]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoadingBrands(true);
      try {
        console.log("Fetching unique brands...");
        const { data, error } = await supabase
          .from('milk_tests')
          .select('brand')
          .order('brand');

        if (error) throw error;

        if (data) {
          const uniqueBrands = Array.from(new Set(data.map(item => item.brand))).filter(Boolean);
          console.log("Fetched brands:", uniqueBrands);
          setBrands(uniqueBrands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast({
          title: "Error",
          description: "Failed to load brands. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrands();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand || !rating) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add milk tests",
          variant: "destructive",
        });
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userData.user.id)
        .single();

      const { error } = await supabase
        .from('milk_tests')
        .insert({
          brand,
          product_name: productName,
          ingredients,
          country,
          is_barista: isBarista,
          rating,
          notes,
          user_id: userData.user.id,
          username: profileData?.username
        });

      if (error) throw error;

      toast({
        title: "Test added!",
        description: "Your milk taste test has been recorded.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error adding milk test:', error);
      toast({
        title: "Error",
        description: "Failed to add milk test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6 animate-fade-up">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Taste Test</h2>
      
      <BrandSelect
        brand={brand}
        setBrand={setBrand}
        brands={brands}
        isLoadingBrands={isLoadingBrands}
        brandOpen={brandOpen}
        setBrandOpen={setBrandOpen}
      />

      <div>
        <Input
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full"
        />
      </div>

      <IngredientsSelect
        ingredients={ingredients}
        setIngredients={setIngredients}
        allIngredients={allIngredients}
        setAllIngredients={setAllIngredients}
        newIngredient={newIngredient}
        setNewIngredient={setNewIngredient}
      />

      <CountrySelect
        country={country}
        setCountry={setCountry}
        countries={countries}
        countryOpen={countryOpen}
        setCountryOpen={setCountryOpen}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="barista"
          checked={isBarista}
          onCheckedChange={(checked) => setIsBarista(checked as boolean)}
        />
        <label
          htmlFor="barista"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Barista Version
        </label>
      </div>

      <RatingSelect rating={rating} setRating={setRating} />

      <div>
        <Textarea
          placeholder="Tasting notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-cream-300 hover:bg-cream-200 text-milk-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add Result"}
      </Button>
    </form>
  );
};