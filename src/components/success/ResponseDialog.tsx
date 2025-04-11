
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent
} from "@/components/ui/dialog";
import CostInfoCard from "./CostInfoCard";
import DetailFields from "./DetailFields";

interface ResponseDialogProps {
  webhookResponse: any;
  onClose: () => void;
  onSubmit: () => void;
}

const ResponseDialog = ({ webhookResponse, onClose, onSubmit }: ResponseDialogProps) => {
  // Clean up the title by removing extra quotes if they exist
  const cleanTitle = webhookResponse?.titulo 
    ? webhookResponse.titulo.replace(/^"(.+)"$/, '$1') 
    : "¡Consulta enviada!";
    
  return (
    <DialogContent 
      className="sm:max-w-md" 
      hideCloseButton={true} // Hide close button for response dialog
    >
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-bold text-agri-primary">
          {cleanTitle}
        </DialogTitle>
        <DialogDescription className="text-center pt-2">
          {webhookResponse?.mensaje || "Gracias por su consulta. Nos pondremos en contacto con usted a la brevedad."}
        </DialogDescription>
      </DialogHeader>

      <CostInfoCard webhookResponse={webhookResponse} />
      <DetailFields webhookResponse={webhookResponse} />

      <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cerrar
        </Button>
        
        <Button
          className="w-full sm:w-auto bg-agri-primary hover:bg-agri-dark text-white order-1 sm:order-2"
          onClick={onSubmit}
        >
          Enviar solicitud
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ResponseDialog;
