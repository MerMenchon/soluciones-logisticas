
import { FormState, WebhookResponse } from "../types";
import { prepareFormData } from "./useFormData";
import { sendToWebhook } from "./useWebhook";
import { useToast } from "@/hooks/use-toast";
import { ValidationResult } from "../validation/types";

export const useFormHandler = (
  formState: FormState,
  validateFields: () => ValidationResult,
  updateSubmission: (updates: Partial<{
    isSubmitting: boolean;
    isWaitingForResponse: boolean;
    showResponseDialog: boolean;
    formSubmitted: boolean;
    webhookResponse?: WebhookResponse;
    validationResult: ValidationResult;
  }>) => void
) => {
  const { toast } = useToast();

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields and update validation state
    const validationResult = validateFields();
    
    // Mark form as submitted to trigger validation display
    updateSubmission({ 
      formSubmitted: true,
      validationResult
    });

    if (!validationResult.isValid) {
      // Don't show toast for validation errors
      return;
    }

    updateSubmission({ 
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

      updateSubmission({ 
        isSubmitting: false,
        isWaitingForResponse: false,
        webhookResponse: responseData 
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al enviar el formulario.",
        duration: 3000,
      });
      
      updateSubmission({ 
        isSubmitting: false,
        isWaitingForResponse: false,
        showResponseDialog: false
      });
    }
  };

  // Dialog close handler
  const handleCloseResponseDialog = () => {
    updateSubmission({ showResponseDialog: false });
  };

  // Form confirmation
  const confirmRequest = async () => {
    submitForm();
  };

  const cancelRequest = () => {
    updateSubmission({ 
      isSubmitting: false,
      isWaitingForResponse: false,
      showResponseDialog: false
    });
  };

  const submitForm = async () => {
    updateSubmission({ 
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
      duration: 3000, // Auto-dismiss after 3 seconds
    });

    // Reset form submitted state so no validation errors show after success
    updateSubmission({ 
      formSubmitted: false, 
      isSubmitting: false,
      isWaitingForResponse: false
    });
  };

  return {
    handleSubmit,
    confirmRequest,
    cancelRequest,
    handleCloseResponseDialog,
    submitForm
  };
};
