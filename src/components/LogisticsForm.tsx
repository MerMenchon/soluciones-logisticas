
import React from "react";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";
import SuccessMessage from "@/components/SuccessMessage";
import FormSections from "@/components/logistics/FormSections";

const LogisticsForm = () => {
  const {
    selectedService,
    handleFormSubmit,
    showResponseDialog,
    handleCloseResponseDialog,
    isWaitingForResponse,
  } = useLogisticsForm();

  return (
    <>
      {/* Response Dialog */}
      <SuccessMessage 
        open={showResponseDialog || isWaitingForResponse} 
        onClose={handleCloseResponseDialog} 
      />
      
      <form onSubmit={handleFormSubmit} className="reference-form space-y-8" noValidate>
        <FormSections />
      </form>
    </>
  );
};

export default LogisticsForm;
