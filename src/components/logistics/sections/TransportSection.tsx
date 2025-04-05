
import React from "react";
import TransportRouteSection from "@/components/logistics/TransportRouteSection";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

type ServiceType = "storage" | "transport" | "both";

interface TransportSectionProps {
  selectedService: ServiceType;
}

const TransportSection = ({ selectedService }: TransportSectionProps) => {
  // Don't render if not needed
  if (selectedService !== "transport" && selectedService !== "both") return null;
  
  const {
    originProvince,
    originCity,
    setOriginProvince,
    setOriginCity,
    destinationProvince,
    destinationCity,
    setDestinationProvince,
    setDestinationCity,
    useOriginAsStorage,
    handleUseOriginAsStorageChange,
    useDestinationAsStorage,
    handleUseDestinationAsStorageChange,
    estimatedStorageTime,
    setEstimatedStorageTime,
    getFieldError,
  } = useLogisticsForm();

  return (
    <TransportRouteSection
      originProvince={originProvince}
      originCity={originCity}
      setOriginProvince={setOriginProvince}
      setOriginCity={setOriginCity}
      destinationProvince={destinationProvince}
      destinationCity={destinationCity}
      setDestinationProvince={setDestinationProvince}
      setDestinationCity={setDestinationCity}
      selectedService={selectedService}
      useOriginAsStorage={useOriginAsStorage}
      handleUseOriginAsStorageChange={handleUseOriginAsStorageChange}
      useDestinationAsStorage={useDestinationAsStorage}
      handleUseDestinationAsStorageChange={handleUseDestinationAsStorageChange}
      estimatedStorageTime={estimatedStorageTime}
      setEstimatedStorageTime={setEstimatedStorageTime}
      errors={{
        originProvince: getFieldError("originProvince"),
        originCity: getFieldError("originCity"),
        destinationProvince: getFieldError("destinationProvince"),
        destinationCity: getFieldError("destinationCity"),
        estimatedStorageTime: getFieldError("estimatedStorageTime")
      }}
    />
  );
};

export default TransportSection;
