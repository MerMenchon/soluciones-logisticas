
import { useState, ChangeEvent } from "react";
import { FormState } from "@/contexts/form/types";

interface UseNumericInputProps {
  initialValue: string;
  fieldName: keyof FormState;
  onValueChange: (value: string) => void;
  markFieldTouched?: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
}

export const useNumericInput = ({
  initialValue,
  fieldName,
  onValueChange,
  markFieldTouched,
  resetFieldError
}: UseNumericInputProps) => {
  const [localValue, setLocalValue] = useState(initialValue);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Handle numeric input validation
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      setLocalValue(newValue);
      // Reset any validation errors while typing
      if (resetFieldError) {
        resetFieldError(fieldName as string);
      }
    }
  };

  const handleBlur = () => {
    setHasInteracted(true);
    
    // Only mark as touched and validate on blur
    if (markFieldTouched) {
      markFieldTouched(fieldName);
    }
    
    // Only update if value is valid
    if (localValue === '' || (parseFloat(localValue) > 0)) {
      onValueChange(localValue);
    }
  };

  return {
    localValue,
    hasInteracted,
    handleValueChange,
    handleBlur,
    setLocalValue
  };
};
