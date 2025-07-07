
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RatingSelect } from "../RatingSelect";
import { ResponsiveNotesArea } from "../ResponsiveNotesArea";
import { PriceInput } from "../PriceInput";
import { ShopSelect } from "../ShopSelect";
import { DrinkPreference } from "../DrinkPreference";
import { ProductInfo } from "./ProductInfo";

interface EditMilkTestFormProps {
  formState: {
    rating: number;
    notes: string;
    shop: string;
    priceQualityRatio: string;
    isSubmitting: boolean;
    picture: File | null;
    picturePreview: string | null;
    priceHasChanged: boolean;
    drinkPreference: string;
  };
  formSetters: {
    setRating: (rating: number) => void;
    setNotes: (notes: string) => void;
    setShop: (shop: string) => void;
    setPriceQualityRatio: (price: string) => void;
    setPicture: (file: File | null) => void;
    setPicturePreview: (url: string | null) => void;
    setPriceHasChanged: (hasChanged: boolean) => void;
    setDrinkPreference: (preference: string) => void;
  };
  brand: string;
  productName?: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

export const EditMilkTestForm = ({
  formState,
  formSetters,
  brand,
  productName,
  onSubmit,
  onCancel,
}: EditMilkTestFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Product Information Card */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm">
        <CardContent className="p-6">
          <ProductInfo brand={brand} productName={productName} />
        </CardContent>
      </Card>

      {/* Rating and Notes Card */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Rating & Notes</h2>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <RatingSelect 
            rating={formState.rating} 
            setRating={formSetters.setRating} 
          />
          <ResponsiveNotesArea
            notes={formState.notes}
            setNotes={formSetters.setNotes}
            picture={formState.picture}
            picturePreview={formState.picturePreview}
            setPicture={formSetters.setPicture}
            setPicturePreview={formSetters.setPicturePreview}
          />
        </CardContent>
      </Card>

      {/* Price-to-Quality Card */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Price-to-Quality Ratio</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <PriceInput 
            price={formState.priceQualityRatio} 
            setPrice={formSetters.setPriceQualityRatio}
            hasChanged={formState.priceHasChanged}
            setHasChanged={formSetters.setPriceHasChanged}
          />
        </CardContent>
      </Card>

      {/* Shop Information Card */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Buying Information</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <ShopSelect
            shop={formState.shop}
            setShop={formSetters.setShop}
          />
        </CardContent>
      </Card>

      {/* Drinking Style Card */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Drinking Style</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <DrinkPreference
            preference={formState.drinkPreference}
            setPreference={formSetters.setDrinkPreference}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={formState.isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="brand"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
};
