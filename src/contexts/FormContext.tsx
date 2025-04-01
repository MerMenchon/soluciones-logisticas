
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ServiceType } from "@/components/ServiceSelector";
import { FormContextType } from "@/types/form";
import { useFormState } from "@/hooks/useFormState";
import { useFormActions } from "@/hooks/useFormActions";

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get initial form state with all the useState hooks
  const formState = useFormState();
  
  // Extract all the state setters
  const setters = {
    setFormSubmitted: useState<boolean>()[1],
    setIsSubmitting: useState<boolean>()[1],
    setSelectedService: useState<ServiceType | null>()[1],
    setDistanceValue: useState<string | null>()[1],
    setContactValue: useState<string | null>()[1],
    setDateTimeValue: useState<string | null>()[1],
    setShowConfirmation: useState<boolean>()[1],
    setStorageProvince: useState<string>()[1],
    setStorageCity: useState<string>()[1],
    setOriginProvince: useState<string>()[1],
    setOriginCity: useState<string>()[1],
    setUseOriginAsStorage: useState<boolean>()[1],
    setDestinationProvince: useState<string>()[1],
    setDestinationCity: useState<string>()[1],
    setUseDestinationAsStorage: useState<boolean>()[1],
    setProductType: useState<string>()[1],
    setWeight: useState<string>()[1],
    setVolume: useState<string>()[1],
    setCargoValue: useState<string>()[1],
    setShippingTime: useState<string>()[1],
    setProductDescription: useState<string>()[1],
    setEmail: useState<string>()[1],
    setAdditionalInfo: useState<string>()[1],
  };
  
  // Get all form actions
  const {
    resetForm,
    handleServiceChange,
    handleStorageCityChange,
    handleOriginCityChange,
    handleDestinationCityChange,
    handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange,
    confirmRequest,
    cancelRequest,
    handleSubmit,
    validateForm
  } = useFormActions({ formState, setters });

  // Combine everything for the form context
  const formContextValue: FormContextType = {
    ...formState,
    setSelectedService: handleServiceChange,
    setStorageProvince: setters.setStorageProvince,
    setStorageCity: handleStorageCityChange,
    setOriginProvince: setters.setOriginProvince,
    setOriginCity: handleOriginCityChange,
    setDestinationProvince: setters.setDestinationProvince, 
    setDestinationCity: handleDestinationCityChange,
    handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange,
    setProductType: setters.setProductType,
    setWeight: setters.setWeight,
    setVolume: setters.setVolume,
    setCargoValue: setters.setCargoValue,
    setShippingTime: setters.setShippingTime,
    setProductDescription: setters.setProductDescription,
    setEmail: setters.setEmail,
    setAdditionalInfo: setters.setAdditionalInfo,
    resetForm,
    handleSubmit,
    validateForm,
    confirmRequest,
    cancelRequest
  };

  return (
    <FormContext.Provider value={formContextValue}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
