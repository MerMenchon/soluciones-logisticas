
import { FormState, ValidationResult, WebhookResponse } from "../types";
import { useSubmissionState } from "./useSubmissionState";
import { useFieldTracking } from "./useFieldTracking";
import { useFormValidation } from "./useFormValidation";
import { useFormHandler } from "./useFormHandler";

export const useFormSubmission = (formState: FormState) => {
  // Use the new submission state hook
  const { 
    submissionState, 
    updateSubmissionState,
    setIsSubmitting,
    setShowConfirmation,
    setDistanceValue,
    setShowResponseDialog,
    setFormSubmitted
  } = useSubmissionState();
  
  // Form validation
  const { 
    validateForm,
    validateFields,
    validateField 
  } = useFormValidation(formState, updateSubmissionState, submissionState);
  
  // Field tracking with validation
  const { 
    setFieldTouched,
    isFieldTouched,
    validateOnBlur,
    getFieldError 
  } = useFieldTracking(submissionState, updateSubmissionState, validateField);
  
  // Form handling
  const { 
    handleSubmit,
    confirmRequest,
    cancelRequest,
    handleCloseResponseDialog
  } = useFormHandler(
    formState,
    validateFields,
    (updates) => {
      // Handle the case when updates include validationResult
      if ('validationResult' in updates) {
        const validationUpdate = updates.validationResult as ValidationResult;
        updateSubmissionState({
          ...updates,
          formSubmitted: true,
          validationResult: validationUpdate
        });
      } else {
        updateSubmissionState(updates);
      }
    }
  );

  return {
    ...submissionState,
    setIsSubmitting,
    setShowConfirmation,
    setDistanceValue,
    setShowResponseDialog,
    setFormSubmitted,
    handleSubmit,
    confirmRequest,
    cancelRequest,
    handleCloseResponseDialog,
    validateForm,
    validateFields,
    validateField,
    setFieldTouched,
    validateOnBlur,
    getFieldError,
    isFieldTouched,
  };
};
