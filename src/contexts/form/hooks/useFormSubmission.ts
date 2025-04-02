
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { validateForm, getFormData } from "../validation";

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

    // Proceed directly to sending the form without distance calculation
    submitForm();
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

  // These functions are maintained for API compatibility
  const confirmRequest = async () => {
    submitForm();
  };

  const cancelRequest = () => {
    updateSubmissionState({ isSubmitting: false });
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
