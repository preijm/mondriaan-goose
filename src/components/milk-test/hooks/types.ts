
export interface ProductDetails {
  brand_id?: string;
  brand_name?: string;
  product_name?: string;
  product_name_id?: string | null;
  is_barista?: boolean;
  property_names?: string[];
  flavor_names?: string[];
}

export interface UseProductRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (productId: string, brandId: string) => void;
  editProductId?: string;
  productDetails?: ProductDetails;
}

export interface FormState {
  brandId: string;
  productName: string;
  nameId: string | null;
  selectedProductTypes: string[];
  isBarista: boolean;
  selectedFlavors: string[];
  isSubmitting: boolean;
}

export interface FormSetters {
  setBrandId: (id: string) => void;
  setProductName: (name: string) => void;
  setNameId: (id: string | null) => void;
  setSelectedProductTypes: (types: string[]) => void;
  setIsBarista: (isBarista: boolean) => void;
  setSelectedFlavors: (flavors: string[]) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export interface Flavor {
  id: string;
  name: string;
  key: string;
}

export interface ToastFunction {
  (props: { title: string; description?: string; variant?: "default" | "destructive" }): void;
}

export interface ProductSubmitParams {
  brandId: string;
  productName: string;
  nameId: string | null;
  selectedProductTypes: string[];
  isBarista: boolean;
  selectedFlavors: string[];
  toast: ToastFunction;
  onSuccess: (productId: string, brandId: string) => void;
  onOpenChange: (open: boolean) => void;
  editProductId?: string;
}

export interface ProductSubmitResult {
  productId: string | null;
  brandId?: string;
  isDuplicate: boolean;
}
