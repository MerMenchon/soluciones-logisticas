
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getProvincias, getCiudades, isStorageAvailable, Location } from "@/data/locations";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationSelectorProps {
  type: "origin" | "destination" | "storage";
  provinceValue: string;
  cityValue: string;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string, hasStorage: boolean) => void;
  label: string;
  useAsStorage?: boolean;
  onUseAsStorageChange?: (value: boolean) => void;
}

const LocationSelector = ({
  type,
  provinceValue,
  cityValue,
  onProvinceChange,
  onCityChange,
  label,
  useAsStorage,
  onUseAsStorageChange,
}: LocationSelectorProps) => {
  const [cities, setCities] = useState<Location[]>([]);
  const [hasStorage, setHasStorage] = useState(false);
  const provincias = getProvincias();

  useEffect(() => {
    if (provinceValue) {
      setCities(getCiudades(provinceValue));
    } else {
      setCities([]);
    }
  }, [provinceValue]);

  useEffect(() => {
    if (provinceValue && cityValue) {
      const storageAvailable = isStorageAvailable(provinceValue, cityValue);
      setHasStorage(storageAvailable);
    } else {
      setHasStorage(false);
    }
  }, [provinceValue, cityValue]);

  const handleCityChange = (value: string) => {
    const selectedLocation = cities.find(city => city.ciudad === value);
    onCityChange(value, selectedLocation?.hasStorage || false);
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${type}-provincia`}>{label} - Provincia</Label>
        </div>
        <Select value={provinceValue} onValueChange={onProvinceChange}>
          <SelectTrigger id={`${type}-provincia`} className="w-full">
            <SelectValue placeholder="Seleccione provincia" />
          </SelectTrigger>
          <SelectContent>
            {provincias.map((provincia) => (
              <SelectItem key={provincia} value={provincia}>
                {provincia}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${type}-ciudad`}>{label} - Ciudad</Label>
        </div>
        <Select 
          value={cityValue} 
          onValueChange={handleCityChange}
          disabled={!provinceValue}
        >
          <SelectTrigger id={`${type}-ciudad`} className="w-full">
            <SelectValue placeholder="Seleccione ciudad" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.ciudad} value={city.ciudad}>
                {city.ciudad}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {type !== "storage" && onUseAsStorageChange !== undefined && cityValue && (
        <div className="flex items-start space-x-2 mt-2">
          <Checkbox 
            id={`use-as-storage-${type}`} 
            checked={useAsStorage}
            onCheckedChange={onUseAsStorageChange}
            disabled={!hasStorage}
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor={`use-as-storage-${type}`}
              className={!hasStorage ? "text-muted-foreground" : ""}
            >
              Usar como ubicación de almacenamiento
            </Label>
            {!hasStorage && cityValue && (
              <p className="text-xs text-muted-foreground">
                No hay servicio de almacenamiento disponible en esta ciudad
              </p>
            )}
          </div>
        </div>
      )}

      {type === "storage" && !hasStorage && cityValue && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay servicio de almacenamiento disponible en esta ciudad
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LocationSelector;
