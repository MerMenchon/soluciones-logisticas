
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
  
  // Handle date selection with validation
  const handleDateSelect = (date: Date | undefined): void => {
    if (date) {
      setShippingTime(date.toISOString());
      
      // After selecting a date, validate the field
      setTimeout(() => validateField("shippingTime"), 0);
    }
  };
  
  // Mark the field as touched when opening the datepicker
  const handleDatePopoverOpen = () => {
    setFieldTouched("shippingTime");
  };

  // Function to handle form submission and validate all fields
  const handleFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Validate all fields before submitting, which will mark the form as submitted
    validateFields();
    handleSubmit(e);
  };

  return {
    ...formContext,
    isFormValid,
    selectedDate,
    disabledDays,
    handleDateSelect,
    handleDatePopoverOpen,
    handleFormSubmit,
    showResponseDialog,
    handleCloseResponseDialog,
    isWaitingForResponse,
    setFieldTouched,
    getFieldError,
    isFieldTouched,
    formSubmitted
  };
};
