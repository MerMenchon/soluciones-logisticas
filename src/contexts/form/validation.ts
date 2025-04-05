import { FormState } from "./types";

export type ValidationResult = {
  isValid: boolean;
  errors: {
    [key: string]: string | null;
  };
};

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
    presentation,
    quantity,
    quantityUnit,
    cargoValue,
    shippingTime,
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

  if (!presentation.trim()) {
    return "La presentación del producto es obligatoria";
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

// New function to validate a single field
export const validateField = (formState: FormState, fieldName: string): string | null => {
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
    presentation,
    quantity,
    quantityUnit,
    cargoValue,
    shippingTime,
  } = formState;

  // Return validation for the specific field
  switch (fieldName) {
    case "selectedService":
      return !selectedService ? "Debe seleccionar un servicio" : null;
    
    case "storageProvince":
      return selectedService === "storage" && !storageProvince ? "Debe seleccionar una provincia" : null;
    
    case "storageCity":
      return selectedService === "storage" && !storageCity ? "Debe seleccionar una ciudad" : null;
    
    case "originProvince":
      return (selectedService === "transport" || selectedService === "both") && !originProvince ? "Debe seleccionar una provincia de origen" : null;
    
    case "originCity":
      return (selectedService === "transport" || selectedService === "both") && !originCity ? "Debe seleccionar una ciudad de origen" : null;
    
    case "destinationProvince":
      return (selectedService === "transport" || selectedService === "both") && !destinationProvince ? "Debe seleccionar una provincia de destino" : null;
    
    case "destinationCity":
      return (selectedService === "transport" || selectedService === "both") && !destinationCity ? "Debe seleccionar una ciudad de destino" : null;
    
    case "estimatedStorageTime":
      return (selectedService === "storage" || selectedService === "both") && !estimatedStorageTime ? "Debe ingresar un tiempo estimado de almacenamiento" : null;
    
    case "productType":
      return !productType ? "Debe seleccionar tipo de producto" : null;
    
    case "description":
      return productType === "Otro" && !description.trim() ? "La descripción del producto es obligatoria" : null;
    
    case "presentation":
      return !presentation.trim() ? "La presentación del producto es obligatoria" : null;
    
    case "quantity":
      return !quantity || parseFloat(quantity) <= 0 ? "Debe ingresar una cantidad válida (mayor a cero)" : null;
    
    case "quantityUnit":
      return !quantityUnit ? "Debe seleccionar una unidad de medida" : null;
    
    case "cargoValue":
      return !cargoValue || parseFloat(cargoValue) <= 0 ? "Debe ingresar un valor válido (mayor a cero)" : null;
    
    case "shippingTime":
      return !shippingTime ? "Debe seleccionar una fecha de inicio" : null;
    
    default:
      return null;
  }
};

// New function to validate individual fields and return field-specific errors
export const validateFormFields = (formState: FormState): ValidationResult => {
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
    presentation,
    quantity,
    quantityUnit,
    cargoValue,
    shippingTime,
  } = formState;

  const errors: { [key: string]: string | null } = {
    selectedService: !selectedService ? "Debe seleccionar un servicio" : null,
    storageProvince: selectedService === "storage" && !storageProvince ? "Debe seleccionar una provincia" : null,
    storageCity: selectedService === "storage" && !storageCity ? "Debe seleccionar una ciudad" : null,
    originProvince: (selectedService === "transport" || selectedService === "both") && !originProvince ? "Debe seleccionar una provincia de origen" : null,
    originCity: (selectedService === "transport" || selectedService === "both") && !originCity ? "Debe seleccionar una ciudad de origen" : null,
    destinationProvince: (selectedService === "transport" || selectedService === "both") && !destinationProvince ? "Debe seleccionar una provincia de destino" : null,
    destinationCity: (selectedService === "transport" || selectedService === "both") && !destinationCity ? "Debe seleccionar una ciudad de destino" : null,
    estimatedStorageTime: (selectedService === "storage" || selectedService === "both") && !estimatedStorageTime ? "Debe ingresar un tiempo estimado de almacenamiento" : null,
    productType: !productType ? "Debe seleccionar tipo de producto" : null,
    description: productType === "Otro" && !description.trim() ? "La descripción del producto es obligatoria" : null,
    presentation: !presentation.trim() ? "La presentación del producto es obligatoria" : null,
    quantity: !quantity || parseFloat(quantity) <= 0 ? "Debe ingresar una cantidad válida (mayor a cero)" : null,
    quantityUnit: !quantityUnit ? "Debe seleccionar una unidad de medida" : null,
    cargoValue: !cargoValue || parseFloat(cargoValue) <= 0 ? "Debe ingresar un valor válido (mayor a cero)" : null,
    shippingTime: !shippingTime ? "Debe seleccionar una fecha de inicio" : null,
  };

  // Check if there are any errors
  const hasErrors = Object.values(errors).some(error => error !== null);

  return {
    isValid: !hasErrors,
    errors,
  };
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
