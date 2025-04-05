
import React from "react";
import ServiceSelector from "@/components/ServiceSelector";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const ServiceSection = () => {
  const {
    selectedService,
    setSelectedService,
    getFieldError,
    setFieldTouched,
    validateField
  } = useLogisticsForm();

  // Create a handler that first selects the service and then validates immediately
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    
    // Mark field as touched
    setFieldTouched("selectedService");
    
    // Always validate immediately to clear any errors
    if (validateField) {
      validateField("selectedService");
    }
  };

  // Only get the error if we need to show it (user has interacted with the form)
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
