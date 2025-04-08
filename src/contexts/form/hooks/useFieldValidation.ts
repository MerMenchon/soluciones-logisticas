
import { FormState } from "../types";

export const useFieldValidation = () => {
  // Validate a specific field
  const validateField = (fieldName: keyof FormState, formState: FormState): string | null => {
    switch(fieldName) {
      case 'selectedService':
        
        return formState.selectedService ? null : "Debe seleccionar un servicio";
      case 'storageProvince':
        if (formState.selectedService === "storage" || formState.selectedService === "both") {
          return formState.storageProvince ? null : "Debe seleccionar provincia de almacenamiento";
        }
        return null;
      case 'storageCity':
        if (formState.selectedService === "storage" || formState.selectedService === "both") {
          return formState.storageCity ? null : "Debe seleccionar ciudad de almacenamiento";
        }
        return null;
      case 'estimatedStorageTime':
        if (formState.selectedService === "storage" || formState.selectedService === "both") {
          return formState.estimatedStorageTime ? null : "Debe ingresar un tiempo estimado de almacenamiento";
        }
        return null;
      case 'originProvince':
        if (formState.selectedService === "transport" || formState.selectedService === "both") {
          return formState.originProvince ? null : "Debe seleccionar provincia de origen";
        }
        return null;
      case 'originCity':
        if (formState.selectedService === "transport" || formState.selectedService === "both") {
          return formState.originCity ? null : "Debe seleccionar ciudad de origen";
        }
        return null;
      case 'destinationProvince':
        if (formState.selectedService === "transport" || formState.selectedService === "both") {
          return formState.destinationProvince ? null : "Debe seleccionar provincia de destino";
        }
        return null;
      case 'destinationCity':
        if (formState.selectedService === "transport" || formState.selectedService === "both") {
          return formState.destinationCity ? null : "Debe seleccionar ciudad de destino";
        }
        return null;
      case 'productType':
        return formState.productType ? null : "Debe seleccionar tipo de producto";
      case 'description':
        if (formState.productType === "Otro") {
          return formState.description.trim() ? null : "La descripción del producto es obligatoria";
        }
        return null;
      case 'presentation':
        return formState.presentation.trim() ? null : "La presentación del producto es obligatoria";
      case 'quantity':
        return formState.quantity && parseFloat(formState.quantity) > 0 
          ? null 
          : "Debe ingresar una cantidad válida (mayor a cero)";
      case 'cargoValue':
        return formState.cargoValue && parseFloat(formState.cargoValue) > 0 
          ? null 
          : "Debe ingresar un valor de carga válido (mayor a cero)";
      case 'shippingTime':
        return formState.shippingTime ? null : "Debe seleccionar una fecha de inicio";
      default:
        return null;
    }
  };

  return {
    validateField
  };
};
