
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuantityUnits } from "@/hooks/useLocationData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormState } from "@/contexts/form/types";
import { useNumericInput } from "@/hooks/useNumericInput";

interface QuantityInputProps {
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  quantityUnit: string;
  onQuantityUnitChange: (unit: string) => void;
  isFieldTouched?: (fieldName: keyof FormState) => boolean;
  getFieldError?: (fieldName: string) => string | null;
  markFieldTouched?: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
}

const QuantityInput = ({
  quantity,
  onQuantityChange,
  quantityUnit,
  onQuantityUnitChange,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
  resetFieldError
}: QuantityInputProps) => {
  const {
    localValue: localQuantity,
    hasInteracted,
    handleValueChange: handleQuantityChange,
    handleBlur
  } = useNumericInput({
    initialValue: quantity,
    fieldName: 'quantity',
    onValueChange: onQuantityChange,
    markFieldTouched,
    resetFieldError
  });

  // Use the React Query hook for quantity units
  const { data: quantityUnitOptions = [], isLoading: isLoadingQuantityUnits } = useQuantityUnits();

  // Set default quantity unit when options are loaded and no value is selected
  useEffect(() => {
    if (quantityUnitOptions.length > 0 && (!quantityUnit || quantityUnit === "")) {
      onQuantityUnitChange(quantityUnitOptions[0]);
    }
  }, [quantityUnitOptions, quantityUnit, onQuantityUnitChange]);

  // Check if the field is touched and has an error
  const touched = isFieldTouched ? isFieldTouched('quantity') : false;
  const errorMessage = getFieldError ? getFieldError('quantity') : null;
  
  // Only show error after interacting (blur) and when the field is touched with an error
  const hasError = touched && errorMessage && hasInteracted;

  // Handle unit change with validation
  const handleUnitChange = (value: string) => {
    if (value) {
      onQuantityUnitChange(value);
    }
  };

  return (
    <div>
      <label htmlFor="quantity" className="block text-sm font-medium text-agri-secondary mb-1">
        Cantidad total *
      </label>
      <div className="flex items-center gap-1">
        <Input
          id="quantity"
          placeholder="0.00"
          value={localQuantity}
          onChange={handleQuantityChange}
          onBlur={handleBlur}
          className={`w-32 ${hasError ? 'border-red-500' : ''}`}
          required
        />
        
        {isLoadingQuantityUnits ? (
          <div className="text-sm text-muted-foreground py-2 ml-2">Cargando...</div>
        ) : (
          <ToggleGroup 
            type="single" 
            value={quantityUnit}
            onValueChange={handleUnitChange}
            className="flex flex-wrap gap-1 ml-2"
          >
            {quantityUnitOptions.map((unit) => (
              <ToggleGroupItem 
                key={unit} 
                value={unit} 
                aria-label={unit}
                variant="bordered"
                className="rounded-md text-xs px-2 py-1 border border-agri-light"
              >
                {unit}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default QuantityInput;
