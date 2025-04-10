
import React from "react";
import { Warehouse } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import { FormState } from "@/contexts/form/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStorageAvailability } from "@/hooks/useStorageAvailability";

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
  // Check storage availability for origin and destination
  const { hasStorage: hasOriginStorage } = useStorageAvailability(originProvince, originCity);
  const { hasStorage: hasDestinationStorage } = useStorageAvailability(destinationProvince, destinationCity);
  
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
      if (handleUseDestinationAsStorageChange) {
        handleUseDestinationAsStorageChange(false);
      }
    } else if (value === "destination" && handleUseDestinationAsStorageChange) {
      handleUseDestinationAsStorageChange(true);
      if (handleUseOriginAsStorageChange) {
        handleUseOriginAsStorageChange(false);
      }
    }
  };

  // Determine if we show the "no storage available" message
  const noStorageAvailable = selectedService === "both" && 
                            originCity && destinationCity && 
                            !hasOriginStorage && !hasDestinationStorage;

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
            {/* Always show origin option, but disable if no storage available */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="origin" 
                id="storage-origin" 
                disabled={!originCity || !hasOriginStorage}
              />
              <Label 
                htmlFor="storage-origin" 
                className={(!originCity || !hasOriginStorage) ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}
              >
                Almacenar en origen: {originCity ? `${originCity}, ${originProvince}` : "Seleccione una ciudad de origen"}
                {originCity && !hasOriginStorage && (
                  <span className="block text-xs text-muted-foreground">
                    No hay depósito disponible en esta ubicación
                  </span>
                )}
              </Label>
            </div>
            
            {/* Always show destination option, but disable if no storage available */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="destination" 
                id="storage-destination" 
                disabled={!destinationCity || !hasDestinationStorage}
              />
              <Label 
                htmlFor="storage-destination" 
                className={(!destinationCity || !hasDestinationStorage) ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}
              >
                Almacenar en destino: {destinationCity ? `${destinationCity}, ${destinationProvince}` : "Seleccione una ciudad de destino"}
                {destinationCity && !hasDestinationStorage && (
                  <span className="block text-xs text-muted-foreground">
                    No hay depósito disponible en esta ubicación
                  </span>
                )}
              </Label>
            </div>
          </RadioGroup>
          
          {/* Show alert when both origin and destination have no storage */}
          {noStorageAvailable && (
            <Alert className="bg-muted/50 border mt-4">
              <AlertDescription>
                Debe elegir alguna ciudad con depósito en origen o destino.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Storage time input - only show when a location is selected */}
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
