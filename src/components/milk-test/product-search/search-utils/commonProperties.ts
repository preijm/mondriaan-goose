
import { supabase } from "@/integrations/supabase/client";
import { ProductSearchResult } from "./types";
import { mapToProductSearchResult } from "./basicSearch";

// Handle common milk properties and special search terms
export async function searchByCommonTerms(
  lowercaseSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  const specialTerms = [
    "oat", "soy", "almond", "coconut", "cashew", "rice", "pea", "hazelnut",
    "organic", "dairy", "lactose", "free", "whole", "skim", "fat",
    "1", "2", "3", "3.5", "4", "0", "semi", 
    "percent", "point", "barista", "full"
  ];
  
  // Check if any special term appears in the search
  const matchedSpecialTerms = specialTerms.filter(term => 
    lowercaseSearchTerm.includes(term)
  );
  
  if (matchedSpecialTerms.length > 0) {
    for (const term of matchedSpecialTerms) {
      const formattedTerm = term.replace(/\./g, '_point_').replace(/%/g, '_percent');
      
      // Try to find products with matching properties or flavors
      const { data: specialResults, error: specialError } = await supabase
        .from('product_search_view')
        .select('*')
        .or(`property_names.cs.{%${formattedTerm}%},flavor_names.cs.{%${formattedTerm}%}`)
        .limit(20);
      
      if (specialError) throw specialError;
      
      if (specialResults) {
        for (const item of specialResults) {
          if (!processedIds.has(item.id)) {
            processedIds.add(item.id);
            combinedResults.push(mapToProductSearchResult(item));
          }
        }
      }
    }
  }
}

// Handle percentage searches with number conversion
export async function searchByPercentage(
  lowercaseSearchTerm: string,
  processedIds: Set<string>,
  combinedResults: ProductSearchResult[]
): Promise<void> {
  if (!lowercaseSearchTerm.includes('%') && !/\d+(\.\d+)?/.test(lowercaseSearchTerm)) return;
  
  // Extract numbers
  const numberMatches = lowercaseSearchTerm.match(/\d+(\.\d+)?/g);
  if (!numberMatches) return;
  
  for (const number of numberMatches) {
    // Format number search terms for property names
    const numberWords = {
      '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
      '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine'
    };
    
    // Convert digit by digit
    let formattedNumber = '';
    for (let i = 0; i < number.length; i++) {
      const char = number[i];
      if (char === '.') {
        formattedNumber += '_point_';
      } else {
        formattedNumber += numberWords[char as keyof typeof numberWords] || char;
      }
    }
    
    // Add _percent to make a complete property name pattern
    const propertyPattern = `${formattedNumber}_percent`;
    
    const { data: percentResults, error: percentError } = await supabase
      .from('product_search_view')
      .select('*')
      .filter('property_names', 'cs', `{%${propertyPattern}%}`)
      .limit(20);
    
    if (percentError) throw percentError;
    
    if (percentResults) {
      for (const item of percentResults) {
        if (!processedIds.has(item.id)) {
          processedIds.add(item.id);
          combinedResults.push(mapToProductSearchResult(item));
        }
      }
    }
  }
}
