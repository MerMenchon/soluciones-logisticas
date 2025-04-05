
import React from "react";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";
import SuccessMessage from "@/components/SuccessMessage";
import FormSections from "@/components/logistics/FormSections";
import { FormProvider } from "@/contexts/form";

const LogisticsForm = () => {
  return (
    <FormProvider>
      <LogisticsFormContent />
    </FormProvider>
  );
};

// Separate component that uses the form context
const LogisticsFormContent = () => {
  const {
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
