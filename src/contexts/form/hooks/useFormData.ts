
import { FormState } from "../types";
import { translateServiceType } from "../validation";

/**
 * Prepares form data for submission
 */
export const prepareFormData = (formState: FormState) => {
  // Determine the effective storage location based on user selection
  let effectiveStorageProvince = null;
  let effectiveStorageCity = null;
  
  if (formState.selectedService === "storage") {
    // For "storage" service, use the direct storage location
    effectiveStorageProvince = formState.storageProvince;
    effectiveStorageCity = formState.storageCity;
  } else if (formState.selectedService === "both") {
    // For "both" service, use the location selected by radio buttons
    if (formState.useOriginAsStorage) {
      effectiveStorageProvince = formState.originProvince;
      effectiveStorageCity = formState.originCity;
    } else if (formState.useDestinationAsStorage) {
      effectiveStorageProvince = formState.destinationProvince;
      effectiveStorageCity = formState.destinationCity;
    }
  }
  
  console.log("Form submission - storage location:", {
    useOriginAsStorage: formState.useOriginAsStorage,
    useDestinationAsStorage: formState.useDestinationAsStorage,
    effectiveStorageProvince,
    effectiveStorageCity
  });

  return {
    submissionDate: new Date().toISOString(), // Add current date and time
    userId: prestashop?.customer?.uid ?? 123456,
    userEmail:prestashop?.customer?.email ?? "Sin información de email",
    userCuit: prestashop?.customer?.siret ?? 123456,
    service: {
      type: translateServiceType(formState.selectedService),
    },
    locations: {
      storage: {
        province: (formState.selectedService === "storage" || formState.selectedService === "both") 
          ? effectiveStorageProvince 
          : null,
        city: (formState.selectedService === "storage" || formState.selectedService === "both") 
          ? effectiveStorageCity 
          : null,
        estimatedStorageTime: (formState.selectedService === "storage" || formState.selectedService === "both") 
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
