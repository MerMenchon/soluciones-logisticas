import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { validateForm, getFormData } from "../validation";

// Webhook configuration - you can replace this with your actual webhook URL
const WEBHOOK_URL = "https://webhook.site/your-unique-url"; // Replace with actual webhook

interface SubmissionState {
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  distanceValue: string | null;
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

  // New function to send data to webhook
  const sendToWebhook = async (formData: any) => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Webhook response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending data to webhook:', error);
      throw error;
    }
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
      // Prepare full form data
      const formData = {
        service: {
          type: formState.selectedService,
        },
        locations: {
          storage: {
            province: formState.storageProvince,
            city: formState.storageCity,
          },
          transport: {
            origin: {
              province: formState.originProvince,
              city: formState.originCity,
            },
            destination: {
              province: formState.destinationProvince,
              city: formState.destinationCity,
            },
          },
        },
        product: {
          type: formState.productType,
          category: formState.category,
          description: formState.description,
          presentation: formState.presentation,
          clarification: formState.clarification,
          quantity: {
            value: formState.quantity,
            unit: formState.quantityUnit,
          },
          value: formState.cargoValue,
        },
        shipping: {
          time: formState.shippingTime,
        },
        additionalInfo: formState.additionalInfo,
      };

      // Send to webhook
      await sendToWebhook(formData);

      // Show success message
      toast({
        title: "Éxito",
        description: "Su consulta ha sido enviada correctamente!",
      });

      updateSubmissionState({ 
        formSubmitted: true, 
        isSubmitting: false 
      });
    } catch (error) {
      // Handle webhook submission error
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
