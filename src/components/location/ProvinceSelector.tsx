
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProvinceSelectorProps {
  id: string;
  value: string;
  provinces: string[];
  isLoading: boolean;
  onChange: (value: string) => void;
}

const ProvinceSelector = ({
  id,
  value,
  provinces = [], // Provide default empty array
  isLoading,
  onChange,
}: ProvinceSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Provincia</Label>
        {!isLoading && provinces.length === 0 && (
          <span className="text-xs text-destructive">No hay provincias disponibles</span>
        )}
      </div>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading || provinces.length === 0}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={
            isLoading 
              ? "Cargando provincias..." 
              : provinces.length === 0
                ? "No hay provincias disponibles"
                : "Seleccione provincia"
          } />
        </SelectTrigger>
        <SelectContent>
          {provinces.length === 0 && !isLoading && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No hay provincias disponibles
            </div>
          )}
          {provinces.map((provincia) => (
            <SelectItem key={provincia} value={provincia}>
              {provincia}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProvinceSelector;
