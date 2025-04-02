
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProvinceSelectorProps {
  id: string;
  label: string;
  value: string;
  provinces: string[];
  isLoading: boolean;
  onChange: (value: string) => void;
}

const ProvinceSelector = ({
  id,
  label,
  value,
  provinces,
  isLoading,
  onChange,
}: ProvinceSelectorProps) => {
  // Note: The uniqueProvinces Set is no longer needed here as we're already ensuring uniqueness in locations.ts
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label} - Provincia</Label>
      </div>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={isLoading ? "Cargando provincias..." : "Seleccione provincia"} />
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
  );
};

export default ProvinceSelector;
