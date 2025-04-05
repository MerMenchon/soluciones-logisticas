
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProvinceSelectorProps {
  id: string;
  value: string;
  provinces: string[];
  isLoading: boolean;
  onChange: (value: string) => void;
  error?: string | null;
}

const ProvinceSelector = ({
  id,
  value,
  provinces,
  isLoading,
  onChange,
  error
}: ProvinceSelectorProps) => {
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
        <SelectTrigger 
          id={id} 
          className={`w-full ${error ? 'border-red-500 ring-red-500' : ''}`}
        >
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
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ProvinceSelector;
