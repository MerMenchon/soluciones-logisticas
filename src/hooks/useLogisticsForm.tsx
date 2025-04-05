
import { useEffect, useState } from "react";
import { useFormContext } from "@/contexts/form";
import { LogisticsFormHookReturn } from "@/types/logistics";

/**
 * Custom hook that manages the logistics form state and validation.
 * 
 * @returns {LogisticsFormHookReturn} An object containing form state, methods, and validation functionality
 */
export const useLogisticsForm = (): LogisticsFormHookReturn => {
  // This hook must be used within a FormProvider component
  const formContext = useFormContext();
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  
  // Extract all the values and functions we need from form context
  const {
    selectedService,
    validateForm,
    validateFields,
    validateField,
    validateOnBlur,
    handleSubmit,
    shippingTime,
    setShippingTime,
    validationResult,
    showResponseDialog,
    handleCloseResponseDialog,
    isWaitingForResponse,
    setFieldTouched,
    getFieldError,
    isFieldTouched,
    formSubmitted
  } = formContext;

  // Effect to validate the form when relevant values change
  // This doesn't show the errors - it just tracks if the form is valid
  useEffect(() => {
    const isValid = validateForm() === null;
    setIsFormValid(isValid);
  }, [
    formContext.selectedService,
    formContext.storageProvince,
    formContext.storageCity,
    formContext.originProvince,
    formContext.originCity,
    formContext.destinationProvince,
    formContext.destinationCity,
    formContext.productType,
    formContext.description,
    formContext.presentation,
    formContext.quantity,
    formContext.quantityUnit,
    formContext.cargoValue,
    formContext.shippingTime,
    formContext.estimatedStorageTime,
    validateForm
  ]);

  // For date picker
  const selectedDate = shippingTime ? new Date(shippingTime) : undefined;
  const today = new Date();
  
  // Disable past dates
  const disabledDays = { before: today };
  
  const handleDateSelect = (date: Date | undefined): void => {
    if (date) {
      setShippingTime(date.toISOString());
      // Don't mark field as touched to avoid showing validation messages
    }
  };
  
  // Don't mark fields as touched when interacting to avoid showing validation
  const handleDatePopoverOpen = () => {
    // We're removing the setFieldTouched call here
  };

  // Don't validate fields on blur to prevent showing error messages
  const handleDateBlur = () => {
    // We're removing validation on blur
  };
  
  // Create a generic field blur handler that doesn't validate to avoid showing errors
  const handleFieldBlur = (fieldName: string) => {
    // Remove validation on blur
  };

  // Function to handle form submission and validate all fields
  const handleFormSubmit = (e: React.FormEvent): void => {
    handleSubmit(e);
  };

  return {
    ...formContext,
    isFormValid,
    selectedDate,
    disabledDays,
    handleDateSelect,
    handleDatePopoverOpen,
    handleDateBlur,
    handleFieldBlur,
    handleFormSubmit,
    showResponseDialog,
    handleCloseResponseDialog,
    isWaitingForResponse,
    setFieldTouched,
    getFieldError,
    isFieldTouched,
    formSubmitted,
    validateOnBlur
  };
};
