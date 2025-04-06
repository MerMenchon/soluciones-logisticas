
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuantityUnits } from "@/hooks/useLocationData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormState } from "@/contexts/form/types";

interface QuantityInputProps {
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  quantityUnit: string;
  onQuantityUnitChange: (unit: string) => void;
  isFieldTouched?: (fieldName: keyof FormState) => boolean;
  getFieldError?: (fieldName: string) => string | null;
  markFieldTouched?: (fieldName: keyof FormState) => void;
}

const QuantityInput = ({
  quantity,
  onQuantityChange,
  quantityUnit,
  onQuantityUnitChange,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
}: QuantityInputProps) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Use the React Query hook for quantity units
  const { data: quantityUnitOptions = [], isLoading: isLoadingQuantityUnits } = useQuantityUnits();

  // Set default quantity unit when options are loaded and no value is selected
  useEffect(() => {
    if (quantityUnitOptions.length > 0 && (!quantityUnit || quantityUnit === "")) {
      onQuantityUnitChange(quantityUnitOptions[0]);
    }
  }, [quantityUnitOptions, quantityUnit, onQuantityUnitChange]);

  // Handle quantity input validation
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newQuantity === '' || /^\d*\.?\d*$/.test(newQuantity)) {
      setLocalQuantity(newQuantity);
    }
  };

  const handleBlur = () => {
    setHasInteracted(true);
    markFieldTouched && markFieldTouched('quantity');
    
    // Only update if quantity is valid
    if (localQuantity === '' || (parseFloat(localQuantity) > 0)) {
      onQuantityChange(localQuantity);
    }
  };

  // Check if the field is touched and has an error
  const touched = isFieldTouched ? isFieldTouched('quantity') : false;
  const errorMessage = getFieldError ? getFieldError('quantity') : null;
  const hasError = touched && errorMessage && hasInteracted;

  return (
    <div>
      <label htmlFor="quantity" className="block text-sm font-medium text-agri-secondary mb-1">
        Cantidad *
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
            onValueChange={(value) => {
              if (value) onQuantityUnitChange(value);
            }}
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

