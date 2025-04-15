
import React, { useEffect } from "react";
import { useFormContext } from "@/contexts/form/FormContext";
import { useToast } from "@/hooks/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingMessage from "./success/LoadingMessage";
import ConfirmationMessage from "./success/ConfirmationMessage";
import SuccessDialog from "./success/SuccessDialog";
import SubmitRequestHandler from "./success/SubmitRequestHandler";

interface SuccessMessageProps {
  open: boolean;
  onClose: () => void;
}

const SuccessMessage = ({ open, onClose }: SuccessMessageProps) => {
  const { toast } = useToast();
  const { 
    webhookResponse, 
    isWaitingForResponse, 
    resetForm, 
    showSuccessConfirmation,
    updateSubmissionState
  } = useFormContext();
  
  // Logging for debugging
  useEffect(() => {
    console.log("SuccessMessage - showSuccessConfirmation:", showSuccessConfirmation);
    console.log("SuccessMessage - open:", open);
  }, [showSuccessConfirmation, open]);

  // Handle successful submission
  const handleSubmitSuccess = () => {
    console.log("Setting showSuccessConfirmation to true");
    updateSubmissionState({
      showResponseDialog: true,
      showSuccessConfirmation: true
    });
    
    // Reset form when "Enviar solicitud" is clicked
    resetForm();
  };

  // Handle dialog close with form reset
  const handleDialogClose = () => {
    console.log("handleDialogClose called");
    if (!isWaitingForResponse) {
      onClose();
      resetForm();
    }
  };

  // Display loading message while waiting for response
  if (isWaitingForResponse) {
    console.log("Showing loading message");
    return (
      <SuccessDialog 
        open={open}
        onOpenChange={(isOpen) => {
          console.log("Loading dialog onOpenChange:", isOpen);
          if (!isOpen) onClose();
        }}
        hideCloseButton={true}
      >
        <LoadingMessage />
      </SuccessDialog>
    );
  }
  
  // Display confirmation message after form is successfully submitted
  if (showSuccessConfirmation) {
    console.log("Showing success confirmation message");
    return (
      <SuccessDialog 
        open={open}
        onOpenChange={(isOpen) => {
          console.log("Success dialog onOpenChange:", isOpen);
          // We don't want to close the dialog automatically
          // Only the button will trigger the close
        }}
        hideCloseButton={false}
        preventAutoClose={true} // Prevent auto-closing this dialog
      >
        <ConfirmationMessage />
        
        <DialogFooter className="mt-6">
          <Button
            onClick={handleDialogClose}
            className="w-full bg-agri-primary hover:bg-agri-dark text-white"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </SuccessDialog>
    );
  }

  // Display response dialog with cost information
  return (
    <SuccessDialog 
      open={open}
      onOpenChange={(isOpen) => {
        console.log("Response dialog onOpenChange:", isOpen);
        if (!isOpen) onClose();
      }}
    >
      <SubmitRequestHandler 
        webhookResponse={webhookResponse}
        onClose={onClose}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </SuccessDialog>
  );
};

export default SuccessMessage;
