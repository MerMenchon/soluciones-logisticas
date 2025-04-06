
import { FormState, WebhookResponse } from "../types";
import { validateForm, getFormData } from "../validation";
import { prepareFormData } from "./useFormData";
import { sendToWebhook } from "./useWebhook";
import { useToast } from "@/hooks/use-toast";
import { SubmissionState } from "./useSubmissionState";

interface FormActionsProps {
  formState: FormState;
  updateSubmissionState: (updates: Partial<SubmissionState>) => void;
  validateFormWrapper: () => string | null;
  resetFieldTracking: () => void;
}

export const useFormActions = ({
  formState,
  updateSubmissionState,
  validateFormWrapper,
  resetFieldTracking
}: FormActionsProps) => {
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    updateSubmissionState({ showResponseDialog: false });
  };

  // Confirm request and submit form
  const confirmRequest = async () => {
    submitForm();
  };

  // Cancel request
  const cancelRequest = () => {
    updateSubmissionState({ 
      isSubmitting: false,
      isWaitingForResponse: false,
      showResponseDialog: false
    });
  };

  // Submit form logic
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
    handleSubmit,
    confirmRequest,
    cancelRequest,
    handleCloseResponseDialog,
    submitForm
  };
};
