
import React from "react";
import ContactDetails from "@/components/ContactDetails";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const ContactDetailsSection = () => {
  const { additionalInfo, setAdditionalInfo } = useLogisticsForm();

  return (
    <ContactDetails
      additionalInfo={additionalInfo}
      onAdditionalInfoChange={setAdditionalInfo}
    />
  );
};

export default ContactDetailsSection;
