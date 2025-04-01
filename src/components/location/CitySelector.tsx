
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location } from "@/data/locations";

interface CitySelectorProps {
  id: string;
  label: string;
  value: string;
  cities: Location[];
  provinceValue: string;
  isLoading: boolean;
  type: "origin" | "destination" | "storage" | "transport";
  onChange: (value: string) => void;
}

const CitySelector = ({
  id,
  label,
  value,
  cities,
  provinceValue,
  isLoading,
  type,
  onChange,
}: CitySelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label} - Ciudad</Label>
      </div>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={!provinceValue || isLoading}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={
            !provinceValue 
              ? "Primero seleccione provincia" 
              : isLoading 
                ? "Cargando ciudades..." 
                : "Seleccione ciudad"
          } />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.ciudad} value={city.ciudad}>
              {city.ciudad} {type !== "storage" && type !== "transport" && city.hasStorage && " (Depósito disponible)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
