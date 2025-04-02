import { useState } from "react";
import { FormState, ServiceType } from "./types";
import { useToast } from "@/hooks/use-toast";
import { validateForm, getFormData } from "./validation";

export const useFormState = () => {
  const { toast } = useToast();

  // Form state
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
    category: "",
  });

  // Update functions
  const updateFormState = (updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  // Handlers for individual fields
  const setSelectedService = (service: ServiceType) => {
    updateFormState({ selectedService: service });
    resetLocations();
  };

  const resetLocations = () => {
    updateFormState({
      storageProvince: "",
      storageCity: "",
      originProvince: "",
      originCity: "",
      destinationProvince: "",
      destinationCity: "",
      useOriginAsStorage: false,
      useDestinationAsStorage: false,
      estimatedStorageTime: ""
    });
  };

  // Location handlers
  const setStorageProvince = (province: string) => updateFormState({ storageProvince: province });
  const setStorageCity = (city: string) => updateFormState({ storageCity: city });
  const setOriginProvince = (province: string) => updateFormState({ originProvince: province });
  const setOriginCity = (city: string) => updateFormState({ originCity: city });
  const setDestinationProvince = (province: string) => updateFormState({ destinationProvince: province });
  const setDestinationCity = (city: string) => updateFormState({ destinationCity: city });
  const setEstimatedStorageTime = (time: string) => updateFormState({ estimatedStorageTime: time });

  // Boolean handlers
  const handleUseOriginAsStorageChange = (checked: boolean) => {
    updateFormState({ 
      useOriginAsStorage: checked,
      storageProvince: checked ? formState.originProvince : formState.storageProvince,
      storageCity: checked ? formState.originCity : formState.storageCity
    });
  };

  const handleUseDestinationAsStorageChange = (checked: boolean) => {
    updateFormState({ 
      useDestinationAsStorage: checked,
      storageProvince: checked ? formState.destinationProvince : formState.storageProvince,
      storageCity: checked ? formState.destinationCity : formState.storageCity
    });
  };

  // Contact handlers
  const setAdditionalInfo = (info: string) => updateFormState({ additionalInfo: info });

  // Product handlers
  const setProductType = (type: string) => updateFormState({ productType: type });
  const setDescription = (description: string) => updateFormState({ description });
  const setPresentation = (presentation: string) => updateFormState({ presentation });
  const setClarification = (clarification: string) => updateFormState({ clarification });
  const setCargoValue = (value: string) => updateFormState({ cargoValue: value });
  const setShippingTime = (time: string) => updateFormState({ shippingTime: time });
  const setQuantity = (quantity: string) => updateFormState({ quantity });
  const setQuantityUnit = (unit: string) => updateFormState({ quantityUnit: unit });
  const setCategory = (category: string) => updateFormState({ category });

  // UI state handlers
  const setIsSubmitting = (isSubmitting: boolean) => updateFormState({ isSubmitting });
  const setShowConfirmation = (showConfirmation: boolean) => updateFormState({ showConfirmation });
  const setDistanceValue = (distanceValue: string | null) => updateFormState({ distanceValue });

  // Form reset
  const resetForm = () => {
    setFormState({
      selectedService: "",
      storageProvince: "",
      storageCity: "",
      originProvince: "",
      originCity: "",
      useOriginAsStorage: false,
      destinationProvince: "",
      destinationCity: "",
      useDestinationAsStorage: false,
      estimatedStorageTime: "",
      isSubmitting: false,
      formSubmitted: false,
      showConfirmation: false,
      distanceValue: null,
      additionalInfo: "",
      productType: "",
      description: "",
      presentation: "",
      clarification: "",
      cargoValue: "",
      shippingTime: "",
      quantity: "",
      quantityUnit: "",
      category: "",
    });
  };

  // Form validation wrapper
  const validateFormWrapper = () => {
    return validateForm(formState);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateFormWrapper();
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Proceed directly to sending the form without distance calculation
    submitForm();
  };

  const submitForm = async () => {
    updateFormState({ isSubmitting: true });

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would typically send the form data to your server
    const formData = getFormData(formState);
    console.log("Form data submitted:", formData);

    // Show success message
    toast({
      title: "Éxito",
      description: "Su consulta ha sido enviada correctamente!",
    });

    updateFormState({ formSubmitted: true, isSubmitting: false });
  };

  // These functions are no longer needed but kept for API compatibility
  const confirmRequest = async () => {
    submitForm();
  };

  const cancelRequest = () => {
    updateFormState({ isSubmitting: false });
  };

  return {
    ...formState,
    setSelectedService,
    setStorageProvince,
    setStorageCity,
    setOriginProvince,
    setOriginCity,
    setDestinationProvince,
    setDestinationCity,
    handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange,
    setEstimatedStorageTime,
    setIsSubmitting,
    setShowConfirmation,
    setDistanceValue,
    setAdditionalInfo,
    setProductType,
    setDescription,
    setPresentation,
    setClarification,
    setCargoValue,
    setShippingTime,
    setQuantity,
    setQuantityUnit,
    setCategory,
    handleSubmit,
    resetForm,
    confirmRequest,
    cancelRequest,
    validateForm: validateFormWrapper,
  };
};
