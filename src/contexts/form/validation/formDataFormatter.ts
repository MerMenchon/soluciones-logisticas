
import { FormState } from "../types";

export const getFormData = (formState: FormState) => {
  const {
    selectedService,
    storageProvince,
    storageCity,
    estimatedStorageTime,
    originProvince,
    originCity,
    destinationProvince,
    destinationCity,
    additionalInfo,
    productType,
    description,
    presentation,
    clarification,
    shippingTime,
    quantity,
    quantityUnit,
    cargoValue
  } = formState;

  return {
    "Servicio": selectedService,
    "Provincia de Almacenamiento": storageProvince || null,
    "Ciudad de Almacenamiento": storageCity || null,
    "Tiempo Estimado de Almacenamiento (días)": estimatedStorageTime ? parseInt(estimatedStorageTime) : null,
    "Provincia de Origen": originProvince || null,
    "Ciudad de Origen": originCity || null,
    "Provincia de Destino": destinationProvince || null,
    "Ciudad de Destino": destinationCity || null,
    "Información Adicional": additionalInfo || null,
    
    // Product details
    "Tipo de Producto": productType,
    "Descripción": description || null,
    "Presentación": presentation || null,
    "Aclaración": clarification || null,
    "Tiempo de Envío": shippingTime || null,
    "Cantidad": quantity ? parseFloat(quantity) : null,
    "Unidad de Cantidad": quantityUnit || null,
    "Valor": cargoValue ? parseFloat(cargoValue) : null,
  };
};
