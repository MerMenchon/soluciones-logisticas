
import React from "react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "@/contexts/form";

interface ValueInputProps {
  value: string;
  onValueChange: (value: string) => void;
  error: string | null;
  onBlur?: () => void; // Add onBlur prop
}

const ValueInput = ({ value, onValueChange, error, onBlur }: ValueInputProps) => {
  const { setFieldTouched } = useFormContext();

  // Handle numeric input validation
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      // Check if value is greater than 0
      if (newValue === '' || parseFloat(newValue) > 0) {
        onValueChange(newValue);
        
        // Mark field as touched when user interacts
        setFieldTouched("cargoValue");
      }
    }
  };

  return (
    <div>
      <label htmlFor="value" className="block text-sm font-medium text-agri-secondary mb-1">
        Valor de la carga (USD) *
      </label>
      <div className="flex flex-col space-y-2">
        <div className="flex items-stretch gap-2">
          <div className="w-1/3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <Input
                id="value"
                placeholder="0.00"
                value={value}
                onChange={handleValueChange}
                onBlur={onBlur}
                className={`w-full pl-7 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                required
              />
            </div>
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ValueInput;
