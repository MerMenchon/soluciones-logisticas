
import { useState } from "react";
import { ServiceType } from "../types";

export const useFormService = (initialService: ServiceType = "") => {
  const [selectedService, setSelectedService] = useState<ServiceType>(initialService);

  const updateService = (service: ServiceType) => {
    setSelectedService(service);
  };

  return {
    selectedService,
    setSelectedService: updateService,
  };
};
