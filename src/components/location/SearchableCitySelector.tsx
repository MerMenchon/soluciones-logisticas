
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Location } from "@/data/locations";
import { useFormContext } from "@/contexts/form";
import { Badge } from "@/components/ui/badge";

interface SearchableCitySelectorProps {
  id: string;
  value: string;
  cities: Location[];
  provinceValue: string;
  isLoading: boolean;
  type: "origin" | "destination" | "storage" | "transport";
  onChange: (value: string) => void;
}

const SearchableCitySelector = ({
  id,
  value,
  cities,
  provinceValue,
  isLoading,
  type,
  onChange,
}: SearchableCitySelectorProps) => {
  const { selectedService } = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  
  // Filter cities based on search query
  const allFilteredCities = cities.filter(
    (city) => city.ciudad.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter cities based on storage availability if this is a storage selector
  const filteredCities = React.useMemo(() => {
    return type === "storage" 
      ? allFilteredCities.filter(city => city.hasStorage)
      : allFilteredCities;
  }, [allFilteredCities, type]);
  
  // Determine if we should show storage availability based on selected service type
  const shouldShowStorageInfo = 
    selectedService === "both" && (type === "origin" || type === "destination");

  // Update status message when cities or loading status changes
  useEffect(() => {
    if (isLoading) {
      setStatusMessage(`Cargando ciudades...`);
    } else if (cities.length === 0 && provinceValue) {
      setStatusMessage("No hay ciudades disponibles para esta provincia");
    } else {
      setStatusMessage("");
    }
  }, [cities, isLoading, provinceValue]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Ciudad</Label>
        {statusMessage && (
          <span className="text-xs text-muted-foreground">{statusMessage}</span>
        )}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={!provinceValue || isLoading}
          >
            {value ? value : !provinceValue 
              ? "Primero seleccione provincia" 
              : isLoading 
                ? "Cargando ciudades..." 
                : "Seleccione ciudad"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Buscar ciudad..." 
                className="h-9"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            {!provinceValue ? (
              <div className="py-6 text-center text-sm">Primero seleccione provincia</div>
            ) : isLoading ? (
              <div className="py-6 text-center text-sm">Cargando ciudades...</div>
            ) : (
              <>
                <CommandEmpty className="py-6 text-center text-sm">
                  No se encontraron ciudades
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {filteredCities.length === 0 && !isLoading && provinceValue && (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      {type === "storage" 
                        ? "No hay ciudades con almacenamiento disponible en esta provincia" 
                        : "No hay ciudades disponibles para esta provincia"}
                    </div>
                  )}
                  {filteredCities.map((city) => (
                    <CommandItem
                      key={city.ciudad}
                      value={city.ciudad}
                      onSelect={() => {
                        onChange(city.ciudad);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center justify-between"
                    >
                      <span>{city.ciudad}</span>
                      {(type !== "storage" && shouldShowStorageInfo) && city.hasStorage && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                          Almacenamiento
                        </Badge>
                      )}
                      {value === city.ciudad && <Check className="h-4 w-4 ml-2" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchableCitySelector;
