
import React from "react";
import ServiceSelector from "@/components/ServiceSelector";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const ServiceSection = () => {
  const {
    selectedService,
    setSelectedService,
    getFieldError,
    setFieldTouched,
    validateOnBlur,
    handleFieldBlur
  } = useLogisticsForm();

  // Create a handler that first selects the service and then validates if form was submitted
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    // Validate the field if the form has been submitted once
    handleFieldBlur("selectedService");
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
