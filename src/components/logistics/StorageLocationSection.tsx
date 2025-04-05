
import React from "react";
import { Warehouse } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";

interface StorageLocationSectionProps {
  selectedService: string;
  storageProvince: string;
  storageCity: string;
  setStorageProvince: (province: string) => void;
  setStorageCity: (city: string, hasStorage: boolean) => void;
  estimatedStorageTime: string;
  setEstimatedStorageTime: (time: string) => void;
  errors?: {
    province: string | null;
    city: string | null;
    time: string | null;
  };
}

const StorageLocationSection = ({
  selectedService,
  storageProvince,
  storageCity,
  setStorageProvince,
  setStorageCity,
  estimatedStorageTime,
  setEstimatedStorageTime,
  errors = { province: null, city: null, time: null }
}: StorageLocationSectionProps) => {
  return (
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">
        <Warehouse className="w-5 h-5 inline-block mr-2" />
        <span>Ubicación de Almacenamiento</span>
      </h2>
      
      {selectedService === "both" ? (
        <div className="text-muted-foreground text-sm mb-4">
          Seleccione la ubicación usando las opciones en Origen o Destino
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
          onEstimatedTimeChange={setEstimatedStorageTime}
          errors={errors}
        />
      )}
    </div>
  );
};

export default StorageLocationSection;
