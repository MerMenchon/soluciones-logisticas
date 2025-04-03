
import React from "react";
import { RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onReset: () => void;
  isSubmitting: boolean;
  isFormValid: boolean;
}

const FormActions = ({ onReset, isSubmitting, isFormValid }: FormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
      <Button
        type="button"
        variant="outline"
        className="reference-form-button-secondary"
        onClick={onReset}
        disabled={isSubmitting}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Restablecer
      </Button>
      
      <Button
        type="submit"
        className="reference-form-button"
        disabled={isSubmitting || !isFormValid}
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Procesando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Costo aproximado
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;

