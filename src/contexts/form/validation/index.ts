
import { FormState } from "../types";
import { validateService } from "./serviceValidation";
import { validateProduct } from "./productValidation";
import { ValidationResult } from "./types";

export type { ValidationResult } from "./types";
export { getFormData } from "./formDataFormatter";

// Main validation function that checks the entire form
export const validateForm = (formState: FormState): string | null => {
  const serviceErrors = validateService(formState);
  const productErrors = validateProduct(formState);

  // Combine all error objects
  const allErrors = { ...serviceErrors, ...productErrors };

  // Find the first error message
  for (const key in allErrors) {
    if (allErrors[key]) {
      return allErrors[key];
    }
  }

  return null;
};

// Function to validate a single field
export const validateField = (formState: FormState, fieldName: string): string | null => {
  const serviceErrors = validateService(formState);
  const productErrors = validateProduct(formState);

  // Combine all error objects
  const allErrors = { ...serviceErrors, ...productErrors };

  return allErrors[fieldName] || null;
};

// Function to validate all form fields
export const validateFormFields = (formState: FormState): ValidationResult => {
  const serviceErrors = validateService(formState);
  const productErrors = validateProduct(formState);

  // Combine all error objects
  const errors = { ...serviceErrors, ...productErrors };

  // Check if there are any errors
  const hasErrors = Object.values(errors).some(error => error !== null);

  return {
    isValid: !hasErrors,
    errors,
  };
};
