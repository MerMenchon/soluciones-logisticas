
import { FormState } from "../types";

// Product-specific validations
export const validateProduct = (formState: FormState): { [key: string]: string | null } => {
  const {
    productType,
    description,
    presentation,
    quantity,
    quantityUnit,
    cargoValue,
    shippingTime,
  } = formState;

  const errors: { [key: string]: string | null } = {
    productType: !productType ? "Debe seleccionar tipo de producto" : null,
    description: productType === "Otro" && !description.trim() ? "La descripción del producto es obligatoria" : null,
    presentation: !presentation.trim() ? "La presentación del producto es obligatoria" : null,
    quantity: !quantity || parseFloat(quantity) <= 0 ? "Debe ingresar una cantidad válida (mayor a cero)" : null,
    quantityUnit: !quantityUnit ? "Debe seleccionar una unidad de medida" : null,
    cargoValue: !cargoValue || parseFloat(cargoValue) <= 0 ? "Debe ingresar un valor válido (mayor a cero)" : null,
    shippingTime: !shippingTime ? "Debe seleccionar una fecha de inicio" : null,
  };

  return errors;
};
