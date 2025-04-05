
import React from "react";
import ServiceSelector from "@/components/ServiceSelector";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const ServiceSection = () => {
  const {
    selectedService,
    setSelectedService,
    getFieldError,
    setFieldTouched,
    validateOnBlur
  } = useLogisticsForm();

  return (
    <ServiceSelector 
      selectedService={selectedService as "storage" | "transport" | "both"} 
      onSelectService={setSelectedService} 
      error={getFieldError("selectedService")}
    />
  );
};

export default ServiceSection;
