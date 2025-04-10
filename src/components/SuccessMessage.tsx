import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader, ArrowLeft, Box, Truck, Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/contexts/form/FormContext";
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
      
      <div className="text-center text-lg text-gray-600">
        Estamos enviando su consulta...
      </div>
    </div>
  );
};


const ConfirmationMessage = () => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="text-green-500 mb-6"
      >
        <CheckCircle size={60} strokeWidth={1.5} />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.5 }}
        className="text-2xl font-semibold text-agri-primary mb-3 text-center"
      >
        ¡Solicitud enviada con éxito!
      </motion.h2>
      
   
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

// New function to determine if a cost value should be displayed
const shouldDisplayCost = (value: string | undefined): boolean => {
  if (!value) return false;
  
  // If it's not a parseable number, always display it (like "Servicio no solicitado")
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return true;
  
  // If it's a number, only display if it's not zero
  return numValue !== 0;
};

const SuccessMessage = ({ open, onClose }: SuccessMessageProps) => {
  const { toast } = useToast();
  const formContext = useFormContext();
  const { 
    webhookResponse, 
    isWaitingForResponse, 
    resetForm, 
    showSuccessConfirmation,
    updateSubmissionState,
    setShowResponseDialog, 
    setShowSuccessConfirmation 
  } = formContext;
  
  // Add effect to close the confirmation dialog after a delay
  useEffect(() => {
    console.log("SuccessMessage - showSuccessConfirmation:", showSuccessConfirmation);
    console.log("SuccessMessage - open:", open);
    
    let timeoutId: NodeJS.Timeout;
    
    if (showSuccessConfirmation && open) {
      console.log("Setting timeout to close dialog after 5 seconds");
      // Set a timeout to close the dialog after 5 seconds (5000ms)
      timeoutId = setTimeout(() => {
        console.log("Auto-closing dialog after timeout");
        onClose();
      }, 5000); // 5 seconds
    }
    
    // Clean up the timeout when the component unmounts or when dependencies change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
   };
  }, [showSuccessConfirmation, open, onClose]);
  
  // Display loading message while waiting for response
  if (isWaitingForResponse) {
    console.log("Showing loading message");
    return (
      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          console.log("Loading dialog onOpenChange:", isOpen);
          if (!isOpen) onClose();
        }}
      >
        <DialogContent 
          className="sm:max-w-md" 
          hideCloseButton={true} // Hide close button for loading state
        >
          <LoadingMessage />
        </DialogContent>
      </Dialog>
    );
  }
  
  // Display confirmation message after form is successfully submitted
  if (showSuccessConfirmation) {
    console.log("Showing success confirmation message");
    return (
      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          console.log("Success dialog onOpenChange:", isOpen);
          if (!isOpen) {
            onClose();
            resetForm(); // Reset form when the success dialog is closed
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-md"
          hideCloseButton={true} // Hide close button for success confirmation
        >
          <ConfirmationMessage />
          
          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                onClose();
                resetForm(); // Reset form when close button is clicked
              }}
              className="w-full bg-agri-primary hover:bg-agri-dark text-white"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Clean up the title by removing extra quotes if they exist
  const cleanTitle = webhookResponse?.titulo 
    ? webhookResponse.titulo.replace(/^"(.+)"$/, '$1') 
    : "¡Consulta enviada!";
  
  // Check if we have cost information to display (not zero)
  const hasCostInfo = shouldDisplayCost(webhookResponse?.CostoTotal) || 
                     shouldDisplayCost(webhookResponse?.CostoTotalAlmacenamiento) || 
                     shouldDisplayCost(webhookResponse?.CostoTotalTransporte) ||
                     shouldDisplayCost(webhookResponse?.costoTotalIndividual) ||
                     shouldDisplayCost(webhookResponse?.CostoTotalIndividual) ||
                     shouldDisplayCost(webhookResponse?.precio);
  
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
      
      // Update state to show confirmation message
      console.log("Setting showSuccessConfirmation to true");
      updateSubmissionState({
        showResponseDialog: true,
        showSuccessConfirmation: true
      });
      
    } catch (error) {
      console.error("Error sending confirmation:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar su solicitud. Por favor intente de nuevo.",
        variant: "destructive"
      });
      
      // Close dialog
      onClose();
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
      
      // Reset form when dialog is closed
      resetForm();
      
      // Close dialog
      onClose();
      
    } catch (error) {
      console.error("Error sending cancel confirmation:", error);
      // Still close the dialog and reset the form even if there's an error
      resetForm();
      onClose();
    }
  };

  // Check if data fields exist
  const hasDataFields = webhookResponse?.data && (
    webhookResponse.data.lugarAlmacenamientoTiempo || 
    webhookResponse.data.rutaTransporte || 
    webhookResponse.data.InformacionProducto ||
    webhookResponse.data.fechaInicioEstimada
  );

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        console.log("Response dialog onOpenChange:", isOpen);
        if (!isOpen) {
          resetForm(); // Reset form when dialog is closed
          onClose();
        }
      }}
    >
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

        {hasCostInfo && (
          <Card className="border-2 border-agri-primary/20 bg-agri-primary/5">
            <CardContent className="pt-6">
              {shouldDisplayCost(webhookResponse?.CostoTotal) && (
                <div className="text-center mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Costo Total:</div>
                  <div className="text-4xl font-bold text-agri-primary">
                    {shouldShowCurrencySymbol(webhookResponse?.CostoTotal) ? 'usd ' : ''}
                    {formatValue(webhookResponse?.CostoTotal)}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                {shouldDisplayCost(webhookResponse?.CostoTotalAlmacenamiento) && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Almacenamiento:</div>
                    <div className="text-lg font-semibold text-agri-primary">
                      {shouldShowCurrencySymbol(webhookResponse?.CostoTotalAlmacenamiento) ? 'usd ' : ''}
                      {formatValue(webhookResponse?.CostoTotalAlmacenamiento)}
                    </div>
                  </div>
                )}
                
                {shouldDisplayCost(webhookResponse?.CostoTotalTransporte) && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Transporte:</div>
                    <div className="text-lg font-semibold text-agri-primary">
                      {shouldShowCurrencySymbol(webhookResponse?.CostoTotalTransporte) ? 'usd ' : ''}
                      {formatValue(webhookResponse?.CostoTotalTransporte)}
                    </div>
                  </div>
                )}
              </div>
              
              {shouldDisplayCost(individualCost) && (
                <div className="text-center mt-4 pt-4 border-t border-agri-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Costo por unidad:</div>
                  <div className="text-lg font-semibold text-agri-primary">
                    {shouldShowCurrencySymbol(individualCost) ? 'usd ' : ''}
                    {formatValue(individualCost)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* New section for data fields */}
        {hasDataFields && (
          <div className="mt-6 space-y-4">
            {webhookResponse?.data?.lugarAlmacenamientoTiempo && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-start gap-3">
                  <Box className="h-5 w-5 text-agri-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-agri-secondary">Información sobre el almacenamiento</h4>
                    <p className="text-sm text-gray-600 mt-1">{webhookResponse.data.lugarAlmacenamientoTiempo}</p>
                  </div>
                </div>
              </div>
            )}
            
            {webhookResponse?.data?.rutaTransporte && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-agri-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-agri-secondary">Información sobre el transporte</h4>
                    <p className="text-sm text-gray-600 mt-1">{webhookResponse.data.rutaTransporte}</p>
                  </div>
                </div>
              </div>
            )}
            
            {webhookResponse?.data?.InformacionProducto && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-agri-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-agri-secondary">Información del producto</h4>
                    <p className="text-sm text-gray-600 mt-1">{webhookResponse.data.InformacionProducto}</p>
                  </div>
                </div>
              </div>
            )}
            
            {webhookResponse?.data?.fechaInicioEstimada && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-agri-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-agri-secondary">Fecha estimada de inicio</h4>
                    <p className="text-sm text-gray-600 mt-1">{webhookResponse.data.fechaInicioEstimada}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
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
