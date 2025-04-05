
import React, { createContext, useContext, ReactNode } from "react";
import { FormContextType, FormProviderProps } from "./types";
import { useFormState } from "./formState";

// Create the context with undefined as initial value
const FormContext = createContext<FormContextType | undefined>(undefined);

// Hook for using the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// Form Context Provider component
export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const formState = useFormState();
  
  return (
    <FormContext.Provider value={formState}>
      {children}
    </FormContext.Provider>
  );
};
