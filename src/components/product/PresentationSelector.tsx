
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface PresentationSelectorProps {
  presentation: string;
  onPresentationChange: (presentation: string) => void;
  clarification: string;
  onClarificationChange: (clarification: string) => void;
  error?: string | null;
}

const PresentationSelector = ({
  presentation,
  onPresentationChange,
  clarification,
  onClarificationChange,
  error
}: PresentationSelectorProps) => {
  const presentationOptions = [
    "Bolsas",
    "Cajas",
    "A granel",
    "Botellas",
    "Latas",
    "Otro",
  ];

  return (
    <div>
      <label htmlFor="presentation" className="block text-sm font-medium text-agri-secondary mb-1">
        Presentación del producto *
      </label>
      <div className="space-y-2">
        <Select
          value={presentation}
          onValueChange={onPresentationChange}
        >
          <SelectTrigger 
            className={`w-full ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          >
            <SelectValue placeholder="Seleccione una presentación" />
          </SelectTrigger>
          <SelectContent>
            {presentationOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {presentation === "Otro" && (
          <Input
            placeholder="Especifique la presentación"
            value={clarification}
            onChange={(e) => onClarificationChange(e.target.value)}
            className="mt-2"
          />
        )}
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default PresentationSelector;
