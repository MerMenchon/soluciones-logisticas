
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
  isFieldTouched: (fieldName: keyof FormState) => boolean;
  getFieldError: (fieldName: string) => string | null;
  markFieldTouched: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
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
  isFieldTouched,
  getFieldError,
  markFieldTouched,
  resetFieldError,
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
            // Remove storage options for "transport" service entirely
            useAsStorage={undefined}
            onUseAsStorageChange={undefined}
            disableStorageOption={true}
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
            // Remove storage options for "transport" service entirely
            useAsStorage={undefined}
            onUseAsStorageChange={undefined}
            disableStorageOption={true}
          />
        </div>
      </div>
    </div>
  );
};

export default TransportRouteSection;
