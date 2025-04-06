
import { FormState } from "../types";
import { validateForm } from "../validation";
import { useFieldTracking } from "./useFieldTracking";
import { useSubmissionState } from "./useSubmissionState";
import { useFieldValidation } from "./useFieldValidation";
import { useFormActions } from "./useFormActions";

export const useFormSubmission = (formState: FormState) => {
  // Get states and functions from our extracted hooks
  const { validateField } = useFieldValidation();
  
  const { 
    markAllFieldsTouched, 
    isFieldTouched, 
    markFieldTouched,
    getFieldError,
    setFieldError,
    resetFieldTracking
  } = useFieldTracking();

  const submissionState = useSubmissionState();

  // Form validation wrapper that updates field errors
  const validateFormWrapper = () => {
    // Special cases that shouldn't show errors at all:
    // 1. Service selector (handled separately in UI)
    // 2. Quantity unit (automatically selected)
    
    const validationError = validateForm(formState);
    
    // Validate individual fields and set errors
    const formFields: (keyof FormState)[] = [
      'storageProvince', 'storageCity', 'originProvince', 'originCity',
      'destinationProvince', 'destinationCity', 'estimatedStorageTime',
      'productType', 'description', 'presentation', 'quantity', 
      'cargoValue', 'shippingTime'
    ];
    
    formFields.forEach(field => {
      if (isFieldTouched(field)) {
        const fieldError = validateField(field, formState);
        setFieldError(field as string, fieldError);
      }
    });
    
    return validationError;
  };

  // Get form actions with dependencies
  const formActions = useFormActions({
    formState,
    updateSubmissionState: submissionState.updateSubmissionState,
    validateFormWrapper,
    resetFieldTracking
  });

  // Custom submit handler that marks all fields as touched
  const handleSubmit = async (e: React.FormEvent) => {
    // Mark all fields as touched when submitting
    markAllFieldsTouched();
    return formActions.handleSubmit(e);
  };

  return {
    ...submissionState,
    ...formActions,
    handleSubmit, // Override handleSubmit to include markAllFieldsTouched
    validateForm: validateFormWrapper,
    // Field tracking
    isFieldTouched,
    markFieldTouched,
    getFieldError,
    resetFieldTracking, // Make sure to include this in the return object
  };
};
