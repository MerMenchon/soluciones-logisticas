import { useState, useEffect, useMemo, useCallback } from "react";
import { FormState } from "./types";
import { 
  useFormService,
  useFormLocation,
  useFormProduct,
  useFormSubmission
} from "./hooks";

export const useFormState = () => {
  // Estado inicial del formulario
  const [formState, setFormState] = useState<FormState>({
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
    isWaitingForResponse: false,
    showResponseDialog: false,
    showSuccessConfirmation: false,
    additionalInfo: "",
    productType: "",
    description: "",
    presentation: "",
    clarification: "",
    cargoValue: "",
    shippingTime: "",
    quantity: "",
    quantityUnit: "",
  });

  // Hooks individuales para manejar partes del estado
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
  const submissionState = useFormSubmission(formState);

  // Memoiza los valores derivados para evitar renders innecesarios
  const derivedState = useMemo(() => ({
    selectedService: serviceState.selectedService,
    storageProvince: locationState.storageProvince,
    storageCity: locationState.storageCity,
    originProvince: locationState.originProvince,
    originCity: locationState.originCity,
    useOriginAsStorage: locationState.useOriginAsStorage,
    destinationProvince: locationState.destinationProvince,
    destinationCity: locationState.destinationCity,
    useDestinationAsStorage: locationState.useDestinationAsStorage,
    estimatedStorageTime: locationState.estimatedStorageTime,
    additionalInfo: productState.additionalInfo,
    productType: productState.productType,
    description: productState.description,
    presentation: productState.presentation,
    clarification: productState.clarification,
    cargoValue: productState.cargoValue,
    shippingTime: productState.shippingTime,
    quantity: productState.quantity,
    quantityUnit: productState.quantityUnit,
    isSubmitting: submissionState.isSubmitting,
    formSubmitted: submissionState.formSubmitted,
    showConfirmation: submissionState.showConfirmation,
    distanceValue: submissionState.distanceValue,
    isWaitingForResponse: submissionState.isWaitingForResponse,
    showResponseDialog: submissionState.showResponseDialog,
    showSuccessConfirmation: submissionState.showSuccessConfirmation,
  }), [
    serviceState.selectedService,
    locationState,
    productState,
    submissionState,
  ]);

  // Actualiza el estado del formulario solo cuando los valores derivados cambien
  useEffect(() => {
    setFormState((prev) => {
      const newState = { ...prev, ...derivedState };
      // Evita actualizaciones innecesarias comparando el estado anterior con el nuevo
      if (JSON.stringify(prev) !== JSON.stringify(newState)) {
        return newState;
      }
      return prev;
    });
  }, [derivedState]);

  // Función memoizada para cambiar el servicio seleccionado
  const setSelectedService = useCallback((service: string) => {
    serviceState.setSelectedService(service as any);
    locationState.resetLocations();
  }, [serviceState, locationState]);

  // Función para reiniciar el formulario
  const resetForm = useCallback(() => {
    serviceState.setSelectedService("");
    locationState.resetLocations();
    productState.resetProductDetails();
    submissionState.updateSubmissionState({
      isSubmitting: false,
      formSubmitted: false,
      showConfirmation: false,
      distanceValue: null,
      webhookResponse: undefined,
      isWaitingForResponse: false,
      showResponseDialog: false,
      showSuccessConfirmation: false,
    });
    submissionState.resetFieldTracking();
  }, [serviceState, locationState, productState, submissionState]);

  // Retorna el estado combinado y las funciones
  return {
    ...formState,
    ...submissionState,
    setSelectedService,
    setStorageProvince: locationState.setStorageProvince,
    setStorageCity: locationState.setStorageCity,
    setOriginProvince: locationState.setOriginProvince,
    setOriginCity: locationState.setOriginCity,
    setDestinationProvince: locationState.setDestinationProvince,
    setDestinationCity: locationState.setDestinationCity,
    handleUseOriginAsStorageChange: locationState.handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange: locationState.handleUseDestinationAsStorageChange,
    setEstimatedStorageTime: locationState.setEstimatedStorageTime,
    setProductType: productState.setProductType,
    setDescription: productState.setDescription,
    setPresentation: productState.setPresentation,
    setClarification: productState.setClarification,
    setCargoValue: productState.setCargoValue,
    setShippingTime: productState.setShippingTime,
    setQuantity: productState.setQuantity,
    setQuantityUnit: productState.setQuantityUnit,
    setAdditionalInfo: productState.setAdditionalInfo,
    resetForm,
    updateSubmissionState: submissionState.updateSubmissionState,
  };
};