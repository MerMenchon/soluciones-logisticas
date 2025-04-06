
import React from "react";
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
  // Handle numeric input validation
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      // Check if value is greater than 0
      if (newValue === '' || parseFloat(newValue) > 0) {
        onValueChange(newValue);
      }
    }
  };

  // Check if the field is touched and has an error
  const touched = isFieldTouched ? isFieldTouched('cargoValue') : false;
  const errorMessage = getFieldError ? getFieldError('cargoValue') : null;
  const hasError = touched && errorMessage;

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
              value={value}
              onChange={handleValueChange}
              onBlur={() => markFieldTouched && markFieldTouched('cargoValue')}
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
