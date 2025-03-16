
import { supabase } from "@/integrations/supabase/client";
import { ProductSearchResult } from "./types";
import { mapToProductSearchResult } from "./basicSearch";

// Search for products with specific properties
export async function performPropertySearch(
  lowercaseSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  // Format the search term for property searching
  const searchWithUnderscores = lowercaseSearchTerm.replace(/\s+/g, '_');
  
  console.log('Performing property search with terms:', {
    formattedSearchTerm: lowercaseSearchTerm,
    searchWithUnderscores
  });
  
  try {
    // Use a simpler query approach with ilike instead of trying to use containment operators
    const { data: propertyResults, error: propertyError } = await supabase
      .from('product_search_view')
      .select('*')
      .or(`property_names.ilike.%${searchWithUnderscores}%,property_names.ilike.%${lowercaseSearchTerm}%`)
      .limit(20);
    
    if (propertyError) {
      console.error('Property search error:', propertyError);
      return; // Return instead of throwing to prevent breaking the entire search
    }
    
    console.log(`Found ${propertyResults?.length || 0} property search results`);
    
    if (propertyResults) {
      for (const item of propertyResults) {
        if (!processedIds.has(item.id)) {
          processedIds.add(item.id);
          combinedResults.push(mapToProductSearchResult(item));
        }
      }
    }
  } catch (error) {
    // Log error but don't throw to allow search to continue with other methods
    console.error('Error in property search:', error);
  }
}

// Barista-specific search
export async function performBaristaSearch(
  lowercaseSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  try {
    const { data: baristaResults, error: baristaError } = await supabase
      .from('product_search_view')
      .select('*')
      .eq('is_barista', true)
      .limit(20);
    
    if (baristaError) {
      console.error('Barista search error:', baristaError);
      return; // Return instead of throwing
    }
    
    if (baristaResults) {
      for (const item of baristaResults) {
        if (!processedIds.has(item.id)) {
          processedIds.add(item.id);
          combinedResults.push(mapToProductSearchResult(item));
        }
      }
    }
  } catch (error) {
    console.error('Error in barista search:', error);
  }
}

// Search for products with specific flavors
export async function performFlavorSearch(
  lowercaseSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  // Format the search term for flavor searching
  const searchWithUnderscores = lowercaseSearchTerm.replace(/\s+/g, '_');
  
  try {
    const { data: flavorResults, error: flavorError } = await supabase
      .from('product_search_view')
      .select('*')
      .or(`flavor_names.ilike.%${searchWithUnderscores}%,flavor_names.ilike.%${lowercaseSearchTerm}%`)
      .limit(20);
    
    if (flavorError) {
      console.error('Flavor search error:', flavorError);
      return; // Return instead of throwing
    }
    
    if (flavorResults) {
      for (const item of flavorResults) {
        if (!processedIds.has(item.id)) {
          processedIds.add(item.id);
          combinedResults.push(mapToProductSearchResult(item));
        }
      }
    }
  } catch (error) {
    console.error('Error in flavor search:', error);
  }
}
