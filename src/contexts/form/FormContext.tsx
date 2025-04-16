
import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { FormContextType, FormProviderProps } from "./types";
import { useFormState } from "./formState";

// Create the context with a more specific name to avoid conflicts
const CustomFormContext = createContext<FormContextType | undefined>(undefined);

// Hook for using the form context with a more specific name
export const useFormContext = () => {
  const context = useContext(CustomFormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// Form Context Provider component with added _context type
type FormProviderComponent = React.FC<{children: ReactNode}> & {
  _context?: React.Context<FormContextType | undefined>
};

export const FormProvider: FormProviderComponent = ({ children }) => {
  const formState = useFormState();
  
  // Memoiza el valor del contexto para evitar re-renderizados innecesarios
  const memoizedFormState = useMemo(() => formState, [formState]);

  return (
    <CustomFormContext.Provider value={memoizedFormState}>
      {children}
    </CustomFormContext.Provider>
  );
};

// Fix: Add _context property for direct access when needed
FormProvider._context = CustomFormContext;
