
import React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StorageOriginOptionProps {
  originCity: string;
  originProvince: string;
  canUseOriginStorage: boolean;
  useOriginAsStorage: boolean;
  isCheckingOrigin: boolean;
  hasOriginStorage: boolean;
  originChecked: boolean;
}

const StorageOriginOption = ({
  originCity,
  originProvince,
  canUseOriginStorage,
  useOriginAsStorage,
  isCheckingOrigin,
  hasOriginStorage,
  originChecked
}: StorageOriginOptionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value="origin" 
        id="storage-origin" 
        disabled={!canUseOriginStorage}
        checked={useOriginAsStorage}
      />
      <Label 
        htmlFor="storage-origin" 
        className={!canUseOriginStorage ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}
      >
        Almacenar en origen: {originCity ? `${originCity}, ${originProvince}` : "Seleccione una ciudad de origen"}
        {originCity && isCheckingOrigin && (
          <span className="block text-xs text-muted-foreground">
            Verificando disponibilidad...
          </span>
        )}
        {originCity && originChecked && !hasOriginStorage && !isCheckingOrigin && (
          <span className="block text-xs text-muted-foreground">
            No hay depósito disponible en esta ubicación
          </span>
        )}
        {originCity && originChecked && hasOriginStorage && (
          <span className="block text-xs text-green-600">
            Depósito disponible
          </span>
        )}
      </Label>
    </div>
  );
};

export default StorageOriginOption;
