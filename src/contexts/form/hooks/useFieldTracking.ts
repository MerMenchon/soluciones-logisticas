
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
      validateField(fieldName);
    }
  };
  
  // Method to check if a field is touched
  const isFieldTouched = (fieldName: string): boolean => {
    return !!submissionState.touchedFields[fieldName];
  };
  
  // Enhanced method to get a field's error
  // Only show errors if:
  // 1. Form was submitted, OR
  // 2. Field has been touched AND has been validated AND still has an error
  // 3. Never show errors for fields with values unless form is submitted
  const getFieldError = (fieldName: string): string | null => {
    const error = submissionState.validationResult.errors[fieldName] || null;
    const fieldTouched = submissionState.touchedFields[fieldName];
    
    // If form was submitted, show all errors
    if (submissionState.formSubmitted) {
      return error;
    }
    
    // For fields that haven't been explicitly touched by the user,
    // don't show errors even if validation detected an issue
    if (!fieldTouched) {
      return null;
    }
    
    // Only show errors for touched fields that have errors
    return error;
  };

  // Method to handle value change and validation in one step
  const handleFieldValueChange = (fieldName: string, value: any, setter: (value: any) => void) => {
    // First set the value using the provided setter
    setter(value);
    
    // If the field has a value that isn't empty/null/undefined,
    // don't mark it as touched to avoid showing validation errors
    if (value !== "" && value !== null && value !== undefined) {
      // Don't mark as touched for non-empty values
    } else {
      // Only mark empty fields as touched
      setFieldTouched(fieldName);
    }
    
    // Don't validate immediately to avoid showing errors
  };

  return {
    setFieldTouched,
    isFieldTouched,
    validateOnBlur,
    getFieldError,
    handleFieldValueChange
  };
};
