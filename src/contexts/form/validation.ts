
import { FormState } from "./types";

export const validateForm = (formState: FormState): string | null => {
  const {
    selectedService,
    storageProvince,
    storageCity,
    originProvince,
    originCity,
    destinationProvince,
    destinationCity,
    estimatedStorageTime,
    productType,
    description,
    quantity,
    quantityUnit,
    cargoValue,
    shippingTime
  } = formState;

  if (!selectedService) {
    return "Debe seleccionar un servicio";
  }

  if (selectedService === "storage") {
    if (!storageProvince || !storageCity) {
      return "Debe seleccionar provincia y ciudad de almacenamiento";
    }
    
    if (!estimatedStorageTime) {
      return "Debe ingresar un tiempo estimado de almacenamiento";
    }
  }

  if (selectedService === "transport") {
    if (!originProvince || !originCity || !destinationProvince || !destinationCity) {
      return "Debe seleccionar origen y destino";
    }
  }

  if (selectedService === "both") {
    if (!originProvince || !originCity || !destinationProvince || !destinationCity) {
      return "Debe seleccionar origen y destino";
    }
    
    if (!estimatedStorageTime) {
      return "Debe ingresar un tiempo estimado de almacenamiento";
    }
  }
  
  if (!productType) {
    return "Debe seleccionar tipo de producto";
  }

  // Add validation for description when product type is "Otro"
  if (productType === "Otro" && !description.trim()) {
    return "La descripción del producto es obligatoria";
  }

  if (!quantity || parseFloat(quantity) <= 0) {
    return "Debe ingresar una cantidad válida (mayor a cero)";
  }
  
  if (!quantityUnit) {
    return "Debe seleccionar una unidad de medida para la cantidad";
  }

  if (!cargoValue || parseFloat(cargoValue) <= 0) {
    return "Debe ingresar un valor de carga válido (mayor a cero)";
  }

  if (!shippingTime) {
    return "Debe seleccionar una fecha de inicio";
  }

  return null;
};

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
    category,
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
    "Categoría": category || null,
    "Descripción": description || null,
    "Presentación": presentation || null,
    "Aclaración": clarification || null,
    "Tiempo de Envío": shippingTime || null,
    "Cantidad": quantity ? parseFloat(quantity) : null,
    "Unidad de Cantidad": quantityUnit || null,
    "Valor": cargoValue ? parseFloat(cargoValue) : null,
  };
};
