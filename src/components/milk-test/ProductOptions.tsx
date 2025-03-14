
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface ProductOptionsProps {
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
}

export const ProductOptions = ({
  selectedTypes,
  setSelectedTypes,
}: ProductOptionsProps) => {
  const { data: productProperties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .order('ordering', { ascending: true });
      
      return data || [];
    },
  });

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6">
        {productProperties.map((property) => (
          <div key={property.key} className="flex items-center space-x-2">
            <Checkbox
              id={property.key}
              checked={selectedTypes.includes(property.key)}
              onCheckedChange={(checked) => handleTypeChange(property.key, checked as boolean)}
            />
            <label
              htmlFor={property.key}
              className="text-sm leading-none text-gray-600"
            >
              {property.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
