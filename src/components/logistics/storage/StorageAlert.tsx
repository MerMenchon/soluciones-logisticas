
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface StorageAlertProps {
  show: boolean;
}

const StorageAlert = ({ show }: StorageAlertProps) => {
  if (!show) return null;
  
  return (
    <Alert className="bg-muted/50 border border-amber-300 mt-4">
      <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
      <AlertDescription>
        Debe elegir alguna ciudad con depósito en origen o destino para continuar.
      </AlertDescription>
    </Alert>
  );
};

export default StorageAlert;
