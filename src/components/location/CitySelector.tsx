
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location } from "@/data/locations";
import { useFormContext } from "@/contexts/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface CitySelectorProps {
  id: string;
  value: string;
  cities: Location[];
  provinceValue: string;
  isLoading: boolean;
  type: "origin" | "destination" | "storage" | "transport" | "both";
  onChange: (value: string) => void;
}

const CitySelector = ({
  id,
  value,
  cities = [], // Provide default empty array
  provinceValue,
  isLoading,
  type,
  onChange,
}: CitySelectorProps) => {
  const { selectedService } = useFormContext();
  
  // Status message for rendering
  const [statusMessage, setStatusMessage] = useState<string>("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Update status message when cities or loading status changes
  useEffect(() => {
    if (isLoading) {
      setStatusMessage(`Cargando ciudades...`);
    } else if (cities.length === 0 && provinceValue) {
      setStatusMessage("No hay ciudades disponibles para esta provincia");
    } else {
      // Remove count as requested
      setStatusMessage("");
    }
  }, [cities, isLoading, provinceValue]);
  
  // Filter cities based on storage availability if this is a storage selector
  const filteredCities = React.useMemo(() => {
    let cityList = type === "storage" 
      ? cities.filter(city => city.hasStorage)
      : cities;
      
    // Apply search filter if search query exists
    if (searchQuery.trim() !== "") {
      cityList = cityList.filter(city => 
        city.ciudad.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return cityList;
  }, [cities, type, searchQuery]);
  
  // Determine if we should show storage availability based on selected service type
  const shouldShowStorageInfo = 
    selectedService === "both" && (type === "origin" || type === "destination");
    
  // Clear search
  const clearSearch = () => setSearchQuery("");

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
          <div className="px-3-important pt-2 pb-2 sticky top-0 bg-background z-10 border-b">
            <div className="relative">
              <Search className="absolute-important left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8-important h-9 w-full"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute-important right-2 top-2.5 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {filteredCities.length === 0 && !isLoading && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              {searchQuery 
                ? `No se encontraron ciudades para "${searchQuery}"` 
                : type === "storage" 
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
