
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchPresentations } from "@/data/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormState } from "@/contexts/form/types";

interface PresentationSelectorProps {
  presentation: string;
  onPresentationChange: (presentation: string) => void;
  clarification: string;
  onClarificationChange: (clarification: string) => void;
  isFieldTouched?: (fieldName: keyof FormState) => boolean;
  getFieldError?: (fieldName: string) => string | null;
  markFieldTouched?: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
}

const PresentationSelector = ({
  presentation,
  onPresentationChange,
  clarification,
  onClarificationChange,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
  resetFieldError
}: PresentationSelectorProps) => {
  const [presentationOptions, setPresentationOptions] = useState<string[]>([]);
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAvailablePresentations = async () => {
      setIsLoadingPresentations(true);
      try {
        const presentations = await fetchPresentations();
        setPresentationOptions(presentations);
      } catch (error) {
        console.error("Error fetching presentations:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tipos de presentación. Usando opciones predeterminadas.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPresentations(false);
      }
    };

    fetchAvailablePresentations();
  }, [toast]);

  // Handle clarification input with 50 character limit
  const handleClarificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newClarification = e.target.value;
    if (newClarification.length <= 50) {
      onClarificationChange(newClarification);
    }
  };
  
  // Handle presentation change
  const handlePresentationChange = (value: string) => {
    if (resetFieldError) {
      resetFieldError('presentation');
    }
    onPresentationChange(value);
    
    // Marcamos como touched pero no establecemos hasInteracted
    if (markFieldTouched) {
      markFieldTouched('presentation');
    }
    
    // No hacemos setHasInteracted(true) aquí para evitar mostrar errores después de seleccionar
  };
  
  const handleBlur = () => {
    // Solo marcamos como touched y validamos en blur
    if (markFieldTouched) {
      markFieldTouched('presentation');
    }
    setHasInteracted(true);
  };

  // Check if the field is touched and has an error
  const touched = isFieldTouched ? isFieldTouched('presentation') : false;
  const errorMessage = getFieldError ? getFieldError('presentation') : null;
  
  // Solo mostrar error después de interactuar y cuando el campo tiene un error
  const hasError = touched && errorMessage && hasInteracted && !presentation;

  // Check if the selected presentation is "Otro"
  const showClarificationInput = presentation === "Otro";

  return (
    <div>
      <label htmlFor="presentation" className="block text-sm font-medium text-agri-secondary mb-1">
        Presentación *
      </label>
      <Select 
        value={presentation} 
        onValueChange={handlePresentationChange}
        onOpenChange={() => {
          // No marcamos como touched al abrir el select
        }}
        disabled={isLoadingPresentations}
      >
        <SelectTrigger 
          className={`w-full ${hasError ? 'border-red-500' : ''}`}
          onBlur={handleBlur}
        >
          <SelectValue placeholder={
            isLoadingPresentations 
              ? "Cargando tipos de presentación..." 
              : "Seleccione un tipo de presentación"
          } />
        </SelectTrigger>
        <SelectContent>
          {presentationOptions.map((option) => (
            <SelectItem 
              key={option} 
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errorMessage}
        </p>
      )}

      {showClarificationInput && (
        <div className="mt-4">
          <label htmlFor="clarification" className="block text-sm font-medium text-agri-secondary mb-1">
            Aclaración
          </label>
          <Input
            id="clarification"
            type="text"
            placeholder="Especifique detalles de la presentación"
            value={clarification}
            onChange={handleClarificationChange}
            maxLength={50}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default PresentationSelector;
