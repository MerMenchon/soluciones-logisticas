
import React, { memo } from "react";
import { Warehouse } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import { FormState } from "@/contexts/form/types";
import { RadioGroup } from "@/components/ui/radio-group";
import { useStorageOptions } from "@/hooks/useStorageOptions";
import StorageOriginOption from "@/components/logistics/storage/StorageOriginOption";
import StorageDestinationOption from "@/components/logistics/storage/StorageDestinationOption";
import StorageTimeInput from "@/components/logistics/storage/StorageTimeInput";
import StorageAlert from "@/components/logistics/storage/StorageAlert";

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
  
  // Get storage options and availability information from custom hook
  const {
    hasOriginStorage,
    hasDestinationStorage,
    originChecked,
    destinationChecked,
    isCheckingOrigin,
    isCheckingDestination,
    canUseOriginStorage,
    canUseDestinationStorage,
    storageLocation,
    noStorageAvailable
  } = useStorageOptions({
    selectedService,
    originProvince,
    originCity,
    destinationProvince,
    destinationCity,
    useOriginAsStorage,
    useDestinationAsStorage
  });
  
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
            value={storageLocation}
            onValueChange={handleStorageLocationChange}
            className="space-y-4"
          >
            {/* Origin storage option */}
            <StorageOriginOption
              originCity={originCity}
              originProvince={originProvince}
              canUseOriginStorage={canUseOriginStorage}
              useOriginAsStorage={useOriginAsStorage}
              isCheckingOrigin={isCheckingOrigin}
              hasOriginStorage={hasOriginStorage}
              originChecked={originChecked}
            />
            
            {/* Destination storage option */}
            <StorageDestinationOption
              destinationCity={destinationCity}
              destinationProvince={destinationProvince}
              canUseDestinationStorage={canUseDestinationStorage}
              useDestinationAsStorage={useDestinationAsStorage}
              isCheckingDestination={isCheckingDestination}
              hasDestinationStorage={hasDestinationStorage}
              destinationChecked={destinationChecked}
            />
          </RadioGroup>
          
          {/* Show alert when both origin and destination have no storage */}
          <StorageAlert show={noStorageAvailable} />
          
          {/* Storage time input - only show when a location is selected */}
          {(useOriginAsStorage || useDestinationAsStorage) && (
            <StorageTimeInput
              estimatedStorageTime={estimatedStorageTime}
              onEstimatedTimeChange={handleEstimatedTimeChange}
              isFieldTouched={isFieldTouched}
              getFieldError={getFieldError}
            />
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

// Use memo to prevent unnecessary re-renders
export default memo(StorageLocationSection);
