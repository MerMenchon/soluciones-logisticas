
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
    setShowResponseDialog
  } = useSubmissionState();
  
  // Form validation
  const { 
    validateForm,
    validateFields,
    validateField 
  } = useFormValidation(formState, updateSubmissionState, submissionState);
  
  // Field tracking
  const { 
    setFieldTouched,
    isFieldTouched,
    getFieldError 
  } = useFieldTracking(submissionState, updateSubmissionState);
  
  // Form handling
  const { 
    handleSubmit,
    confirmRequest,
    cancelRequest,
    handleCloseResponseDialog
  } = useFormHandler(
    formState,
    validateFields,
    (updates) => updateSubmissionState(updates)
  );

  return {
    ...submissionState,
    setIsSubmitting,
    setShowConfirmation,
    setDistanceValue,
    setShowResponseDialog,
    handleSubmit,
    confirmRequest,
    cancelRequest,
    handleCloseResponseDialog,
    validateForm,
    validateFields,
    validateField,
    setFieldTouched,
    getFieldError,
    isFieldTouched,
  };
};
