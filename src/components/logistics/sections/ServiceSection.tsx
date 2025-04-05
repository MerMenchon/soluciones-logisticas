
import React from "react";
import ServiceSelector from "@/components/ServiceSelector";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const ServiceSection = () => {
  const {
    selectedService,
    setSelectedService,
    getFieldError,
    setFieldTouched,
    formSubmitted,
    validateField
  } = useLogisticsForm();

  // Create a handler that first selects the service and then validates if form was submitted
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    
    // Mark field as touched
    setFieldTouched("selectedService");
    
    // Validate immediately to clear any errors, but only if the form has been submitted
    if (formSubmitted && validateField) {
      // Use setTimeout to ensure the state update happens first
      setTimeout(() => {
        validateField("selectedService");
      }, 0);
    }
  };

  return (
    <ServiceSelector 
      selectedService={selectedService as "storage" | "transport" | "both"} 
      onSelectService={handleServiceSelect} 
      error={getFieldError("selectedService")}
    />
  );
};

export default ServiceSection;
