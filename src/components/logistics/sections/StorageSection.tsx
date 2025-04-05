
import React from "react";
import StorageLocationSection from "@/components/logistics/StorageLocationSection";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

type ServiceType = "storage" | "transport" | "both";

interface StorageSectionProps {
  selectedService: ServiceType;
}

const StorageSection = ({ selectedService }: StorageSectionProps) => {
  // Don't render if not needed
  if (selectedService !== "storage" && selectedService !== "both") return null;
  
  const {
    storageProvince,
    storageCity,
    setStorageProvince,
    setStorageCity,
    estimatedStorageTime,
    setEstimatedStorageTime,
    getFieldError,
  } = useLogisticsForm();

  return (
    <StorageLocationSection
      selectedService={selectedService}
      storageProvince={storageProvince}
      storageCity={storageCity}
      setStorageProvince={setStorageProvince}
      setStorageCity={setStorageCity}
      estimatedStorageTime={estimatedStorageTime}
      setEstimatedStorageTime={setEstimatedStorageTime}
      errors={{
        province: getFieldError("storageProvince"),
        city: getFieldError("storageCity"),
        time: getFieldError("estimatedStorageTime")
      }}
    />
  );
};

export default StorageSection;
