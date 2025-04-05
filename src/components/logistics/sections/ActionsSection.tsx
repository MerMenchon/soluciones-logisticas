
import React from "react";
import FormActions from "@/components/logistics/FormActions";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const ActionsSection = () => {
  const { resetForm, isSubmitting, isFormValid } = useLogisticsForm();

  return (
    <FormActions 
      onReset={resetForm} 
      isSubmitting={isSubmitting} 
      isFormValid={isFormValid}
    />
  );
};

export default ActionsSection;
