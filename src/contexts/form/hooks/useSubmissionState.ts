
import { useState } from "react";
import { TouchedFields, ValidationResult, WebhookResponse } from "../types";

export interface SubmissionState {
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  distanceValue: string | null;
  webhookResponse?: WebhookResponse;
  isWaitingForResponse: boolean;
  showResponseDialog: boolean;
  validationResult: ValidationResult;
  touchedFields: TouchedFields;
}

export const useSubmissionState = () => {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    formSubmitted: false,
    showConfirmation: false,
    distanceValue: null,
    isWaitingForResponse: false,
    showResponseDialog: false,
    validationResult: { isValid: true, errors: {} }, // Start with empty errors
    touchedFields: {} // Start with no touched fields
  });

  const updateSubmissionState = (updates: Partial<SubmissionState>) => {
    setSubmissionState(prev => ({ ...prev, ...updates }));
  };

  const setIsSubmitting = (isSubmitting: boolean) => 
    updateSubmissionState({ isSubmitting });
  
  const setShowConfirmation = (showConfirmation: boolean) => 
    updateSubmissionState({ showConfirmation });
  
  const setDistanceValue = (distanceValue: string | null) => 
    updateSubmissionState({ distanceValue });
    
  const setShowResponseDialog = (showResponseDialog: boolean) =>
    updateSubmissionState({ showResponseDialog });
    
  const setFormSubmitted = (formSubmitted: boolean) =>
    updateSubmissionState({ formSubmitted });

  return {
    submissionState,
    updateSubmissionState,
    setIsSubmitting,
    setShowConfirmation,
    setDistanceValue,
    setShowResponseDialog,
    setFormSubmitted
  };
};
