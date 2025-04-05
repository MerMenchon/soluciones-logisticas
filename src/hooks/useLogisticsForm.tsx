
import { useEffect, useState } from "react";
import { useFormContext } from "@/contexts/form";
import { LogisticsFormHookReturn } from "@/types/logistics";

/**
 * Custom hook that manages the logistics form state and validation.
 * 
 * @returns {LogisticsFormHookReturn} An object containing form state, methods, and validation functionality
 */
export const useLogisticsForm = (): LogisticsFormHookReturn => {
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
      // Mark field as touched
      setFieldTouched("shippingTime");
      
      // Only validate if form has been submitted
      if (formSubmitted) {
        validateField("shippingTime");
      }
    }
  };
  
  // Function to mark the field as touched when opening the calendar
  const handleDatePopoverOpen = () => {
    setFieldTouched("shippingTime");
  };

  // Function to validate only when form has been submitted
  const handleDateBlur = () => {
    if (shippingTime && formSubmitted) {
      validateOnBlur("shippingTime");
    }
  };
  
  // Create a generic field blur handler that only validates if form was submitted
  const handleFieldBlur = (fieldName: string) => {
    if (formSubmitted) {
      validateOnBlur(fieldName);
    }
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
