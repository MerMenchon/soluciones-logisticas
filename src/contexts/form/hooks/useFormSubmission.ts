
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
}

export const useFormSubmission = (formState: FormState) => {
  const { toast } = useToast();
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    formSubmitted: false,
    showConfirmation: false,
    distanceValue: null,
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

    updateSubmissionState({ isSubmitting: true });

    try {
      // Prepare full form data with proper structure
      const formData = prepareFormData(formState);

      // Send to webhook and get response
      const webhookResponse = await sendToWebhook(formData);

      // Show success message with webhook response details
      toast({
        title: webhookResponse.titulo || "Éxito",
        description: `${webhookResponse.mensaje}\nPrecio aproximado: $${webhookResponse.precio}`,
      });

      updateSubmissionState({ 
        formSubmitted: true, 
        isSubmitting: false,
        webhookResponse 
      });
    } catch (error) {
      // Handle webhook submission error
      console.error("Webhook submission error:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar la consulta. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });

      updateSubmissionState({ isSubmitting: false });
    }
  };

  // These functions are maintained for API compatibility
  const confirmRequest = async () => {
    submitForm();
  };

  const cancelRequest = () => {
    updateSubmissionState({ isSubmitting: false });
  };

  const submitForm = async () => {
    updateSubmissionState({ isSubmitting: true });

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

    updateSubmissionState({ formSubmitted: true, isSubmitting: false });
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
