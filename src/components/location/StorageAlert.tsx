
import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface StorageAlertProps {
  show: boolean;
}

const StorageAlert = ({ show }: StorageAlertProps) => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (show) {
      // Show toast notification instead of inline alert
      toast({
        variant: "destructive",
        title: "No hay almacenamiento",
        description: "No hay servicio de almacenamiento disponible en esta ciudad",
        duration: 3000, // Auto-dismiss after 3 seconds
      });
    }
  }, [show, toast]);
  
  // Return null as we're using toast notification instead
  return null;
};

export default StorageAlert;
