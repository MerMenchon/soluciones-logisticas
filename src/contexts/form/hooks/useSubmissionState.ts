
import { useState } from "react";
import { WebhookResponse } from "../types";

export interface SubmissionState {
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  distanceValue: string | null;
  webhookResponse?: WebhookResponse;
  isWaitingForResponse: boolean;
  showResponseDialog: boolean;
  showSuccessConfirmation: boolean;  // New state for success confirmation
}

export const useSubmissionState = (initialState?: Partial<SubmissionState>) => {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    formSubmitted: false,
    showConfirmation: false,
    distanceValue: null,
    isWaitingForResponse: false,
    showResponseDialog: false,
    showSuccessConfirmation: false,  // Initialize new state
    ...initialState
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
    
  const setShowSuccessConfirmation = (showSuccessConfirmation: boolean) =>
    updateSubmissionState({ showSuccessConfirmation });

  return {
    ...submissionState,
    updateSubmissionState,
    setIsSubmitting,
    setShowConfirmation,
    setDistanceValue,
    setShowResponseDialog,
    setShowSuccessConfirmation,
  };
};
