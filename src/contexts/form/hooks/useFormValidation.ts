
import { FormState, TouchedFields, ValidationResult } from "../types";
import { validateField, validateForm, validateFormFields } from "../validation";

export const useFormValidation = (
  formState: FormState,
  updateSubmissionState: (updates: Partial<{
    validationResult: ValidationResult;
    touchedFields: TouchedFields;
  }>) => void,
  submissionState: {
    validationResult: ValidationResult;
    touchedFields: TouchedFields;
  }
) => {
  // Form validation wrapper
  const validateFormWrapper = () => {
    return validateForm(formState);
  };

  // Field validation wrapper
  const validateFieldsWrapper = () => {
    const result = validateFormFields(formState);
    updateSubmissionState({ validationResult: result });
    return result;
  };

  // Improved field validation that properly updates the validation state
  // without causing infinite loops
  const validateFieldWrapper = (fieldName: string) => {
    // Get current validation state
    const currentValidation = { ...submissionState.validationResult };
    
    // Validate just this field
    const fieldError = validateField(formState, fieldName);
    
    // Update only this field's error status
    const updatedErrors = {
      ...currentValidation.errors,
      [fieldName]: fieldError
    };
    
    // Check if form is now valid by looking at all errors 
    const hasErrors = Object.values(updatedErrors).some(error => error !== null);
    
    // Create a new validation result object to avoid reference issues
    const newValidation = {
      isValid: !hasErrors,
      errors: updatedErrors
    };
    
    // Only update the state if the validation result has actually changed
    if (JSON.stringify(currentValidation) !== JSON.stringify(newValidation)) {
      updateSubmissionState({ validationResult: newValidation });
    }
    
    return newValidation;
  };

  return {
    validateForm: validateFormWrapper,
    validateFields: validateFieldsWrapper,
    validateField: validateFieldWrapper
  };
};
