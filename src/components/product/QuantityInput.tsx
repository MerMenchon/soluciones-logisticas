
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuantityUnits } from "@/hooks/useLocationData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFormContext } from "@/contexts/form";

interface QuantityInputProps {
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  quantityUnit: string;
  onQuantityUnitChange: (unit: string) => void;
  errors?: {
    quantity: string | null;
    quantityUnit: string | null;
  };
  onQuantityBlur?: () => void;
  onQuantityUnitBlur?: () => void;
}

const QuantityInput = ({
  quantity,
  onQuantityChange,
  quantityUnit,
  onQuantityUnitChange,
  errors = { quantity: null, quantityUnit: null },
  onQuantityBlur,
  onQuantityUnitBlur
}: QuantityInputProps) => {
  // Use the React Query hook for quantity units
  const { data: quantityUnitOptions = [], isLoading: isLoadingQuantityUnits } = useQuantityUnits();
  const { setFieldTouched } = useFormContext();

  // Set default quantity unit when options are loaded and no value is selected
  useEffect(() => {
    // Set default quantity unit if options are available and no unit is selected yet
    if (quantityUnitOptions.length > 0 && (!quantityUnit || quantityUnit === "")) {
      onQuantityUnitChange(quantityUnitOptions[0]);
      // Don't mark as touched automatically to avoid validation errors
    }
  }, [quantityUnitOptions, quantityUnit, onQuantityUnitChange]);

  // Handle quantity input validation
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newQuantity === '' || /^\d*\.?\d*$/.test(newQuantity)) {
      // Check if value is greater than 0
      if (newQuantity === '' || parseFloat(newQuantity) > 0) {
        onQuantityChange(newQuantity);
        
        // Mark field as touched when user interacts
        setFieldTouched("quantity");
      }
    }
  };

  // Handle unit change with field tracking
  const handleUnitChange = (value: string) => {
    if (value) {
      onQuantityUnitChange(value);
      setFieldTouched("quantityUnit");
      if (onQuantityUnitBlur) {
        setTimeout(onQuantityUnitBlur, 0);
      }
    }
  };

  // Errors are now controlled by our improved logic in getFieldError
  const displayQuantityError = errors.quantity;
  const displayUnitError = errors.quantityUnit;

  return (
    <div>
      <label htmlFor="quantity" className="block text-sm font-medium text-agri-secondary mb-1">
        Cantidad *
      </label>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-1">
          <Input
            id="quantity"
            placeholder="0.00"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={onQuantityBlur}
            className={`w-32 ${displayQuantityError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            required
          />
          
          {isLoadingQuantityUnits ? (
            <div className="text-sm text-muted-foreground py-2 ml-2">Cargando...</div>
          ) : (
            <ToggleGroup 
              type="single" 
              value={quantityUnit}
              onValueChange={handleUnitChange}
              className={`flex flex-wrap gap-1 ml-2 ${displayUnitError ? 'border-red-500' : ''}`}
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
        
        {displayQuantityError && (
          <p className="text-sm text-red-500">{displayQuantityError}</p>
        )}
        
        {displayUnitError && (
          <p className="text-sm text-red-500">{displayUnitError}</p>
        )}
      </div>
    </div>
  );
};

export default QuantityInput;
