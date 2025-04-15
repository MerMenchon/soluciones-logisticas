
import React from "react";
import { WebhookResponse } from "@/contexts/form/types";
import { sendConfirmation } from "@/contexts/form/hooks/useWebhook";
import { useToast } from "@/hooks/use-toast";
import ResponseDialog from "./ResponseDialog";

interface SubmitRequestHandlerProps {
  webhookResponse: WebhookResponse | undefined;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const SubmitRequestHandler = ({ 
  webhookResponse, 
  onClose, 
  onSubmitSuccess 
}: SubmitRequestHandlerProps) => {
  const { toast } = useToast();

  // Function to handle submit request
  const handleSubmitRequest = async () => {
    console.log("Enviar solicitud clicked");
    try {
      // Send confirmation with confirmacion: true
      await sendConfirmation(
        webhookResponse?.id,
        webhookResponse?.submissionDate,
        true
      );
      
      // Call onSubmitSuccess to update parent component state
      onSubmitSuccess();
      
    } catch (error) {
      console.error("Error sending confirmation:", error);
      // Call toast with no arguments
      toast();
      
      // Close dialog
      onClose();
    }
  };
  
  // Handle closing dialog (sends confirmation with false)
  const handleClose = async () => {
    console.log("Closing dialog without resetting form");
    try {
      // Send confirmation with confirmacion: false
      await sendConfirmation(
        webhookResponse?.id,
        webhookResponse?.submissionDate,
        false
      );
      
      // Close dialog
      onClose();
      
    } catch (error) {
      console.error("Error sending cancel confirmation:", error);
      // Still close the dialog even if there's an error
      onClose();
    }
  };

  return (
    <ResponseDialog 
      webhookResponse={webhookResponse}
      onClose={handleClose}
      onSubmit={handleSubmitRequest}
    />
  );
};

export default SubmitRequestHandler;
