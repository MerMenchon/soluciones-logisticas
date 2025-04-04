
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/contexts/form";

interface SuccessMessageProps {
  onReset: () => void;
}

const LoadingMessage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-agri-primary mb-6"
      >
        <Loader size={80} strokeWidth={1.5} className="animate-spin" />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-semibold text-agri-primary mb-3"
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

const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  const { webhookResponse, isWaitingForResponse, resetForm } = useFormContext();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  // Display loading message while waiting for response
  if (isWaitingForResponse) {
    return <LoadingMessage />;
  }
  
  // Clean up the title by removing extra quotes if they exist
  const cleanTitle = webhookResponse?.titulo 
    ? webhookResponse.titulo.replace(/^"(.+)"$/, '$1') 
    : "¡Consulta enviada!";
  
  // Format price for display, handling it as a string
  const formattedPrice = webhookResponse?.precio 
    ? Number(webhookResponse.precio).toLocaleString('es-AR')
    : '0';
  
  const showPrice = webhookResponse?.precio && webhookResponse.precio !== "0";
  
  // Log the response for debugging
  console.log("Displaying webhook response:", webhookResponse);

  // Function to handle submit request
  const handleSubmitRequest = () => {
    console.log("Enviar solicitud clicked");
    // Here you would implement the actual submission logic
    // For now it's just a placeholder
  };
  
  // Handle returning to the form
  const handleReturnToForm = () => {
    console.log("Returning to form");
    // Call the onReset function passed as prop
    onReset();
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-agri-primary mb-6"
      >
        <CheckCircle size={80} strokeWidth={1.5} />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-semibold text-agri-primary mb-3"
      >
        {cleanTitle}
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg text-muted-foreground text-center max-w-md mb-6"
      >
        {webhookResponse?.mensaje || "Gracias por su consulta. Nos pondremos en contacto con usted a la brevedad para brindarle más información sobre el servicio solicitado."}
      </motion.p>
      
      {showPrice && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="text-sm text-muted-foreground mb-1">Precio aproximado:</div>
          <div className="text-4xl font-bold text-agri-primary">
            ${formattedPrice}
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mt-4"
      >
        <Button
          variant="outline"
          onClick={handleReturnToForm}
          className="order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al formulario
        </Button>
        
        <Button
          className="bg-agri-primary hover:bg-agri-dark text-white order-1 sm:order-2"
          onClick={handleSubmitRequest}
        >
          Enviar solicitud
        </Button>
      </motion.div>
    </div>
  );
};

export default SuccessMessage;
