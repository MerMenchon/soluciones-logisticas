
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StorageAlertProps {
  show: boolean;
}

const StorageAlert = ({ show }: StorageAlertProps) => {
  if (!show) return null;
  
  return (
    <Alert variant="destructive" className="mt-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        No hay servicio de almacenamiento disponible en esta ciudad
      </AlertDescription>
    </Alert>
  );
};

export default StorageAlert;
