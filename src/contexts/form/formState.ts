
import { useState, useEffect } from "react";
import { FormState, TouchedFields } from "./types";
import { 
  useFormService,
  useFormLocation,
  useFormProduct,
  useFormSubmission
} from "./hooks";

export const useFormState = () => {
  // Create a state object to hold the combined state
  const [formState, setFormState] = useState<FormState>({
    // Service state
    selectedService: "",
    
    // Location state
    storageProvince: "",
    storageCity: "",
    originProvince: "",
    originCity: "",
    useOriginAsStorage: false,
    destinationProvince: "",
    destinationCity: "",
    useDestinationAsStorage: false,
    estimatedStorageTime: "",

    // UI state
    isSubmitting: false,
    formSubmitted: false,
    showConfirmation: false,
    distanceValue: null,
    isWaitingForResponse: false,
    showResponseDialog: false,

    // Contact state
    additionalInfo: "",

    // Product state
    productType: "",
    description: "",
    presentation: "",
    clarification: "",
    cargoValue: "",
    shippingTime: "",
    quantity: "",
    quantityUnit: "",
    
    // Initialize touched fields as empty
    touchedFields: {},
  });

  // Use individual hooks for state management
  const serviceState = useFormService(formState.selectedService);
  const locationState = useFormLocation({
    storageProvince: formState.storageProvince,
    storageCity: formState.storageCity,
    originProvince: formState.originProvince,
    originCity: formState.originCity,
    useOriginAsStorage: formState.useOriginAsStorage,
    destinationProvince: formState.destinationProvince,
    destinationCity: formState.destinationCity,
    useDestinationAsStorage: formState.useDestinationAsStorage,
    estimatedStorageTime: formState.estimatedStorageTime,
  });
  const productState = useFormProduct({
    productType: formState.productType,
    description: formState.description,
    presentation: formState.presentation,
    clarification: formState.clarification,
    cargoValue: formState.cargoValue,
    shippingTime: formState.shippingTime,
    quantity: formState.quantity,
    quantityUnit: formState.quantityUnit,
    additionalInfo: formState.additionalInfo,
  });
  
  // Update the formState whenever any child state changes
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      // Service state
      selectedService: serviceState.selectedService,
      
      // Location state
      storageProvince: locationState.storageProvince,
      storageCity: locationState.storageCity,
      originProvince: locationState.originProvince,
      originCity: locationState.originCity,
      useOriginAsStorage: locationState.useOriginAsStorage,
      destinationProvince: locationState.destinationProvince,
      destinationCity: locationState.destinationCity,
      useDestinationAsStorage: locationState.useDestinationAsStorage,
      estimatedStorageTime: locationState.estimatedStorageTime,

      // Product & Contact state
      additionalInfo: productState.additionalInfo,
      productType: productState.productType,
      description: productState.description,
      presentation: productState.presentation,
      clarification: productState.clarification,
      cargoValue: productState.cargoValue,
      shippingTime: productState.shippingTime,
      quantity: productState.quantity,
      quantityUnit: productState.quantityUnit,
    }));
  }, [
    serviceState,
    locationState,
    productState,
  ]);

  // Now use the submission hook with our current state
  const submissionState = useFormSubmission(formState);

  // Update UI state from submission state
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      isSubmitting: submissionState.isSubmitting,
      formSubmitted: submissionState.formSubmitted,
      showConfirmation: submissionState.showConfirmation,
      distanceValue: submissionState.distanceValue,
      webhookResponse: submissionState.webhookResponse,
      isWaitingForResponse: submissionState.isWaitingForResponse,
      showResponseDialog: submissionState.showResponseDialog,
      validationResult: submissionState.validationResult,
      touchedFields: submissionState.touchedFields,
    }));
  }, [submissionState]);

  // Custom setSelectedService that also resets locations
  const setSelectedService = (service: string) => {
    serviceState.setSelectedService(service as any);
    locationState.resetLocations();
    // Mark the field as touched when user interacts
    submissionState.setFieldTouched("selectedService");
  };

  // Form reset function
  const resetForm = () => {
    serviceState.setSelectedService("");
    locationState.resetLocations();
    productState.resetProductDetails();
    submissionState.setIsSubmitting(false);
    submissionState.setShowResponseDialog(false); 
    submissionState.setFormSubmitted(false); // Critical: Reset form submitted state to hide validation messages
    setFormState(prev => ({
      ...prev,
      selectedService: "",
      formSubmitted: false,
      showConfirmation: false,
      distanceValue: null,
      webhookResponse: undefined,
      isWaitingForResponse: false,
      showResponseDialog: false,
      touchedFields: {}, // Reset all touched fields
    }));
  };

  return {
    // Combine all state properties
    ...formState,
    ...submissionState,
    
    // Service methods
    setSelectedService,
    
    // Location methods
    setStorageProvince: locationState.setStorageProvince,
    setStorageCity: locationState.setStorageCity,
    setOriginProvince: locationState.setOriginProvince,
    setOriginCity: locationState.setOriginCity,
    setDestinationProvince: locationState.setDestinationProvince,
    setDestinationCity: locationState.setDestinationCity,
    handleUseOriginAsStorageChange: locationState.handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange: locationState.handleUseDestinationAsStorageChange,
    setEstimatedStorageTime: locationState.setEstimatedStorageTime,
    
    // Product methods
    setProductType: productState.setProductType,
    setDescription: productState.setDescription,
    setPresentation: productState.setPresentation,
    setClarification: productState.setClarification,
    setCargoValue: productState.setCargoValue,
    setShippingTime: productState.setShippingTime,
    setQuantity: productState.setQuantity,
    setQuantityUnit: productState.setQuantityUnit,
    
    // Contact methods
    setAdditionalInfo: productState.setAdditionalInfo,
    
    // Form action methods
    resetForm,
  };
};
