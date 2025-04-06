
import { useState } from "react";
import { FormState } from "../types";

// Define the structure of our touched fields state
type TouchedFields = {
  [K in keyof FormState]?: boolean;
};

export const useFieldTracking = () => {
  // State to track which fields have been touched (interacted with)
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  
  // Track field-specific validation errors
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string | null}>({});
  
  // Mark a specific field as touched
  const markFieldTouched = (fieldName: keyof FormState) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  // Mark all fields as touched (typically used on form submission)
  const markAllFieldsTouched = () => {
    const allFields: TouchedFields = {};
    const formFields: (keyof FormState)[] = [
      'selectedService',
      'storageProvince',
      'storageCity',
      'originProvince',
      'originCity',
      'destinationProvince',
      'destinationCity',
      'estimatedStorageTime',
      'productType',
      'description',
      'presentation',
      'quantity',
      'quantityUnit',
      'cargoValue',
      'shippingTime'
    ];

    formFields.forEach(field => {
      allFields[field] = true;
    });

    setTouchedFields(allFields);
  };
  
  // Check if a field has been touched
  const isFieldTouched = (fieldName: keyof FormState): boolean => {
    return !!touchedFields[fieldName];
  };
  
  // Set an error for a specific field
  const setFieldError = (fieldName: string, error: string | null) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };
  
  // Get error for a specific field
  const getFieldError = (fieldName: string): string | null => {
    return fieldErrors[fieldName] || null;
  };
  
  // Reset all field tracking
  const resetFieldTracking = () => {
    setTouchedFields({});
    setFieldErrors({});
  };

  return {
    touchedFields,
    isFieldTouched,
    markFieldTouched,
    markAllFieldsTouched,
    fieldErrors,
    setFieldError,
    getFieldError,
    resetFieldTracking
  };
};
