
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuantityUnits } from "@/hooks/useLocationData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface QuantityInputProps {
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  quantityUnit: string;
  onQuantityUnitChange: (unit: string) => void;
}

const QuantityInput = ({
  quantity,
  onQuantityChange,
  quantityUnit,
  onQuantityUnitChange,
}: QuantityInputProps) => {
  // Use the React Query hook for quantity units
  const { data: quantityUnitOptions = [], isLoading: isLoadingQuantityUnits } = useQuantityUnits();

  // Set default quantity unit when options are loaded and no value is selected
  useEffect(() => {
    // Set default quantity unit if options are available and no unit is selected yet
    if (quantityUnitOptions.length > 0 && (!quantityUnit || quantityUnit === "")) {
      onQuantityUnitChange(quantityUnitOptions[0]);
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
      }
    }
  };

  return (
    <div>
      <label htmlFor="quantity" className="block text-sm font-medium text-agri-secondary mb-1">
        Cantidad *
      </label>
      <div className="flex items-center gap-1">
        <Input
          id="quantity"
          placeholder="0.00"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-32"
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
    </div>
  );
};

export default QuantityInput;
