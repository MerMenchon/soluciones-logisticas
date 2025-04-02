
import React, { createContext, useContext } from "react";
import { FormContextType, FormProviderProps } from "./types";
import { useFormState } from "./formState";

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Hook for using the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// Form Context Provider
export const FormProvider = ({ children }: FormProviderProps) => {
  const formState = useFormState();
  
  return (
    <FormContext.Provider value={formState}>
      {children}
    </FormContext.Provider>
  );
};
