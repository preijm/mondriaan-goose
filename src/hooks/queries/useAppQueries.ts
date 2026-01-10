import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Generic query hook with standardized error handling
const useAppQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) => {
  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

// Protected query hook that requires authentication
const useProtectedQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return useAppQuery(
    queryKey,
    async () => {
      try {
        return await queryFn();
      } catch (error: unknown) {
        const err = error as { message?: string; status?: number };
        if (err?.message?.includes('JWT') || err?.status === 401) {
          navigate('/auth');
        }
        throw error;
      }
    },
    {
      enabled: !!user,
      ...options
    }
  );
};

// Brands query
export const useBrands = () => {
  return useAppQuery(
    ['brands'],
    async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  );
};

// Properties query
export const useProperties = () => {
  return useAppQuery(
    ['properties'],
    async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('ordering', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  );
};

// Flavors query
export const useFlavors = () => {
  return useAppQuery(
    ['flavors'],
    async () => {
      const { data, error } = await supabase
        .from('flavors')
        .select('*')
        .order('ordering', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  );
};

// Countries query
export const useCountries = () => {
  return useAppQuery(
    ['countries'],
    async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  );
};

// User's milk tests (protected)
export const useUserMilkTests = (sortConfig: { column: string; direction: 'asc' | 'desc' }) => {
  return useProtectedQuery(
    ['user-milk-tests', JSON.stringify(sortConfig)],
    async () => {
      const { data, error } = await supabase
        .from('milk_tests_view')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });
      
      if (error) throw error;
      return data || [];
    }
  );
};

// Aggregated results (public)
export const useAggregatedResults = (sortConfig: { column: string; direction: 'asc' | 'desc' }) => {
  return useAppQuery(
    ['aggregated-results', JSON.stringify(sortConfig)],
    async () => {
      const { data, error } = await supabase
        .from('milk_tests_view')
        .select('brand_id, brand_name, product_id, product_name, property_names, is_barista, flavor_names, rating, price_quality_ratio');
      
      if (error) throw error;
      if (!data) return [];

      // Type for grouped data
      interface GroupedProduct {
        product_id: string;
        brand_id: string;
        brand_name: string;
        product_name: string;
        property_names: string[] | null;
        is_barista: boolean;
        flavor_names: string[] | null;
        ratings: number[];
        price_quality_ratios: string[];
      }

      // Group by product and calculate averages
      const groupedData = data.reduce<Record<string, GroupedProduct>>((acc, test) => {
        const key = test.product_id;
        if (!key) return acc;
        if (!acc[key]) {
          acc[key] = {
            product_id: test.product_id!,
            brand_id: test.brand_id!,
            brand_name: test.brand_name!,
            product_name: test.product_name!,
            property_names: test.property_names,
            is_barista: test.is_barista!,
            flavor_names: test.flavor_names,
            ratings: [],
            price_quality_ratios: []
          };
        }
        if (test.rating !== null) {
          acc[key].ratings.push(test.rating);
        }
        if (test.price_quality_ratio) {
          acc[key].price_quality_ratios.push(test.price_quality_ratio);
        }
        return acc;
      }, {});

      // Calculate averages and format results
      const results = Object.values(groupedData).map((group) => ({
        product_id: group.product_id,
        brand_id: group.brand_id,
        brand_name: group.brand_name,
        product_name: group.product_name,
        property_names: group.property_names,
        is_barista: group.is_barista,
        flavor_names: group.flavor_names,
        avg_rating: group.ratings.reduce((sum, rating) => sum + rating, 0) / group.ratings.length,
        count: group.ratings.length
      }));

      // Sort results
      type ResultItem = typeof results[number];
      return results.sort((a: ResultItem, b: ResultItem) => {
        const aValue = a[sortConfig.column as keyof ResultItem];
        const bValue = b[sortConfig.column as keyof ResultItem];
        
        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
  );
};

// Product details
export const useProductTests = (productId: string | null, sortConfig: { column: string; direction: 'asc' | 'desc' }) => {
  return useAppQuery(
    ['product-tests', productId, JSON.stringify(sortConfig)],
    async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from('milk_tests_view')
        .select('*')
        .eq('product_id', productId)
        .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });
      
      if (error) throw error;
      return data || [];
    },
    {
      enabled: !!productId
    }
  );
};