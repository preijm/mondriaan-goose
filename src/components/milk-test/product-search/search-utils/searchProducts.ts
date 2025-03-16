
import { ProductSearchResult } from "./types";
import { performBasicSearch } from "./basicSearch";
import { performBaristaSearch, performPropertySearch, performFlavorSearch } from "./specialSearch";
import { searchByCommonTerms, searchByPercentage } from "./commonProperties";

// Main search function that combines all search strategies
export async function searchProducts(searchTerm: string): Promise<ProductSearchResult[]> {
  if (!searchTerm || searchTerm.length < 2) return [];
  console.log('Searching for products:', searchTerm);

  const lowercaseSearchTerm = searchTerm.toLowerCase();
  const combinedResults: ProductSearchResult[] = [];
  const processedIds = new Set<string>(); // To track already added products

  try {
    // Always start with basic search for product name and brand name
    // This should run regardless of other searches
    await performBasicSearch(lowercaseSearchTerm, processedIds, combinedResults);
    
    // Try to do property, barista, and flavor searches even if basic search found results
    try {
      await performPropertySearch(lowercaseSearchTerm, processedIds, combinedResults);
    } catch (error) {
      console.error('Error in property search (caught):', error);
      // Continue with other searches
    }
    
    // If we're possibly searching for a barista product
    if (lowercaseSearchTerm.includes('barista')) {
      try {
        await performBaristaSearch(lowercaseSearchTerm, processedIds, combinedResults);
      } catch (error) {
        console.error('Error in barista search (caught):', error);
      }
    }
    
    // Try flavor searches
    try {
      await performFlavorSearch(lowercaseSearchTerm, processedIds, combinedResults);
    } catch (error) {
      console.error('Error in flavor search (caught):', error);
    }
    
    // Do additional searches by common terms and percentages
    try {
      await searchByCommonTerms(lowercaseSearchTerm, processedIds, combinedResults);
      await searchByPercentage(lowercaseSearchTerm, processedIds, combinedResults);
    } catch (error) {
      console.error('Error in additional searches (caught):', error);
    }

    console.log(`Found ${combinedResults.length} combined search results`);
    
    // Log sample results for debugging
    if (combinedResults.length > 0) {
      combinedResults.slice(0, 3).forEach((result, index) => {
        console.log(`Result ${index + 1}:`, {
          id: result.id,
          name: result.name,
          brandName: result.brand_name,
          isBarista: result.is_barista,
          propertyNames: result.property_names,
          flavorNames: result.flavor_names
        });
      });
    } else {
      console.log('No results found for search term:', searchTerm);
    }

    return combinedResults;
  } catch (error) {
    console.error('Error searching for products:', error);
    return [];
  }
}
