
import { FormState } from "../types";

/**
 * Prepares form data for submission
 */
export const prepareFormData = (formState: FormState) => {
  return {
    id_customer : 1234,
    submissionDate: new Date().toISOString(), // Add current date and time
    service: {
      type: formState.selectedService,
    },
    locations: {
      storage: {
        province: formState.selectedService === "storage" || formState.selectedService === "both" ? formState.storageProvince : null,
        city: formState.selectedService === "storage" || formState.selectedService === "both" ? formState.storageCity : null,
        estimatedStorageTime: formState.selectedService === "storage" || formState.selectedService === "both" 
          ? (formState.estimatedStorageTime ? parseInt(formState.estimatedStorageTime) : null) 
          : null
      },
      transport: {
        origin: {
          province: formState.selectedService === "transport" || formState.selectedService === "both" ? formState.originProvince : null,
          city: formState.selectedService === "transport" || formState.selectedService === "both" ? formState.originCity : null,
        },
        destination: {
          province: formState.selectedService === "transport" || formState.selectedService === "both" ? formState.destinationProvince : null,
          city: formState.selectedService === "transport" || formState.selectedService === "both" ? formState.destinationCity : null,
        },
      },
    },
    product: {
      type: formState.productType,
      description: formState.description || null,
      presentation: formState.presentation,
      clarification: formState.clarification || null,
      quantity: {
        value: formState.quantity ? parseFloat(formState.quantity) : null,
        unit: formState.quantityUnit || null,
      },
      value: formState.cargoValue ? parseFloat(formState.cargoValue) : null,
    },
    shipping: {
      time: formState.shippingTime || null,
    },
    additionalInfo: formState.additionalInfo || null,
  };
};
