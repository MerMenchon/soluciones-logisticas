import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormState, WebhookResponse } from "../types";
import { validateForm, validateFormFields, ValidationResult } from "../validation";
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
    validationResult: { isValid: true, errors: {} }
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields and update validation state
    const validationResult = validateFieldsWrapper();
    
    if (!validationResult.isValid) {
      // Don't proceed with submission if there are validation errors
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

      // Commented out success toast
      // toast({
      //   title: "Éxito",
      //   description: "Su consulta ha sido procesada correctamente",
      // });

      updateSubmissionState({ 
        isSubmitting: false,
        isWaitingForResponse: false,
        webhookResponse: responseData 
      });
    } catch (error) {
      // Commented out error toast
      // toast({
      //   title: "Error",
      //   description: "No se pudo enviar la consulta. Por favor, inténtelo de nuevo.",
      //   variant: "destructive",
      // });

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
  };
};
