
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flavor } from "./types";

export const useProductFlavors = () => {
  return useQuery({
    queryKey: ['product_flavors'],
    queryFn: async (): Promise<Flavor[]> => {
      const { data, error } = await supabase
        .from('flavors')
        .select('id, name, key')
        .order('ordering', { ascending: true });
      
      if (error) {
        console.error('Error fetching product flavors:', error);
        throw error;
      }
      return data || [];
    }
  });
};
