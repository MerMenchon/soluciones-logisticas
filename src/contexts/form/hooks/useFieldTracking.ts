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
    // Always validate fields on blur when they've been touched
    // This ensures errors disappear when corrected, even if form hasn't been submitted
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
  
  // Method to get a field's error - show errors ONLY after form submission
  // This is the key change - never show errors until explicit form submission
  const getFieldError = (fieldName: string): string | null => {
    // Only show errors if form has been submitted
    if (submissionState.formSubmitted) {
      return submissionState.validationResult.errors[fieldName] || null;
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
