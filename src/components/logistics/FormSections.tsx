
import React from "react";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";
import {
  ServiceSection,
  DateSection,
  StorageSection,
  TransportSection,
  ProductDetailsSection,
  ContactDetailsSection,
  ActionsSection
} from "./sections";

// Define the ServiceType to match the one in ServiceSelector
type ServiceType = "storage" | "transport" | "both";

const FormSections = () => {
  const { selectedService } = useLogisticsForm();
  const serviceType = selectedService as ServiceType;

  return (
    <>
      <ServiceSection />
      <DateSection />

      {selectedService && (
        <>
          <StorageSection selectedService={serviceType} />
          <TransportSection selectedService={serviceType} />
          <ProductDetailsSection />
          <ContactDetailsSection />
          <ActionsSection />
        </>
      )}
    </>
  );
};

export default FormSections;
