
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandSelect } from "./BrandSelect";
import { ProductOptions } from "./ProductOptions";
import { IngredientsSelect } from "./IngredientsSelect";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ProductRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (productId: string, brandId: string) => void;
}

export const ProductRegistrationDialog = ({ 
  open, 
  onOpenChange,
  onSuccess
}: ProductRegistrationDialogProps) => {
  // Form state
  const [brandId, setBrandId] = useState("");
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setBrandId("");
      setProductName("");
      setIngredients([]);
      setNewIngredient("");
      setSelectedProductTypes([]);
      setSelectedFlavors([]);
    }
  }, [open]);

  // Fetch flavors
  const { data: flavors = [] } = useQuery({
    queryKey: ['flavors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flavors')
        .select('id, name')
        .order('ordering', { ascending: true });
      
      if (error) {
        console.error('Error fetching flavors:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const handleFlavorToggle = (flavorId: string) => {
    setSelectedFlavors(prev => 
      prev.includes(flavorId) 
        ? prev.filter(id => id !== flavorId)
        : [...prev, flavorId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brandId) {
      toast({
        title: "Missing brand",
        description: "Please select a brand for this product",
        variant: "destructive",
      });
      return;
    }
    
    if (!productName) {
      toast({
        title: "Missing product name",
        description: "Please enter a name for this product",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First check if product already exists with this name and brand
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', productName.trim())
        .eq('brand_id', brandId)
        .maybeSingle();
      
      if (existingProduct) {
        toast({
          title: "Product exists",
          description: "This product already exists in the database",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create the new product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: productName.trim(),
          brand_id: brandId,
          ingredients: ingredients.length > 0 ? ingredients : null,
          product_types: selectedProductTypes.length > 0 ? selectedProductTypes : null
        })
        .select()
        .single();
      
      if (productError) {
        throw productError;
      }
      
      // Add flavors if selected
      if (selectedFlavors.length > 0) {
        const flavorLinks = selectedFlavors.map(flavorId => ({
          product_id: newProduct.id,
          flavor_id: flavorId
        }));
        
        const { error: flavorError } = await supabase
          .from('product_flavors')
          .insert(flavorLinks);
        
        if (flavorError) {
          console.error('Error adding flavors:', flavorError);
          // Continue even if flavor addition fails
        }
      }
      
      toast({
        title: "Product added",
        description: "Your new product has been registered successfully",
      });
      
      onSuccess(newProduct.id, brandId);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to register the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Brand *</h3>
            <BrandSelect
              brandId={brandId}
              setBrandId={setBrandId}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Product Name *</h3>
            <Input
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Product Type</h3>
            <ProductOptions
              selectedTypes={selectedProductTypes}
              setSelectedTypes={setSelectedProductTypes}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Ingredients</h3>
            <IngredientsSelect
              ingredients={ingredients}
              setIngredients={setIngredients}
              allIngredients={allIngredients}
              setAllIngredients={setAllIngredients}
              newIngredient={newIngredient}
              setNewIngredient={setNewIngredient}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Flavors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {flavors.map((flavor) => (
                <div key={flavor.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`flavor-${flavor.id}`}
                    checked={selectedFlavors.includes(flavor.id)}
                    onCheckedChange={() => handleFlavorToggle(flavor.id)}
                  />
                  <Label htmlFor={`flavor-${flavor.id}`}>{flavor.name}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-cream-300 hover:bg-cream-200 text-milk-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
