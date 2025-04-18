
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
  

  // Access prestashop global with type safety
  const userId = typeof window !== "undefined" && typeof (window as any).prestashop !== "undefined" 
    ? (window as any).prestashop.customer?.uid ?? 123456 
    : 123456;
    
  const userEmail = typeof window !== "undefined" && typeof (window as any).prestashop !== "undefined" 
    ? (window as any).prestashop.customer?.email ?? "Sin información de email" 
    : "Sin información de email";
    
  const userCuit = typeof window !== "undefined" && typeof (window as any).prestashop !== "undefined" 
    ? (window as any).prestashop.customer?.siret ?? 123456 
    : 123456;

  return {
    submissionDate: new Date().toISOString(), // Add current date and time
    userId,
    userEmail,
    userCuit,

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
