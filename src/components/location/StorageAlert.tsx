
import React, { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface StorageAlertProps {
  show: boolean;
}

const StorageAlert = ({ show }: StorageAlertProps) => {
  const { toast } = useToast();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (show && !hasShownToast.current) {
      // Show toast notification instead of inline alert
      toast({
        variant: "destructive",
        title: "No hay almacenamiento",
        description: "No hay servicio de almacenamiento disponible en esta ciudad",
        duration: 3000, // Auto-dismiss after 3 seconds
      });
      hasShownToast.current = true;
    } else if (!show) {
      // Reset the ref when the alert is hidden
      hasShownToast.current = false;
    }
  }, [show, toast]);
  
  // Return null as we're using toast notification instead
  return null;
};

export default StorageAlert;
