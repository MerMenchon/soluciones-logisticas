
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
  
  // Method to validate field on blur - updated to always clear errors if field is valid
  const validateOnBlur = (fieldName: string) => {
    if (validateField) {
      // Get the validation result for this field
      const result = validateField(fieldName);
      
      // IMPORTANT: Always update the UI whether there's an error or not
      // This ensures the error message disappears when the field value is valid
      updateSubmissionState({
        validationResult: {
          ...result
        }
      });
    }
  };
  
  // Method to check if a field is touched
  const isFieldTouched = (fieldName: string): boolean => {
    return !!submissionState.touchedFields[fieldName];
  };
  
  // Method to get a field's error - updated to show errors based on field state
  const getFieldError = (fieldName: string): string | null => {
    // Only show errors for fields that have been touched
    if (submissionState.touchedFields[fieldName]) {
      return submissionState.validationResult.errors[fieldName] || null;
    }
    
    // If form has been submitted, show all errors
    if (submissionState.formSubmitted) {
      return submissionState.validationResult.errors[fieldName] || null;
    }
    
    return null;
  };

  return {
    setFieldTouched,
    isFieldTouched,
    validateOnBlur,
    getFieldError
  };
};
