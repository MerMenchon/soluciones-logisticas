
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, Loader2, ArrowLeft } from "lucide-react";
import { useFormContext } from "@/contexts/form";

interface ConfirmationDialogProps {
  distanceValue: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({ distanceValue, onConfirm, onCancel }: ConfirmationDialogProps) => {
  const { isSubmitting } = useFormContext();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md px-4"
      >
        <Card className="border-agri-primary shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 text-agri-primary">
              <TrendingUp size={40} />
            </div>
            <h2 className="text-2xl font-bold text-agri-primary">Confirmar solicitud</h2>
          </CardHeader>
          
          <CardContent className="px-6">
            <div className="bg-agri-light rounded-lg p-4 mb-4 text-center">
              <p className="text-muted-foreground mb-2">Distancia calculada:</p>
              <p className="text-3xl font-semibold text-agri-primary">{distanceValue} km</p>
            </div>
            
            <p className="text-center text-muted-foreground">
              Por favor confirme su solicitud para continuar con el procesamiento.
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-between pb-6">
            <Button 
              onClick={onCancel}
              disabled={isSubmitting}
              variant="outline"
              className="border-agri-primary text-agri-primary"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </>
              )}
            </Button>
            
            <Button 
              onClick={onConfirm}
              disabled={isSubmitting}
              className="bg-agri-primary hover:bg-agri-dark text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfirmationDialog;
