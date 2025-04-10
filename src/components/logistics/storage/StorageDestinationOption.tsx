
import React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StorageDestinationOptionProps {
  destinationCity: string;
  destinationProvince: string;
  canUseDestinationStorage: boolean;
  useDestinationAsStorage: boolean;
  isCheckingDestination: boolean;
  hasDestinationStorage: boolean;
  destinationChecked: boolean;
}

const StorageDestinationOption = ({
  destinationCity,
  destinationProvince,
  canUseDestinationStorage,
  useDestinationAsStorage,
  isCheckingDestination,
  hasDestinationStorage,
  destinationChecked
}: StorageDestinationOptionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value="destination" 
        id="storage-destination" 
        disabled={!canUseDestinationStorage}
        checked={useDestinationAsStorage}
      />
      <Label 
        htmlFor="storage-destination" 
        className={!canUseDestinationStorage ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}
      >
        Almacenar en destino: {destinationCity ? `${destinationCity}, ${destinationProvince}` : "Seleccione una ciudad de destino"}
        {destinationCity && isCheckingDestination && (
          <span className="block text-xs text-muted-foreground">
            Verificando disponibilidad...
          </span>
        )}
        {destinationCity && destinationChecked && !hasDestinationStorage && !isCheckingDestination && (
          <span className="block text-xs text-muted-foreground">
            No hay depósito disponible en esta ubicación
          </span>
        )}
        {destinationCity && destinationChecked && hasDestinationStorage && (
          <span className="block text-xs text-green-600">
            Depósito disponible
          </span>
        )}
      </Label>
    </div>
  );
};

export default StorageDestinationOption;
