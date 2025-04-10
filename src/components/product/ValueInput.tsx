
import React from "react";
import { Input } from "@/components/ui/input";
import { FormState } from "@/contexts/form/types";
import { useNumericInput } from "@/hooks/useNumericInput";
import { cn } from "@/lib/utils";

interface ValueInputProps {
  value: string;
  onValueChange: (value: string) => void;
  isFieldTouched?: (fieldName: keyof FormState) => boolean;
  getFieldError?: (fieldName: string) => string | null;
  markFieldTouched?: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
}

const ValueInput = ({ 
  value, 
  onValueChange,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
  resetFieldError
}: ValueInputProps) => {
  const {
    localValue,
    hasInteracted,
    handleValueChange,
    handleBlur
  } = useNumericInput({
    initialValue: value,
    fieldName: 'cargoValue',
    onValueChange,
    markFieldTouched,
    resetFieldError
  });

  // Check if the field is touched and has an error
  const touched = isFieldTouched ? isFieldTouched('cargoValue') : false;
  const errorMessage = getFieldError ? getFieldError('cargoValue') : null;
  
  // Only show error after interacting (blur) and when the field is touched with an error
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
              usd
            </span>
            <Input
              id="value"
              placeholder="0.00"
              value={localValue}
              onChange={handleValueChange}
              onBlur={handleBlur}
              className={cn("w-full pl-12 leading-normal", hasError ? "border-red-500" : "")}
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
