
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { validateForm, getFormData } from "../validation";

// Webhook configuration with the specified URL
const WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook-test/recepcionFormulario";

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

  // Function to send data to webhook
  const sendToWebhook = async (formData: any) => {
    try {
      console.log("Sending data to webhook:", JSON.stringify(formData, null, 2));
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Webhook response was not ok: ${response.status}`);
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
      // Prepare full form data with proper structure
      const formData = {
        service: {
          type: formState.selectedService,
        },
        locations: {
          storage: {
            province: formState.selectedService === "storage" || formState.selectedService === "both" ? formState.storageProvince : null,
            city: formState.selectedService === "storage" || formState.selectedService === "both" ? formState.storageCity : null,
            estimatedStorageTime: formState.selectedService === "storage" || formState.selectedService === "both" 
              ? (formState.estimatedStorageTime ? parseInt(formState.estimatedStorageTime) : null) 
              : null
          },
          transport: {
            origin: {
              province: formState.selectedService === "transport" || formState.selectedService === "both" ? formState.originProvince : null,
              city: formState.selectedService === "transport" || formState.selectedService === "both" ? formState.originCity : null,
            },
            destination: {
              province: formState.selectedService === "transport" || formState.selectedService === "both" ? formState.destinationProvince : null,
              city: formState.selectedService === "transport" || formState.selectedService === "both" ? formState.destinationCity : null,
            },
          },
        },
        product: {
          type: formState.productType,
          description: formState.description || null,
          presentation: formState.presentation,
          clarification: formState.clarification || null,
          quantity: {
            value: formState.quantity ? parseFloat(formState.quantity) : null,
            unit: formState.quantityUnit || null,
          },
          value: formState.cargoValue ? parseFloat(formState.cargoValue) : null,
        },
        shipping: {
          time: formState.shippingTime || null,
        },
        additionalInfo: formState.additionalInfo || null,
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
