
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormState, WebhookResponse, TouchedFields } from "../types";
import { validateForm, validateFormFields, ValidationResult, validateField } from "../validation";
import { sendToWebhook } from "./useWebhook";
import { prepareFormData } from "./useFormData";

interface SubmissionState {
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

export const useFormSubmission = (formState: FormState) => {
  const { toast } = useToast();
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    formSubmitted: false,
    showConfirmation: false,
    distanceValue: null,
    isWaitingForResponse: false,
    showResponseDialog: false,
    validationResult: { isValid: true, errors: {} },
    touchedFields: {}
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
    
  // New method to mark a field as touched
  const setFieldTouched = (fieldName: string) => {
    updateSubmissionState({
      touchedFields: {
        ...submissionState.touchedFields,
        [fieldName]: true
      }
    });
  };
  
  // Method to check if a field is touched
  const isFieldTouched = (fieldName: string): boolean => {
    return !!submissionState.touchedFields[fieldName];
  };
  
  // Method to get a field's error only if it's been touched
  const getFieldError = (fieldName: string): string | null => {
    if (isFieldTouched(fieldName)) {
      return submissionState.validationResult.errors[fieldName] || null;
    }
    return null;
  };

  // Form validation wrapper
  const validateFormWrapper = () => {
    return validateForm(formState);
  };

  // Field validation wrapper
  const validateFieldsWrapper = () => {
    const result = validateFormFields(formState);
    updateSubmissionState({ validationResult: result });
    
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

  // Single field validation - for immediate feedback
  const validateFieldWrapper = (fieldName: string) => {
    // Only validate if the field has been touched
    if (!isFieldTouched(fieldName)) {
      return submissionState.validationResult;
    }
    
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields and update validation state
    const validationResult = validateFieldsWrapper();
    
    if (!validationResult.isValid) {
      // Don't proceed with submission if there are validation errors
      // All fields are now marked as touched
      return;
    }

    updateSubmissionState({ 
      isSubmitting: true,
      isWaitingForResponse: true,
      showResponseDialog: true
    });

    try {
      // Prepare full form data with proper structure
      const formData = prepareFormData(formState);

      console.log("Sending form data to webhook and waiting for response...");
      
      // Send to webhook and get response
      const webhookResponse = await sendToWebhook(formData);
      
      console.log("Received webhook response:", webhookResponse);

      if (!webhookResponse) {
        throw new Error("No response received from webhook");
      }

      // Extract first item if it's an array (API returns array with one object)
      const responseData = Array.isArray(webhookResponse) ? webhookResponse[0] : webhookResponse;

      updateSubmissionState({ 
        isSubmitting: false,
        isWaitingForResponse: false,
        webhookResponse: responseData 
      });
    } catch (error) {
      updateSubmissionState({ 
        isSubmitting: false,
        isWaitingForResponse: false,
        showResponseDialog: false
      });
    }
  };

  // Dialog close handler
  const handleCloseResponseDialog = () => {
    setShowResponseDialog(false);
  };

  // These functions are maintained for API compatibility
  const confirmRequest = async () => {
    submitForm();
  };

  const cancelRequest = () => {
    updateSubmissionState({ 
      isSubmitting: false,
      isWaitingForResponse: false,
      showResponseDialog: false
    });
  };

  const submitForm = async () => {
    updateSubmissionState({ 
      isSubmitting: true,
      isWaitingForResponse: true,
      showResponseDialog: true
    });

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would typically send the form data to your server
    const formData = prepareFormData(formState);
    console.log("Form data submitted:", formData);

    // Show success message
    toast({
      title: "Éxito",
      description: "Su consulta ha sido enviada correctamente!",
    });

    updateSubmissionState({ 
      formSubmitted: false, 
      isSubmitting: false,
      isWaitingForResponse: false
    });
  };

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
    validateForm: validateFormWrapper,
    validateFields: validateFieldsWrapper,
    validateField: validateFieldWrapper,
    setFieldTouched,
    getFieldError,
    isFieldTouched,
  };
};
