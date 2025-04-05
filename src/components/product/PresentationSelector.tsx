
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

interface PresentationSelectorProps {
  presentation: string;
  onPresentationChange: (presentation: string) => void;
  clarification: string;
  onClarificationChange: (clarification: string) => void;
}

const PresentationSelector = ({
  presentation,
  onPresentationChange,
  clarification,
  onClarificationChange,
}: PresentationSelectorProps) => {
  const [presentationOptions, setPresentationOptions] = useState<string[]>([]);
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(true);
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

  // Check if the selected presentation is "Otro"
  const showClarificationInput = presentation === "Otro";

  return (
    <div>
      <label htmlFor="presentation" className="block text-sm font-medium text-agri-secondary mb-1">
        Presentación
      </label>
      <Select 
        value={presentation} 
        onValueChange={onPresentationChange}
        disabled={isLoadingPresentations}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            isLoadingPresentations 
              ? "Cargando tipos de presentación..." 
              : "Seleccione un tipo de presentación"
          } />
        </SelectTrigger>
        <SelectContent>
          {presentationOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
