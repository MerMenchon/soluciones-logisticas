
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormState, WebhookResponse } from "../types";
import { validateForm, getFormData } from "../validation";
import { sendToWebhook } from "./useWebhook";
import { prepareFormData } from "./useFormData";

interface SubmissionState {
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  distanceValue: string | null;
  webhookResponse?: WebhookResponse;
  isWaitingForResponse: boolean;
}

export const useFormSubmission = (formState: FormState) => {
  const { toast } = useToast();
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    formSubmitted: false,
    showConfirmation: false,
    distanceValue: null,
    isWaitingForResponse: false,
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

  // Form validation wrapper
  const validateFormWrapper = () => {
    return validateForm(formState);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateFormWrapper();
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    updateSubmissionState({ 
      isSubmitting: true,
      isWaitingForResponse: true
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

      // Show success message with webhook response details
      toast({
        title: responseData.titulo?.replace(/^"(.+)"$/, '$1') || "Éxito",
        description: `${responseData.mensaje}${responseData.precio ? `\nPrecio aproximado: $${responseData.precio}` : ''}`,
      });

      updateSubmissionState({ 
        formSubmitted: true, 
        isSubmitting: false,
        isWaitingForResponse: false,
        webhookResponse: responseData 
      });
    } catch (error) {
      // Handle webhook submission error
      console.error("Webhook submission error:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar la consulta. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });

      updateSubmissionState({ 
        isSubmitting: false,
        isWaitingForResponse: false
      });
    }
  };

  // These functions are maintained for API compatibility
  const confirmRequest = async () => {
    submitForm();
  };

  const cancelRequest = () => {
    updateSubmissionState({ 
      isSubmitting: false,
      isWaitingForResponse: false
    });
  };

  const submitForm = async () => {
    updateSubmissionState({ 
      isSubmitting: true,
      isWaitingForResponse: true
    });

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would typically send the form data to your server
    const formData = getFormData(formState);
    console.log("Form data submitted:", formData);

    // Show success message
    toast({
      title: "Éxito",
      description: "Su consulta ha sido enviada correctamente!",
    });

    updateSubmissionState({ 
      formSubmitted: true, 
      isSubmitting: false,
      isWaitingForResponse: false
    });
  };

  return {
    ...submissionState,
    setIsSubmitting,
    setShowConfirmation,
    setDistanceValue,
    handleSubmit,
    confirmRequest,
    cancelRequest,
    validateForm: validateFormWrapper,
  };
};
