
import { supabase } from "@/integrations/supabase/client";
import { ProductSearchResult } from "./types";

// Basic search for product name and brand name
export async function performBasicSearch(
  lowercaseSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  const { data: basicResults, error: basicError } = await supabase
    .from('product_search_view')
    .select('*')
    .or(`product_name.ilike.%${lowercaseSearchTerm}%,brand_name.ilike.%${lowercaseSearchTerm}%`)
    .limit(20);
  
  if (basicError) throw basicError;
  
  if (basicResults) {
    for (const item of basicResults) {
      if (!processedIds.has(item.id)) {
        processedIds.add(item.id);
        combinedResults.push(mapToProductSearchResult(item));
      }
    }
  }
}

// Helper function to map database results to ProductSearchResult
export function mapToProductSearchResult(item: any): ProductSearchResult {
  return {
    id: item.id,
    name: item.product_name,
    brand_id: item.brand_id,
    brand_name: item.brand_name,
    property_names: item.property_names || [],
    flavor_names: item.flavor_names || [],
    is_barista: item.is_barista
  };
}
