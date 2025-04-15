
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  hideCloseButton?: boolean;
}

const SuccessDialog = ({ 
  open, 
  onOpenChange, 
  children, 
  hideCloseButton = false 
}: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md" 
        hideCloseButton={hideCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
