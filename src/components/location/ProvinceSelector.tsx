
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
  // Create a Set to ensure uniqueness, then convert back to array
  const uniqueProvinces = [...new Set(provinces)];
  
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
          {uniqueProvinces.map((provincia) => (
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
