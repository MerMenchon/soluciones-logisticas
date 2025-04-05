
import { TouchedFields, ValidationResult } from "../types";

export const useFieldTracking = (
  submissionState: {
    touchedFields: TouchedFields;
    validationResult: ValidationResult;
    formSubmitted: boolean;
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
    
    // Only validate field if it's been touched AND form has been submitted once
    if (validateField && submissionState.formSubmitted) {
      validateField(fieldName);
    }
  };
  
  // Method to check if a field is touched
  const isFieldTouched = (fieldName: string): boolean => {
    return !!submissionState.touchedFields[fieldName];
  };
  
  // Method to get a field's error only if form was submitted and field still has error
  const getFieldError = (fieldName: string): string | null => {
    if (submissionState.formSubmitted) {
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
