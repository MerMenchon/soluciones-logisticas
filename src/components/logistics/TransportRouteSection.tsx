
import React from "react";
import { Truck, MapPin } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import { FormState } from "@/contexts/form/types";

interface TransportRouteSectionProps {
  originProvince: string;
  originCity: string;
  setOriginProvince: (province: string) => void;
  setOriginCity: (city: string) => void;
  destinationProvince: string;
  destinationCity: string;
  setDestinationProvince: (province: string) => void;
  setDestinationCity: (city: string) => void;
  selectedService: string;
  useOriginAsStorage: boolean;
  handleUseOriginAsStorageChange: (checked: boolean) => void;
  useDestinationAsStorage: boolean;
  handleUseDestinationAsStorageChange: (checked: boolean) => void;
  estimatedStorageTime: string;
  setEstimatedStorageTime: (time: string) => void;
  isFieldTouched: (fieldName: keyof FormState) => boolean;
  getFieldError: (fieldName: string) => string | null;
  markFieldTouched: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void; // Add resetFieldError as optional
}

const TransportRouteSection = ({
  originProvince,
  originCity,
  setOriginProvince,
  setOriginCity,
  destinationProvince,
  destinationCity,
  setDestinationProvince,
  setDestinationCity,
  selectedService,
  useOriginAsStorage,
  handleUseOriginAsStorageChange,
  useDestinationAsStorage,
  handleUseDestinationAsStorageChange,
  estimatedStorageTime,
  setEstimatedStorageTime,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
}: TransportRouteSectionProps) => {
  return (
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">
        <Truck className="w-5 h-5 inline-block mr-2" />
        <span>Ruta de Transporte</span>
      </h2>
      
      <div className="reference-form-cols-2">
        <div className="space-y-6">
          <h3 className="font-medium text-base flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Origen
          </h3>
          <LocationSelector
            type="origin"
            provinceValue={originProvince}
            cityValue={originCity}
            onProvinceChange={setOriginProvince}
            onCityChange={setOriginCity}
            label="Origen"
            useAsStorage={useOriginAsStorage}
            onUseAsStorageChange={
              selectedService === "both" 
                ? handleUseOriginAsStorageChange 
                : undefined
            }
            estimatedTime={useOriginAsStorage ? estimatedStorageTime : undefined}
            onEstimatedTimeChange={useOriginAsStorage ? setEstimatedStorageTime : undefined}
            disableStorageOption={useDestinationAsStorage}
          />
        </div>
        
        <div className="space-y-6">
          <h3 className="font-medium text-base flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Destino
          </h3>
          <LocationSelector
            type="destination"
            provinceValue={destinationProvince}
            cityValue={destinationCity}
            onProvinceChange={setDestinationProvince}
            onCityChange={setDestinationCity}
            label="Destino"
            useAsStorage={useDestinationAsStorage}
            onUseAsStorageChange={
              selectedService === "both"
                ? handleUseDestinationAsStorageChange
                : undefined
            }
            estimatedTime={useDestinationAsStorage ? estimatedStorageTime : undefined}
            onEstimatedTimeChange={useDestinationAsStorage ? setEstimatedStorageTime : undefined}
            disableStorageOption={useOriginAsStorage}
          />
        </div>
      </div>
    </div>
  );
};

export default TransportRouteSection;
