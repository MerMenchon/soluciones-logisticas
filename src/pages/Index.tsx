
import React from "react";
import { FormProvider } from "@/contexts/FormContext";
import LogisticsForm from "@/components/LogisticsForm";
import SuccessMessage from "@/components/SuccessMessage";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useFormContext } from "@/contexts/FormContext";

const FormContent = () => {
  const { 
    formSubmitted, 
    resetForm, 
    showConfirmation, 
    distanceValue, 
    confirmRequest,
    cancelRequest
  } = useFormContext();

  if (formSubmitted) {
    return <SuccessMessage onReset={resetForm} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-agri-primary mb-3">
            Servicio de logística
          </h1>
          <p className="text-lg text-agri-secondary max-w-2xl mx-auto">
            Seleccione el servicio que necesita para su mercadería
          </p>
        </header>

        <LogisticsForm />

        {showConfirmation && distanceValue && (
          <ConfirmationDialog 
            distanceValue={distanceValue} 
            onConfirm={confirmRequest}
            onCancel={cancelRequest}
          />
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <FormProvider>
      <FormContent />
    </FormProvider>
  );
};

export default Index;
