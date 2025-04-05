
import React from "react";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";
import SuccessMessage from "@/components/SuccessMessage";
import FormSections from "@/components/logistics/FormSections";
import { FormProvider } from "@/contexts/form";

const LogisticsForm = () => {
  // We need to ensure this component is used within a FormProvider
  // Since the error is occurring, we're wrapping our content with FormProvider
  return (
    <FormProvider>
      <LogisticsFormContent />
    </FormProvider>
  );
};

// Separate the content to avoid having useLogisticsForm outside of FormProvider
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
