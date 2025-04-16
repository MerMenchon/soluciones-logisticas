
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

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
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter provinces based on search query
  const filteredProvinces = React.useMemo(() => {
    if (searchQuery.trim() === "") {
      return provinces;
    }
    
    return provinces.filter(province => 
      province.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [provinces, searchQuery]);

  // Clear search
  const clearSearch = () => setSearchQuery("");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Provincia</Label>
      </div>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={isLoading ? "Cargando provincias..." : "Seleccione provincia"} />
        </SelectTrigger>
        <SelectContent className="max-h-80 overflow-y-auto">
          <div className="px-3-important pt-2 pb-2 sticky top-0 bg-background z-10 border-b">
            <div className="relative">
              <Search className="absolute-important left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar provincia..."
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

          {filteredProvinces.length === 0 && !isLoading && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No se encontraron provincias para "{searchQuery}"
            </div>
          )}
          
          {filteredProvinces.map((provincia) => (
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
