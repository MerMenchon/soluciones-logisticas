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
  
  // Method to validate field on blur - clears error if field is now valid
  const validateOnBlur = (fieldName: string) => {
    // Only validate if form has been submitted once
    // This ensures we don't show errors while user is still filling the form
    if (validateField && submissionState.formSubmitted) {
      // Get the validation result for this field
      const result = validateField(fieldName);
      
      // Update the UI to reflect the current validation state
      // This ensures errors disappear when the field is fixed
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
  
  // Method to get a field's error - ONLY show errors after form submission
  const getFieldError = (fieldName: string): string | null => {
    // Only show errors if form has been submitted
    if (submissionState.formSubmitted) {
      return submissionState.validationResult.errors[fieldName] || null;
    }
    
    // Otherwise, don't show any errors
    return null;
  };

  return {
    setFieldTouched,
    isFieldTouched,
    validateOnBlur,
    getFieldError
  };
};
