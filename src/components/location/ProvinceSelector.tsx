
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "@/contexts/form";

interface ProvinceSelectorProps {
  id: string;
  value: string;
  provinces: string[];
  isLoading: boolean;
  onChange: (value: string) => void;
  error?: string | null;
  onBlur?: () => void;
}

const ProvinceSelector = ({
  id,
  value,
  provinces,
  isLoading,
  onChange,
  error,
  onBlur
}: ProvinceSelectorProps) => {
  const { validateField, setFieldTouched } = useFormContext();
  const [userInteracted, setUserInteracted] = React.useState(false);
  
  // Only show errors if the user has directly interacted with this field
  const shouldShowError = error && userInteracted;
  
  const handleProvinceChange = (newValue: string) => {
    // First, change the province
    onChange(newValue);
    
    // Mark that user has interacted with this field
    setUserInteracted(true);
    
    // Determine which field this is based on the id
    const fieldNames: Record<string, string> = {
      'storage-province': 'storageProvince',
      'origin-province': 'originProvince',
      'destination-province': 'destinationProvince'
    };
    
    const fieldName = fieldNames[id];
    if (fieldName) {
      // If a valid value is selected, don't mark as touched
      if (newValue) {
        // Don't mark as touched to avoid showing errors
      } else {
        // Only mark as touched for empty selections
        setFieldTouched(fieldName);
      }
      
      // Always validate immediately to clear any error messages
      validateField(fieldName);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Provincia</Label>
      </div>
      <Select 
        value={value} 
        onValueChange={handleProvinceChange}
        disabled={isLoading}
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
      {shouldShowError && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ProvinceSelector;
