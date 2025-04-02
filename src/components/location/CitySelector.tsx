
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location } from "@/data/locations";
import { useFormContext } from "@/contexts/FormContext";
import { Badge } from "@/components/ui/badge";

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
  const { selectedService } = useFormContext();
  
  // Filter cities based on storage availability if this is a storage selector
  const filteredCities = type === "storage" 
    ? cities.filter(city => city.hasStorage)
    : cities;
  
  // Determine if we should show storage availability based on selected service type
  const shouldShowStorageInfo = 
    selectedService === "both" && (type === "origin" || type === "destination");

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
          {filteredCities.length === 0 && !isLoading && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              {type === "storage" 
                ? "No hay ciudades con almacenamiento disponible en esta provincia" 
                : "No hay ciudades disponibles para esta provincia"}
            </div>
          )}
          {filteredCities.map((city) => (
            <SelectItem key={city.ciudad} value={city.ciudad} className="flex justify-between">
              <div className="flex items-center justify-between w-full">
                <span>{city.ciudad}</span>
                {(type !== "storage" && shouldShowStorageInfo) && city.hasStorage && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                    Almacenamiento
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
