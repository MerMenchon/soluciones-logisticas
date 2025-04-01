
import { FormState } from "@/types/form";

export const useFormValidation = (formState: FormState) => {
  const validateForm = (): string | null => {
    const {
      selectedService,
      storageProvince,
      storageCity,
      originProvince,
      originCity,
      destinationProvince,
      destinationCity,
      productType,
      weight,
      volume,
      cargoValue,
      email
    } = formState;

    if (!selectedService) {
      return "Debe seleccionar un servicio";
    }

    if (selectedService === "storage" || selectedService === "both") {
      if (!storageProvince || !storageCity) {
        return "Debe seleccionar ubicación de almacenamiento";
      }
    }

    if (selectedService === "transport" || selectedService === "both") {
      if (!originProvince || !originCity) {
        return "Debe seleccionar origen";
      }
      if (!destinationProvince || !destinationCity) {
        return "Debe seleccionar destino";
      }
    }

    if (!productType) {
      return "Debe seleccionar tipo de producto";
    }

    if (!weight && !volume) {
      return "Debe ingresar peso o volumen";
    }

    if (!cargoValue || parseFloat(cargoValue) <= 0) {
      return "Debe ingresar un valor de carga válido (mayor a cero USD)";
    }
    
    // Email validation using regex
    if (!email) {
      return "Debe ingresar un email de contacto";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Debe ingresar un email válido";
    }

    return null;
  };

  return { validateForm };
};
