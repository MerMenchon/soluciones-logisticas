
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
  onChange: (value: string, hasStorage?: boolean) => void;
  error?: string | null;
  onBlur?: () => void;
}

const CitySelector = ({
  id,
  value,
  cities,
  provinceValue,
  isLoading,
  type,
  onChange,
  error,
  onBlur
}: CitySelectorProps) => {
  const { selectedService } = useFormContext();
  const [userInteracted, setUserInteracted] = React.useState(false);
  
  // Only show errors if the user has directly interacted with this field
  const shouldShowError = error && userInteracted;
  
  // Filter cities based on storage availability if this is a storage selector
  const filteredCities = type === "storage" 
    ? cities.filter(city => city.hasStorage)
    : cities;
  
  // Determine if we should show storage availability based on selected service type
  const shouldShowStorageInfo = 
    selectedService === "both" && (type === "origin" || type === "destination");

  // Function to handle city selection, passing both city value and storage status
  const handleCitySelect = (cityValue: string) => {
    const selectedCity = cities.find(city => city.ciudad === cityValue);
    onChange(cityValue, selectedCity?.hasStorage || false);
    setUserInteracted(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Ciudad</Label>
      </div>
      <Select 
        value={value} 
        onValueChange={handleCitySelect}
        disabled={!provinceValue || isLoading}
        onOpenChange={(open) => {
          if (open) {
            setUserInteracted(true);
          }
          if (!open && onBlur) onBlur();
        }}
      >
        <SelectTrigger 
          id={id} 
          className={`w-full ${shouldShowError ? 'border-red-500 ring-red-500' : ''}`}
        >
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
      {shouldShowError && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default CitySelector;
