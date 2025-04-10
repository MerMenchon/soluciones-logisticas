
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
    <div className={`flex items-start space-x-2 p-3 rounded-md ${useOriginAsStorage ? 'bg-muted/50 border' : ''}`}>
      <RadioGroupItem 
        value="origin" 
        id="storage-origin" 
        disabled={!canUseOriginStorage}
        checked={useOriginAsStorage}
        className="mt-1"
      />
      <div className="grid gap-1">
        <Label 
          htmlFor="storage-origin" 
          className={!canUseOriginStorage ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}
        >
          Almacenar en origen: {originCity ? `${originCity}, ${originProvince}` : "Seleccione una ciudad de origen"}
        </Label>
        
        {originCity && isCheckingOrigin && (
          <span className="block text-xs text-muted-foreground">
            Verificando disponibilidad...
          </span>
        )}
        {originCity && originChecked && !hasOriginStorage && !isCheckingOrigin && (
          <span className="block text-xs text-destructive">
            No hay depósito disponible en esta ubicación
          </span>
        )}
        {originCity && originChecked && hasOriginStorage && (
          <span className="block text-xs text-green-600">
            Depósito disponible
          </span>
        )}
      </div>
    </div>
  );
};

export default StorageOriginOption;
