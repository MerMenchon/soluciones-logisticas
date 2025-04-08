
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/contexts/form";
import { sendConfirmation } from "@/contexts/form/hooks/useWebhook";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface SuccessMessageProps {
  open: boolean;
  onClose: () => void;
}

const LoadingMessage = () => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-agri-primary mb-6"
      >
        <Loader size={60} strokeWidth={1.5} className="animate-spin" />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-semibold text-agri-primary mb-3"
      >
        Procesando su consulta
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg text-muted-foreground text-center max-w-md"
      >
        Por favor espere mientras recibimos la respuesta...
      </motion.p>
    </div>
  );
};

// This function checks if the value is a valid number to format, otherwise returns the string as-is
const formatValue = (value: string | undefined): string => {
  if (!value) return '0';
  
  // Check if it's a numeric string we can format
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    return numValue.toLocaleString('es-AR');
  }
  
  // If it's not a number, return the original string (like "Servicio no solicitado")
  return value;
};

const SuccessMessage = ({ open, onClose }: SuccessMessageProps) => {
  const { toast } = useToast();
  const { webhookResponse, isWaitingForResponse, resetForm } = useFormContext();
  
  // Display loading message while waiting for response
  if (isWaitingForResponse) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Procesando</DialogTitle>
            <DialogDescription className="text-center">
              Espere por favor...
            </DialogDescription>
          </DialogHeader>
          <LoadingMessage />
        </DialogContent>
      </Dialog>
    );
  }
  
  // Clean up the title by removing extra quotes if they exist
  const cleanTitle = webhookResponse?.titulo 
    ? webhookResponse.titulo.replace(/^"(.+)"$/, '$1') 
    : "¡Consulta enviada!";
  
  // Check if we have cost information to display
  const hasCostInfo = webhookResponse?.CostoTotal || 
                     webhookResponse?.CostoTotalAlmacenamiento || 
                     webhookResponse?.CostoTotalTransporte ||
                     webhookResponse?.costoTotalIndividual ||
                     webhookResponse?.CostoTotalIndividual ||
                     webhookResponse?.precio;
  
  // Get the individual cost value from either capitalization version
  const individualCost = webhookResponse?.CostoTotalIndividual || webhookResponse?.costoTotalIndividual;
  
  // Function to determine if a value should be displayed with $ symbol 
  // (only for numeric values, not for messages like "Servicio no solicitado")
  const shouldShowCurrencySymbol = (value: string | undefined): boolean => {
    if (!value) return false;
    return !isNaN(parseFloat(value));
  };
  
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
      
      toast({
        title: "Solicitud enviada",
        description: "Su solicitud ha sido enviada exitosamente."
      });
      
      // Close dialog
      onClose();
      
    } catch (error) {
      console.error("Error sending confirmation:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar su solicitud. Por favor intente de nuevo.",
        variant: "destructive"
      });
    }
  };
  
  // Handle closing dialog (optionally send confirmation with false)
  const handleClose = async () => {
    console.log("Closing dialog");
    try {
      // Send confirmation with confirmacion: false
      await sendConfirmation(
        webhookResponse?.id,
        webhookResponse?.submissionDate,
        false
      );
      
      // Close dialog
      onClose();
      
    } catch (error) {
      console.error("Error sending cancel confirmation:", error);
      // Still close the dialog even if there's an error
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-agri-primary">
            {cleanTitle}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {webhookResponse?.mensaje || "Gracias por su consulta. Nos pondremos en contacto con usted a la brevedad."}
          </DialogDescription>
        </DialogHeader>

        {hasCostInfo && (
          <Card className="border-2 border-agri-primary/20 bg-agri-primary/5">
            <CardContent className="pt-6">
              {webhookResponse?.CostoTotal && (
                <div className="text-center mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Costo Total:</div>
                  <div className="text-4xl font-bold text-agri-primary">
                    {shouldShowCurrencySymbol(webhookResponse.CostoTotal) ? '$' : ''}
                    {formatValue(webhookResponse.CostoTotal)}
                  </div>
                </div>
              )}

              {(webhookResponse?.CostoTotalAlmacenamiento || webhookResponse?.CostoTotalTransporte) && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {webhookResponse?.CostoTotalAlmacenamiento && (
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Almacenamiento:</div>
                      <div className="text-lg font-semibold text-agri-primary">
                        {shouldShowCurrencySymbol(webhookResponse.CostoTotalAlmacenamiento) ? '$' : ''}
                        {formatValue(webhookResponse.CostoTotalAlmacenamiento)}
                      </div>
                    </div>
                  )}
                  
                  {webhookResponse?.CostoTotalTransporte && (
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Transporte:</div>
                      <div className="text-lg font-semibold text-agri-primary">
                        {shouldShowCurrencySymbol(webhookResponse.CostoTotalTransporte) ? '$' : ''}
                        {formatValue(webhookResponse.CostoTotalTransporte)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {individualCost && (
                <div className="text-center mt-4 pt-4 border-t border-agri-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Costo por unidad:</div>
                  <div className="text-lg font-semibold text-agri-primary">
                    {shouldShowCurrencySymbol(individualCost) ? '$' : ''}
                    {formatValue(individualCost)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cerrar
          </Button>
          
          <Button
            className="w-full sm:w-auto bg-agri-primary hover:bg-agri-dark text-white order-1 sm:order-2"
            onClick={handleSubmitRequest}
          >
            Enviar solicitud
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessMessage;
