
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location } from "@/data/locations";
import { useFormContext } from "@/contexts/form";
import { Badge } from "@/components/ui/badge";

interface CitySelectorProps {
  id: string;
  value: string;
  cities: Location[];
  provinceValue: string;
  isLoading: boolean;
  type: "origin" | "destination" | "storage" | "transport";
  onChange: (value: string) => void;
}

const CitySelector = ({
  id,
  value,
  cities,
  provinceValue,
  isLoading,
  type,
  onChange,
}: CitySelectorProps) => {
  const { selectedService } = useFormContext();
  
  // Status message for rendering
  const [statusMessage, setStatusMessage] = React.useState<string>("");
  
  // Update status message when cities or loading status changes
  React.useEffect(() => {
    if (isLoading) {
      setStatusMessage(`Cargando ciudades...`);
    } else if (cities.length === 0 && provinceValue) {
      setStatusMessage("No hay ciudades disponibles para esta provincia");
    } else if (cities.length > 0) {
      setStatusMessage(`${cities.length} ciudades disponibles`);
    } else {
      setStatusMessage("");
    }
  }, [cities, isLoading, provinceValue]);
  
  // Filter cities based on storage availability if this is a storage selector
  const filteredCities = React.useMemo(() => {
    return type === "storage" 
      ? cities.filter(city => city.hasStorage)
      : cities;
  }, [cities, type]);
  
  // Determine if we should show storage availability based on selected service type
  const shouldShowStorageInfo = 
    selectedService === "both" && (type === "origin" || type === "destination");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Ciudad</Label>
        {statusMessage && (
          <span className="text-xs text-muted-foreground">{statusMessage}</span>
        )}
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
        <SelectContent className="max-h-80 overflow-y-auto">
          {filteredCities.length === 0 && !isLoading && provinceValue && (
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
