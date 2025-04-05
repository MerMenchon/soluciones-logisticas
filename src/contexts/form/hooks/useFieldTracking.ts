
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
  };
  
  // Method to validate field on blur - always validates to clear errors if field is now valid
  const validateOnBlur = (fieldName: string) => {
    if (validateField && submissionState.touchedFields[fieldName]) {
      // Get the validation result for this field
      const result = validateField(fieldName);
      
      // Update the UI to reflect the current validation state
      updateSubmissionState({
        validationResult: result
      });
    }
  };
  
  // Method to check if a field is touched
  const isFieldTouched = (fieldName: string): boolean => {
    return !!submissionState.touchedFields[fieldName];
  };
  
  // Method to get a field's error
  // Only show errors if:
  // 1. Form was submitted, OR
  // 2. Field has been touched AND has been validated (e.g., on blur)
  const getFieldError = (fieldName: string): string | null => {
    const error = submissionState.validationResult.errors[fieldName] || null;
    const fieldTouched = submissionState.touchedFields[fieldName];
    
    // Show error if either form was submitted OR field was touched and has an error
    if (submissionState.formSubmitted || (fieldTouched && error)) {
      return error;
    }
    
    // Otherwise, don't show any errors
    return null;
  };

  // Method to handle value change and validation in one step
  const handleFieldValueChange = (fieldName: string, value: any, setter: (value: any) => void) => {
    // First set the value using the provided setter
    setter(value);
    
    // Then mark as touched
    setFieldTouched(fieldName);
    
    // Always validate immediately to clear any errors when the field has been touched
    if (validateField) {
      // We need a small timeout to allow the state to update with the new value
      setTimeout(() => validateField(fieldName), 0);
    }
  };

  return {
    setFieldTouched,
    isFieldTouched,
    validateOnBlur,
    getFieldError,
    handleFieldValueChange
  };
};
