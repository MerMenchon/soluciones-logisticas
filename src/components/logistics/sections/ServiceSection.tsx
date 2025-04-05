
import React from "react";
import ServiceSelector from "@/components/ServiceSelector";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const ServiceSection = () => {
  const {
    selectedService,
    setSelectedService,
    getFieldError,
    setFieldTouched
  } = useLogisticsForm();

  // Create a handler that selects the service without immediate validation
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    
    // Don't mark field as touched or validate immediately
    // This prevents showing error messages when an option is selected
  };
  
  // Only get the error status based on our improved logic
  const serviceError = getFieldError("selectedService");

  return (
    <ServiceSelector 
      selectedService={selectedService as "storage" | "transport" | "both"} 
      onSelectService={handleServiceSelect} 
      error={serviceError}
    />
  );
};

export default ServiceSection;
