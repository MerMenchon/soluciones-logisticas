
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
  onBlur?: () => void; // Add onBlur prop
}

const ProductTypeSelector = ({ 
  productType, 
  onProductTypeChange,
  error,
  onBlur
}: ProductTypeSelectorProps) => {
  const { data: productTypeOptions = [], isLoading } = useProductTypes();

  return (
    <div>
      <label htmlFor="productType" className="block text-sm font-medium text-agri-secondary mb-1">
        Tipo de producto *
      </label>
      <Select
        value={productType}
        onValueChange={onProductTypeChange}
        onOpenChange={(open) => {
          // When the dropdown closes, trigger onBlur if provided
          if (!open && onBlur) {
            onBlur();
          }
        }}
      >
        <SelectTrigger 
          id="productType"
          className={`w-full ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
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
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ProductTypeSelector;
