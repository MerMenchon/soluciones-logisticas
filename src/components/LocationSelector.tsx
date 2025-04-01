
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getProvincias, getCiudades, isStorageAvailable, Location } from "@/data/locations";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
  const [provinces, setProvinces] = useState<string[]>([]);
  const [hasStorage, setHasStorage] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const { toast } = useToast();

  // Fetch provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const provincesData = await getProvincias();
        setProvinces(provincesData);
      } catch (error) {
        console.error("Error loading provinces:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las provincias. Intente nuevamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [toast]);

  // Fetch cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      if (provinceValue) {
        setIsLoadingCities(true);
        try {
          const citiesData = await getCiudades(provinceValue);
          setCities(citiesData);
        } catch (error) {
          console.error("Error loading cities:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar las ciudades. Intente nuevamente.",
            variant: "destructive",
          });
          setCities([]);
        } finally {
          setIsLoadingCities(false);
        }
      } else {
        setCities([]);
      }
    };

    loadCities();
  }, [provinceValue, toast]);

  // Check storage availability when city changes
  useEffect(() => {
    const checkStorageAvailability = async () => {
      if (provinceValue && cityValue) {
        try {
          const storageAvailable = await isStorageAvailable(provinceValue, cityValue);
          setHasStorage(storageAvailable);
        } catch (error) {
          console.error("Error checking storage availability:", error);
          setHasStorage(false);
        }
      } else {
        setHasStorage(false);
      }
    };

    checkStorageAvailability();
  }, [provinceValue, cityValue]);

  const handleCityChange = async (value: string) => {
    const selectedLocation = cities.find(city => city.ciudad === value);
    onCityChange(value, selectedLocation?.hasStorage || false);
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${type}-provincia`}>{label} - Provincia</Label>
        </div>
        <Select 
          value={provinceValue} 
          onValueChange={onProvinceChange}
          disabled={isLoadingProvinces}
        >
          <SelectTrigger id={`${type}-provincia`} className="w-full">
            <SelectValue placeholder={isLoadingProvinces ? "Cargando provincias..." : "Seleccione provincia"} />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((provincia) => (
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
          disabled={!provinceValue || isLoadingCities}
        >
          <SelectTrigger id={`${type}-ciudad`} className="w-full">
            <SelectValue placeholder={
              !provinceValue 
                ? "Primero seleccione provincia" 
                : isLoadingCities 
                  ? "Cargando ciudades..." 
                  : "Seleccione ciudad"
            } />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.ciudad} value={city.ciudad}>
                {city.ciudad} {city.hasStorage && " (Depósito disponible)"}
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
