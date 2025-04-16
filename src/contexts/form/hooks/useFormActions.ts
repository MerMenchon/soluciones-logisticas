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
      showResponseDialog: true,
      showSuccessConfirmation: false
    });

    try {
      // Prepare full form data with proper structure
      const formData = prepareFormData(formState);

      // console.log("Sending form data to webhook and waiting for response...");
      
      // Send to webhook and get response
      const webhookResponse = await sendToWebhook(formData);
      
      // console.log("Webhook response received:", webhookResponse);

      // Update submission state with webhook response
      updateSubmissionState({ 
        isSubmitting: false,
        isWaitingForResponse: false,
        webhookResponse,
        showResponseDialog: true // Ensure dialog stays open
      });
    } catch (error) {
      console.error("Error handling webhook response:", error);
      updateSubmissionState({ 
        isSubmitting: false,
        isWaitingForResponse: false,
        showResponseDialog: false,
        showSuccessConfirmation: false
      });
      
      // Call toast with no arguments
      toast();
    }
  };

  // Dialog close handler
  const handleCloseResponseDialog = () => {
    // console.log("handleCloseResponseDialog called");
    updateSubmissionState({ 
      showResponseDialog: false,
      showSuccessConfirmation: false 
    });
  };

  // Confirm request and submit form
  const confirmRequest = async () => {
    // The actual submission is now handled in the SuccessMessage component
    // This is kept for backward compatibility
    // console.log("Confirm request called");
  };

  // Cancel request
  const cancelRequest = () => {
    // console.log("cancelRequest called");
    updateSubmissionState({ 
      isSubmitting: false,
      isWaitingForResponse: false,
      showResponseDialog: false,
      showSuccessConfirmation: false
    });
  };

  // Reset form function
  const resetForm = () => {
    // console.log("resetForm called in useFormActions");
    // Reset submission state
    updateSubmissionState({
      isSubmitting: false,
      isWaitingForResponse: false,
      showResponseDialog: false,
      webhookResponse: undefined,
      showSuccessConfirmation: false
    });
    
    // Reset field tracking
    resetFieldTracking();
  };

  return {
    handleSubmit,
    confirmRequest,
    cancelRequest,
    handleCloseResponseDialog,
    resetForm
  };
};
