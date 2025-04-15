
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  hideCloseButton?: boolean;
  preventAutoClose?: boolean;
}

const SuccessDialog = ({ 
  open, 
  onOpenChange, 
  children, 
  hideCloseButton = false,
  preventAutoClose = false
}: SuccessDialogProps) => {
  // Handle dialog state changes
  const handleOpenChange = (open: boolean) => {
    // Only allow closing if not preventing auto-close or if explicitly opened
    if (!preventAutoClose || open) {
      onOpenChange(open);
    }
    // If attempting to close and preventAutoClose is true, do nothing
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleOpenChange}
      // To prevent closing via Escape key when preventAutoClose is true
      onEscapeKeyDown={(e) => {
        if (preventAutoClose) {
          e.preventDefault();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md" 
        hideCloseButton={hideCloseButton}
        // To prevent closing via outside clicks when preventAutoClose is true
        onPointerDownOutside={(e) => {
          if (preventAutoClose) {
            e.preventDefault();
          }
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
