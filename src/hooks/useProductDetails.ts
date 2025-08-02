import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProductDetails = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['product-details', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      console.log("Fetching product details for ID:", productId);
      
      // Fetch product details with related data
      const { data: product, error } = await supabase
        .from('product_search_view')
        .select('*')
        .eq('id', productId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching product details:', error);
        throw error;
      }
      
      if (!product) {
        console.log('Product not found');
        return null;
      }
      
      console.log("Product details fetched:", product);
      return product;
    },
    enabled: !!productId
  });
};