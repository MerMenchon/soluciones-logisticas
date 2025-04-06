
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormState, WebhookResponse } from "../types";
import { validateForm, getFormData } from "../validation";
import { sendToWebhook } from "./useWebhook";
import { prepareFormData } from "./useFormData";
import { useFieldTracking } from "./useFieldTracking";

interface SubmissionState {
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  distanceValue: string | null;
  webhookResponse?: WebhookResponse;
  isWaitingForResponse: boolean;
  showResponseDialog: boolean;
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
  });

  // Use our new field tracking hook
  const { 
    markAllFieldsTouched, 
    isFieldTouched, 
    markFieldTouched,
    getFieldError,
    setFieldError,
    resetFieldTracking
  } = useFieldTracking();

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

  // Validate a specific field
  const validateField = (fieldName: keyof FormState): string | null => {
    switch(fieldName) {
      case 'selectedService':
        return formState.selectedService ? null : "Debe seleccionar un servicio";
      case 'storageProvince':
        if (formState.selectedService === "storage" || formState.selectedService === "both") {
          return formState.storageProvince ? null : "Debe seleccionar provincia de almacenamiento";
        }
        return null;
      case 'storageCity':
        if (formState.selectedService === "storage" || formState.selectedService === "both") {
          return formState.storageCity ? null : "Debe seleccionar ciudad de almacenamiento";
        }
        return null;
      case 'estimatedStorageTime':
        if (formState.selectedService === "storage" || formState.selectedService === "both") {
          return formState.estimatedStorageTime ? null : "Debe ingresar un tiempo estimado de almacenamiento";
        }
        return null;
      case 'originProvince':
        if (formState.selectedService === "transport" || formState.selectedService === "both") {
          return formState.originProvince ? null : "Debe seleccionar provincia de origen";
        }
        return null;
      case 'originCity':
        if (formState.selectedService === "transport" || formState.selectedService === "both") {
          return formState.originCity ? null : "Debe seleccionar ciudad de origen";
        }
        return null;
      case 'destinationProvince':
        if (formState.selectedService === "transport" || formState.selectedService === "both") {
          return formState.destinationProvince ? null : "Debe seleccionar provincia de destino";
        }
        return null;
      case 'destinationCity':
        if (formState.selectedService === "transport" || formState.selectedService === "both") {
          return formState.destinationCity ? null : "Debe seleccionar ciudad de destino";
        }
        return null;
      case 'productType':
        return formState.productType ? null : "Debe seleccionar tipo de producto";
      case 'description':
        if (formState.productType === "Otro") {
          return formState.description.trim() ? null : "La descripción del producto es obligatoria";
        }
        return null;
      case 'presentation':
        return formState.presentation.trim() ? null : "La presentación del producto es obligatoria";
      case 'quantity':
        return formState.quantity && parseFloat(formState.quantity) > 0 
          ? null 
          : "Debe ingresar una cantidad válida (mayor a cero)";
      case 'cargoValue':
        return formState.cargoValue && parseFloat(formState.cargoValue) > 0 
          ? null 
          : "Debe ingresar un valor de carga válido (mayor a cero)";
      case 'shippingTime':
        return formState.shippingTime ? null : "Debe seleccionar una fecha de inicio";
      default:
        return null;
    }
  };

  // Form validation wrapper that updates field errors
  const validateFormWrapper = () => {
    // Special cases that shouldn't show errors at all:
    // 1. Service selector (handled separately in UI)
    // 2. Quantity unit (automatically selected)
    
    const validationError = validateForm(formState);
    
    // Validate individual fields and set errors
    const formFields: (keyof FormState)[] = [
      'storageProvince', 'storageCity', 'originProvince', 'originCity',
      'destinationProvince', 'destinationCity', 'estimatedStorageTime',
      'productType', 'description', 'presentation', 'quantity', 
      'cargoValue', 'shippingTime'
    ];
    
    formFields.forEach(field => {
      if (isFieldTouched(field)) {
        const fieldError = validateField(field);
        setFieldError(field as string, fieldError);
      }
    });
    
    return validationError;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched when submitting
    markAllFieldsTouched();
    
    const validationError = validateFormWrapper();
    if (validationError) {
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
    const formData = getFormData(formState);
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
    
    // Reset field tracking
    resetFieldTracking();
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
    // Field tracking
    isFieldTouched,
    markFieldTouched,
    getFieldError,
  };
};
