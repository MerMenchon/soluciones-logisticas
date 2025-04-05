
import { FormState, TouchedFields, ValidationResult } from "../types";
import { validateField, validateForm, validateFormFields } from "../validation";

export const useFormValidation = (
  formState: FormState,
  updateSubmissionState: (updates: Partial<{
    validationResult: ValidationResult;
    touchedFields: TouchedFields;
    formSubmitted: boolean;
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

  // Field validation wrapper - validates all fields and marks the form as submitted
  const validateFieldsWrapper = () => {
    const result = validateFormFields(formState);
    
    // Mark form as submitted, which will show all errors
    updateSubmissionState({ 
      validationResult: result,
      formSubmitted: true
    });
    
    // Mark all fields as touched when validating the entire form
    const allTouched = Object.keys(result.errors).reduce((acc, fieldName) => {
      acc[fieldName] = true;
      return acc;
    }, {} as TouchedFields);
    
    updateSubmissionState({
      touchedFields: {
        ...submissionState.touchedFields,
        ...allTouched
      }
    });
    
    return result;
  };

  // Validate a single field when it changes or loses focus
  const validateFieldWrapper = (fieldName: string) => {
    // Get current validation state
    const currentValidation = { ...submissionState.validationResult };
    
    // Validate just this field
    const fieldError = validateField(formState, fieldName);
    
    // Update only this field's error status
    currentValidation.errors = {
      ...currentValidation.errors,
      [fieldName]: fieldError
    };
    
    // Check if form is now valid
    const hasErrors = Object.values(currentValidation.errors).some(error => error !== null);
    currentValidation.isValid = !hasErrors;
    
    // Update state with new validation result
    updateSubmissionState({ validationResult: currentValidation });
    
    return currentValidation;
  };

  return {
    validateForm: validateFormWrapper,
    validateFields: validateFieldsWrapper,
    validateField: validateFieldWrapper
  };
};
