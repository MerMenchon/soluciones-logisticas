
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableProvinceSelectorProps {
  id: string;
  value: string;
  provinces: string[];
  isLoading: boolean;
  onChange: (value: string) => void;
}

const SearchableProvinceSelector = ({
  id,
  value,
  provinces,
  isLoading,
  onChange,
}: SearchableProvinceSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter provinces based on search query
  const filteredProvinces = provinces.filter(
    (province) => province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Provincia</Label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {value ? value : isLoading ? "Cargando provincias..." : "Seleccione provincia"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Buscar provincia..." 
                className="h-9"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            {isLoading ? (
              <div className="py-6 text-center text-sm">Cargando provincias...</div>
            ) : (
              <>
                <CommandEmpty className="py-6 text-center text-sm">
                  No se encontraron provincias
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {filteredProvinces.map((province) => (
                    <CommandItem
                      key={province}
                      value={province}
                      onSelect={() => {
                        onChange(province);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center justify-between"
                    >
                      <span>{province}</span>
                      {province === value && <Check className="h-4 w-4" />}
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

export default SearchableProvinceSelector;
