
import { FormState } from "../types";

// Service-specific validations
export const validateService = (formState: FormState): { [key: string]: string | null } => {
  const {
    selectedService,
    storageProvince,
    storageCity,
    originProvince,
    originCity,
    destinationProvince,
    destinationCity,
    estimatedStorageTime,
  } = formState;

  const errors: { [key: string]: string | null } = {
    selectedService: !selectedService ? "Debe seleccionar un servicio" : null,
  };

  // Storage service validations
  if (selectedService === "storage") {
    errors.storageProvince = !storageProvince ? "Debe seleccionar una provincia" : null;
    errors.storageCity = !storageCity ? "Debe seleccionar una ciudad" : null;
    errors.estimatedStorageTime = !estimatedStorageTime ? "Debe ingresar un tiempo estimado de almacenamiento" : null;
  }

  // Transport service validations
  if (selectedService === "transport" || selectedService === "both") {
    errors.originProvince = !originProvince ? "Debe seleccionar una provincia de origen" : null;
    errors.originCity = !originCity ? "Debe seleccionar una ciudad de origen" : null;
    errors.destinationProvince = !destinationProvince ? "Debe seleccionar una provincia de destino" : null;
    errors.destinationCity = !destinationCity ? "Debe seleccionar una ciudad de destino" : null;
  }

  // Both services validation
  if (selectedService === "both") {
    errors.estimatedStorageTime = !estimatedStorageTime ? "Debe ingresar un tiempo estimado de almacenamiento" : null;
  }

  return errors;
};
