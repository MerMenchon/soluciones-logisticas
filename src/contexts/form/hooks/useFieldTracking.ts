
import { TouchedFields, ValidationResult } from "../types";

export const useFieldTracking = (
  submissionState: {
    touchedFields: TouchedFields;
    validationResult: ValidationResult;
  },
  updateSubmissionState: (updates: Partial<{
    touchedFields: TouchedFields;
    validationResult: ValidationResult;
  }>) => void,
  validateField?: (fieldName: string) => ValidationResult
) => {
  // Method to mark a field as touched
  const setFieldTouched = (fieldName: string) => {
    updateSubmissionState({
      touchedFields: {
        ...submissionState.touchedFields,
        [fieldName]: true
      }
    });
    
    // Auto-validate field when marked as touched
    if (validateField) {
      validateField(fieldName);
    }
  };
  
  // Method to check if a field is touched
  const isFieldTouched = (fieldName: string): boolean => {
    return !!submissionState.touchedFields[fieldName];
  };
  
  // Method to get a field's error only if it's been touched
  const getFieldError = (fieldName: string): string | null => {
    if (isFieldTouched(fieldName)) {
      return submissionState.validationResult.errors[fieldName] || null;
    }
    return null;
  };

  return {
    setFieldTouched,
    isFieldTouched,
    getFieldError
  };
};
