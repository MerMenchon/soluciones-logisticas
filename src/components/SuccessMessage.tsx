import React, { useEffect } from "react";
import { useFormContext } from "@/contexts/form/FormContext";
import { sendConfirmation } from "@/contexts/form/hooks/useWebhook";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingMessage from "./success/LoadingMessage";
import ConfirmationMessage from "./success/ConfirmationMessage";
import ResponseDialog from "./success/ResponseDialog";

interface SuccessMessageProps {
  open: boolean;
  onClose: () => void;
}

const SuccessMessage = ({ open, onClose }: SuccessMessageProps) => {
  const { toast } = useToast();
  const formContext = useFormContext();
  const { 
    webhookResponse, 
    isWaitingForResponse, 
    resetForm, 
    showSuccessConfirmation,
    updateSubmissionState,
    setShowResponseDialog, 
    setShowSuccessConfirmation 
  } = formContext;
  
  // Add effect to close the confirmation dialog after a delay
  useEffect(() => {
    console.log("SuccessMessage - showSuccessConfirmation:", showSuccessConfirmation);
    console.log("SuccessMessage - open:", open);
    
    let timeoutId: NodeJS.Timeout;
    
    if (showSuccessConfirmation && open) {
      console.log("Setting timeout to close dialog after 5 seconds");
      // Set a timeout to close the dialog after 5 seconds (5000ms)
      timeoutId = setTimeout(() => {
        console.log("Auto-closing dialog after timeout");
        onClose();
      }, 5000); // 5 seconds
    }
    
    // Clean up the timeout when the component unmounts or when dependencies change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
   };
  }, [showSuccessConfirmation, open, onClose]);
  
  // Function to handle submit request (send confirmation with true)
  const handleSubmitRequest = async () => {
    console.log("Enviar solicitud clicked");
    try {
      // Send confirmation with confirmacion: true
      await sendConfirmation(
        webhookResponse?.id,
        webhookResponse?.submissionDate,
        true
      );
      
      // Update state to show confirmation message
      console.log("Setting showSuccessConfirmation to true");
      updateSubmissionState({
        showResponseDialog: true,
        showSuccessConfirmation: true
      });
      
      // Reset form when "Enviar solicitud" is clicked
      resetForm();
      
    } catch (error) {
      console.error("Error sending confirmation:", error);
      // Call toast with no arguments
      toast();
      
      // Close dialog
      onClose();
    }
  };
  
  // Handle closing dialog (sends confirmation with false, but doesn't reset the form)
  const handleClose = async () => {
    console.log("Closing dialog without resetting form");
    try {
      // Send confirmation with confirmacion: false
      await sendConfirmation(
        webhookResponse?.id,
        webhookResponse?.submissionDate,
        false
      );
      
      // Close dialog without resetting the form
      onClose();
      
    } catch (error) {
      console.error("Error sending cancel confirmation:", error);
      // Still close the dialog even if there's an error
      onClose();
    }
  };

  // Display loading message while waiting for response
  if (isWaitingForResponse) {
    console.log("Showing loading message");
    return (
      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          console.log("Loading dialog onOpenChange:", isOpen);
          if (!isOpen) onClose();
        }}
      >
        <DialogContent 
          className="sm:max-w-md" 
          hideCloseButton={true} // Hide close button for loading state
        >
          <LoadingMessage />
        </DialogContent>
      </Dialog>
    );
  }
  
  // Display confirmation message after form is successfully submitted
  if (showSuccessConfirmation) {
    console.log("Showing success confirmation message");
    return (
      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          console.log("Success dialog onOpenChange:", isOpen);
          if (!isOpen) {
            onClose();
            resetForm(); // Reset form when the success dialog is closed
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-md"
          hideCloseButton={true} // Hide close button for success confirmation
        >
          <ConfirmationMessage />
          
          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                onClose();
                resetForm(); // Reset form when close button is clicked
              }}
              className="w-full bg-agri-primary hover:bg-agri-dark text-white"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Display response dialog with cost information
  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        console.log("Response dialog onOpenChange:", isOpen);
        if (!isOpen) {
          // Don't reset form here, let the buttons handle that
          onClose();
        }
      }}
    >
      <ResponseDialog 
        webhookResponse={webhookResponse}
        onClose={handleClose}
        onSubmit={handleSubmitRequest}
      />
    </Dialog>
  );
};

export default SuccessMessage;
