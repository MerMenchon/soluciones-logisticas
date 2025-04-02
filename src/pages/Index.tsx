
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="reference-form-title text-3xl font-bold text-gray-900 mb-3">
            Servicio de logística
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
