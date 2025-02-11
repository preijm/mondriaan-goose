
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductType {
  key: string;
  name: string;
  ordering: number;
}

interface ProductOptionsProps {
  isBarista: boolean;
  setIsBarista: (checked: boolean) => void;
  isUnsweetened: boolean;
  setIsUnsweetened: (checked: boolean) => void;
  isSpecialEdition: boolean;
  setIsSpecialEdition: (checked: boolean) => void;
  isNoSugar: boolean;
  setIsNoSugar: (checked: boolean) => void;
}

export const ProductOptions = ({
  isBarista,
  setIsBarista,
  isUnsweetened,
  setIsUnsweetened,
  isSpecialEdition,
  setIsSpecialEdition,
  isNoSugar,
  setIsNoSugar,
}: ProductOptionsProps) => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      const { data } = await supabase
        .from('product_types')
        .select('*')
        .order('ordering', { ascending: true });
      
      if (data) {
        setProductTypes(data);
      }
    };

    fetchProductTypes();

    // Set up realtime subscription
    const channel = supabase
      .channel('product_types_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_types'
        },
        () => {
          fetchProductTypes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getCheckboxState = (key: string) => {
    switch (key) {
      case 'barista':
        return isBarista;
      case 'no_sugar':
        return isNoSugar;
      case 'unsweetened':
        return isUnsweetened;
      case 'special_edition':
        return isSpecialEdition;
      default:
        return false;
    }
  };

  const handleCheckboxChange = (key: string, checked: boolean) => {
    switch (key) {
      case 'barista':
        setIsBarista(checked);
        break;
      case 'no_sugar':
        setIsNoSugar(checked);
        break;
      case 'unsweetened':
        setIsUnsweetened(checked);
        break;
      case 'special_edition':
        setIsSpecialEdition(checked);
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6">
        {productTypes.map((type) => (
          <div key={type.key} className="flex items-center space-x-2">
            <Checkbox
              id={type.key}
              checked={getCheckboxState(type.key)}
              onCheckedChange={(checked) => handleCheckboxChange(type.key, checked as boolean)}
            />
            <label
              htmlFor={type.key}
              className="text-sm leading-none text-gray-600"
            >
              {type.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
