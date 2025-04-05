
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { useProductTypes } from "@/hooks/useLocationData";

interface ProductTypeSelectorProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  error?: string | null;
  onBlur?: () => void;
}

const ProductTypeSelector = ({ 
  productType, 
  onProductTypeChange,
  error,
  onBlur
}: ProductTypeSelectorProps) => {
  const { data: productTypeOptions = [], isLoading } = useProductTypes();
  const [userInteracted, setUserInteracted] = React.useState(false);

  // Only show error if user has interacted with the component
  const shouldShowError = error && userInteracted;
  
  return (
    <div>
      <label htmlFor="productType" className="block text-sm font-medium text-agri-secondary mb-1">
        Tipo de producto *
      </label>
      <Select
        value={productType}
        onValueChange={(value) => {
          onProductTypeChange(value);
          setUserInteracted(true);
        }}
        onOpenChange={(open) => {
          // When the dropdown opens, mark as interacted
          if (open) {
            setUserInteracted(true);
          }
          // When the dropdown closes, trigger onBlur if provided
          if (!open && onBlur) {
            onBlur();
          }
        }}
      >
        <SelectTrigger 
          id="productType"
          className={`w-full ${shouldShowError ? 'border-red-500 focus:ring-red-500' : ''}`}
          disabled={isLoading}
        >
          <SelectValue placeholder="Seleccione un tipo de producto" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>Cargando tipos de productos...</SelectItem>
          ) : (
            productTypeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {shouldShowError && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ProductTypeSelector;
