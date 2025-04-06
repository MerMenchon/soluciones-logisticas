
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormState } from "@/contexts/form/types";

interface ValueInputProps {
  value: string;
  onValueChange: (value: string) => void;
  isFieldTouched?: (fieldName: keyof FormState) => boolean;
  getFieldError?: (fieldName: string) => string | null;
  markFieldTouched?: (fieldName: keyof FormState) => void;
}

const ValueInput = ({ 
  value, 
  onValueChange,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
}: ValueInputProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Handle numeric input validation
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      setLocalValue(newValue);
    }
  };

  const handleBlur = () => {
    setHasInteracted(true);
    markFieldTouched && markFieldTouched('cargoValue');
    
    // Only update if value is valid
    if (localValue === '' || (parseFloat(localValue) > 0)) {
      onValueChange(localValue);
    }
  };

  // Check if the field is touched and has an error
  const touched = isFieldTouched ? isFieldTouched('cargoValue') : false;
  const errorMessage = getFieldError ? getFieldError('cargoValue') : null;
  const hasError = touched && errorMessage && hasInteracted;

  return (
    <div>
      <label htmlFor="value" className="block text-sm font-medium text-agri-secondary mb-1">
        Valor de la carga (USD) *
      </label>
      <div className="flex items-stretch gap-2">
        <div className="w-1/3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              $
            </span>
            <Input
              id="value"
              placeholder="0.00"
              value={localValue}
              onChange={handleValueChange}
              onBlur={handleBlur}
              className={`w-full pl-7 ${hasError ? 'border-red-500' : ''}`}
              required
            />
          </div>
          {hasError && (
            <p className="text-sm text-red-500 mt-1">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueInput;

