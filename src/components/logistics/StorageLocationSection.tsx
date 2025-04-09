
import React from "react";
import { Warehouse } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import { FormState } from "@/contexts/form/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StorageLocationSectionProps {
  selectedService: string;
  storageProvince: string;
  storageCity: string;
  setStorageProvince: (province: string) => void;
  setStorageCity: (city: string) => void;
  estimatedStorageTime: string;
  setEstimatedStorageTime: (time: string) => void;
  isFieldTouched: (fieldName: keyof FormState) => boolean;
  getFieldError: (fieldName: string) => string | null;
  markFieldTouched: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
  // Additional props for the "both" service option
  useOriginAsStorage?: boolean;
  useDestinationAsStorage?: boolean;
  originProvince?: string;
  originCity?: string;
  destinationProvince?: string;
  destinationCity?: string;
  handleUseOriginAsStorageChange?: (checked: boolean) => void;
  handleUseDestinationAsStorageChange?: (checked: boolean) => void;
}

const StorageLocationSection = ({
  selectedService,
  storageProvince,
  storageCity,
  setStorageProvince,
  setStorageCity,
  estimatedStorageTime,
  setEstimatedStorageTime,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
  resetFieldError,
  // Props for "both" service
  useOriginAsStorage = false,
  useDestinationAsStorage = false,
  originProvince = "",
  originCity = "",
  destinationProvince = "",
  destinationCity = "",
  handleUseOriginAsStorageChange,
  handleUseDestinationAsStorageChange,
}: StorageLocationSectionProps) => {
  // Update the handler to use resetFieldError when value changes
  const handleEstimatedTimeChange = (value: string) => {
    if (resetFieldError) {
      resetFieldError('estimatedStorageTime');
    }
    setEstimatedStorageTime(value);
  };

  // Set storage location based on selection
  const handleStorageLocationChange = (value: string) => {
    if (value === "origin" && handleUseOriginAsStorageChange) {
      handleUseOriginAsStorageChange(true);
    } else if (value === "destination" && handleUseDestinationAsStorageChange) {
      handleUseDestinationAsStorageChange(true);
    }
  };

  return (
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">
        <Warehouse className="w-5 h-5 inline-block mr-2" />
        <span>Ubicación de Almacenamiento</span>
      </h2>
      
      {selectedService === "both" ? (
        <div className="space-y-6">
          <div className="text-md mb-4">
            Seleccione dónde desea almacenar su mercadería:
          </div>
          
          <RadioGroup 
            value={useOriginAsStorage ? "origin" : useDestinationAsStorage ? "destination" : ""}
            onValueChange={handleStorageLocationChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="origin" id="storage-origin" />
              <Label htmlFor="storage-origin" className="cursor-pointer">
                Almacenar en origen: {originCity ? `${originCity}, ${originProvince}` : "No seleccionado"}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="destination" id="storage-destination" />
              <Label htmlFor="storage-destination" className="cursor-pointer">
                Almacenar en destino: {destinationCity ? `${destinationCity}, ${destinationProvince}` : "No seleccionado"}
              </Label>
            </div>
          </RadioGroup>
          
          {/* Storage time input */}
          {(useOriginAsStorage || useDestinationAsStorage) && (
            <div className="mt-4 p-4 border rounded-md bg-muted/10">
              <Label htmlFor="estimated-storage-time" className="block mb-2">
                Tiempo estimado de almacenamiento (en días)
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="estimated-storage-time"
                  type="number"
                  min="1"
                  value={estimatedStorageTime}
                  onChange={(e) => handleEstimatedTimeChange(e.target.value)}
                  className="w-32 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="30"
                />
                <span className="text-sm text-muted-foreground">días</span>
              </div>
              {isFieldTouched('estimatedStorageTime') && getFieldError('estimatedStorageTime') && (
                <p className="text-sm text-destructive mt-1">
                  {getFieldError('estimatedStorageTime')}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <LocationSelector
          type="storage"
          provinceValue={storageProvince}
          cityValue={storageCity}
          onProvinceChange={setStorageProvince}
          onCityChange={setStorageCity}
          label="Almacenamiento"
          estimatedTime={estimatedStorageTime}
          onEstimatedTimeChange={handleEstimatedTimeChange}
        />
      )}
    </div>
  );
};

export default StorageLocationSection;
