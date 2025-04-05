
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
    
    // Validate the field if it's been touched
    if (validateField) {
      validateField(fieldName);
    }
  };
  
  // Method to check if a field is touched
  const isFieldTouched = (fieldName: string): boolean => {
    return !!submissionState.touchedFields[fieldName];
  };
  
  // Method to get a field's error only if form was submitted or field was touched
  const getFieldError = (fieldName: string): string | null => {
    // Only show errors if the form was submitted OR the field has been touched
    if (submissionState.formSubmitted || submissionState.touchedFields[fieldName]) {
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
