import React from "react";
import { MilkTestResult } from "@/types/milk-test";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ChevronRight } from "lucide-react";
import { ProductPropertyBadges } from "@/components/milk-test/ProductPropertyBadges";
import { Badge } from "@/components/ui/badge";
import { getScoreBadgeVariant } from "@/lib/scoreUtils";
import { formatScore } from "@/lib/scoreFormatter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MyResultsGridProps {
  results: MilkTestResult[];
  onEdit: (result: MilkTestResult) => void;
  onDelete: (id: string) => void;
}

export const MyResultsGrid = ({
  results,
  onEdit,
  onDelete
}: MyResultsGridProps) => {
  
  
  const getPictureUrl = (picturePath: string | null | undefined) => {
    if (!picturePath) return null;
    return supabase.storage.from('milk-pictures').getPublicUrl(picturePath).data.publicUrl;
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No test results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map(result => {
        return (
          <Card 
            key={result.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white"
            onClick={() => onEdit(result)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Brand Section */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Brand</p>
                    <h3 className="font-semibold text-lg text-gray-900">{result.brand_name}</h3>
                  </div>
                  
                  {/* Product Section */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Product</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-lg text-gray-900">{result.product_name}</h4>
                      {result.is_barista && <ProductPropertyBadges isBarista={result.is_barista} compact={true} displayType="barista" />}
                      <ProductPropertyBadges propertyNames={result.property_names} flavorNames={result.flavor_names} compact={true} />
                    </div>
                  </div>
                </div>
                
                {/* Score and Tests Section */}
                <div className="flex flex-col items-end gap-3 ml-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Score</p>
                    <Badge variant={getScoreBadgeVariant(Number(result.rating))} className="text-base px-3 py-1">
                      {formatScore(Number(result.rating))}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Tests</p>
                    <div className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700">
                      1
                    </div>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="ml-2">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};