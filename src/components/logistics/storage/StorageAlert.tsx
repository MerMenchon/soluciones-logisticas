
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StorageAlertProps {
  show: boolean;
}

const StorageAlert = ({ show }: StorageAlertProps) => {
  if (!show) return null;
  
  return (
    <Alert className="bg-muted/50 border mt-4">
      <AlertDescription>
        Debe elegir alguna ciudad con depósito en origen o destino para continuar.
      </AlertDescription>
    </Alert>
  );
};

export default StorageAlert;
