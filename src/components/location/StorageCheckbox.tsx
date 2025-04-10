
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StorageCheckboxProps {
  id: string;
  checked?: boolean;
  hasStorage: boolean;
  cityValue: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const StorageCheckbox = ({
  id,
  checked,
  hasStorage,
  cityValue,
  onChange,
  disabled = false,
}: StorageCheckboxProps) => {
  if (!onChange) return null;
  
  return (
    <div className="flex items-start space-x-2 mt-2">
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={onChange}
        disabled={!hasStorage || disabled}
      />
      <div className="grid gap-1.5 leading-none">
        <Label 
          htmlFor={id}
          className={(!hasStorage || disabled) ? "text-muted-foreground" : ""}
        >
          Usar como ubicación de almacenamiento
        </Label>
        {!hasStorage && cityValue && (
          <p className="text-xs text-muted-foreground">
            No hay servicio de almacenamiento disponible en esta ciudad
          </p>
        )}
        {disabled && hasStorage && cityValue && (
          <p className="text-xs text-muted-foreground">
            Ya hay otra ubicación seleccionada para almacenamiento
          </p>
        )}
      </div>
    </div>
  );
};

export default StorageCheckbox;
