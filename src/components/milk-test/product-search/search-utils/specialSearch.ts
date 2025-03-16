
import { supabase } from "@/integrations/supabase/client";
import { ProductSearchResult } from "./types";
import { mapToProductSearchResult } from "./basicSearch";

// Search specifically for barista products
export async function performBaristaSearch(
  lowercaseSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  if (!lowercaseSearchTerm.includes('barista')) return;
  
  const { data: baristaResults, error: baristaError } = await supabase
    .from('product_search_view')
    .select('*')
    .eq('is_barista', true)
    .limit(20);
  
  if (baristaError) throw baristaError;
  
  if (baristaResults) {
    for (const item of baristaResults) {
      if (!processedIds.has(item.id)) {
        processedIds.add(item.id);
        combinedResults.push(mapToProductSearchResult(item));
      }
    }
  }
}

// Search for specific properties
export async function performPropertySearch(
  formattedSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  const { data: propertyResults, error: propertyError } = await supabase
    .from('product_search_view')
    .select('*')
    .or(`property_names.cs.{%${formattedSearchTerm}%},property_names.cs.{${formattedSearchTerm}%},property_names.cs.{%${formattedSearchTerm}}`)
    .limit(20);
  
  if (propertyError) throw propertyError;
  
  if (propertyResults) {
    for (const item of propertyResults) {
      if (!processedIds.has(item.id)) {
        processedIds.add(item.id);
        combinedResults.push(mapToProductSearchResult(item));
      }
    }
  }
}

// Search for specific flavors
export async function performFlavorSearch(
  formattedSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  const { data: flavorResults, error: flavorError } = await supabase
    .from('product_search_view')
    .select('*')
    .or(`flavor_names.cs.{%${formattedSearchTerm}%},flavor_names.cs.{${formattedSearchTerm}%},flavor_names.cs.{%${formattedSearchTerm}}`)
    .limit(20);
  
  if (flavorError) throw flavorError;
  
  if (flavorResults) {
    for (const item of flavorResults) {
      if (!processedIds.has(item.id)) {
        processedIds.add(item.id);
        combinedResults.push(mapToProductSearchResult(item));
      }
    }
  }
}
