
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MilkTestResult } from "@/types/milk-test";
import { SortConfig } from "./useAggregatedResults";

export type { SortConfig };

export const useProductTests = (productId: string | null, sortConfig: SortConfig) => {
  return useQuery({
    queryKey: ['milk-tests-details', productId, sortConfig],
    queryFn: async () => {
      if (!productId) return [];
      
      console.log(`Fetching tests for product ID: ${productId}`);
      
      let query = supabase
        .from('milk_tests_view')
        .select('id, created_at, brand_name, product_name, rating, username, notes, shop_name, picture_path, drink_preference, property_names, is_barista, flavor_names, price_quality_ratio, shop_country_code')
        .eq('product_id', productId);
      
      // Add sorting based on sortConfig for all possible columns in the detail view
      const detailSortableColumns = [
        'created_at', 'username', 'rating', 'drink_preference', 'price_quality_ratio', 
        'shop_name', 'notes', 'picture_path'
      ];
      
      if (detailSortableColumns.includes(sortConfig.column)) {
        query = query.order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });
      } else {
        // Default ordering if the current sort column doesn't apply to details
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching product tests:", error);
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} test results`);
      if (data && data.length > 0) {
        console.log("Sample test data:", data[0]);
      }
      
      // Process results to handle anonymous users and ensure brand/product names
      const processedData = (data || []).map(item => {
        const brandName = item.brand_name || "Unknown Brand";
        const productName = item.product_name || "Unknown Product";
        
        return {
          ...item,
          // Display "Anonymous" when username is not available
          username: item.username || "Anonymous",
          // Always ensure brand and product names are populated
          brand_name: brandName,
          product_name: productName
        };
      });
      
      return processedData as MilkTestResult[];
    },
    enabled: !!productId
  });
};
