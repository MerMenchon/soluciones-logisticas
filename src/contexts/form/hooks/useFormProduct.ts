
import { useState } from "react";

interface ProductState {
  productType: string;
  description: string;
  presentation: string;
  clarification: string;
  cargoValue: string;
  shippingTime: string;
  quantity: string;
  quantityUnit: string;
  additionalInfo: string;
}

export const useFormProduct = (initialState: Partial<ProductState> = {}) => {
  const [productState, setProductState] = useState<ProductState>({
    productType: "",
    description: "",
    presentation: "",
    clarification: "",
    cargoValue: "",
    shippingTime: "",
    quantity: "",
    quantityUnit: "",
    additionalInfo: "",
    ...initialState,
  });

  const updateProductState = (updates: Partial<ProductState>) => {
    setProductState(prev => ({ ...prev, ...updates }));
  };

  // Product handlers
  const setProductType = (type: string) => 
    updateProductState({ productType: type });
  
  const setDescription = (description: string) => 
    updateProductState({ description });
  
  const setPresentation = (presentation: string) => 
    updateProductState({ presentation });
  
  const setClarification = (clarification: string) => 
    updateProductState({ clarification });
  
  const setCargoValue = (value: string) => 
    updateProductState({ cargoValue: value });
  
  const setShippingTime = (time: string) => 
    updateProductState({ shippingTime: time });
  
  const setQuantity = (quantity: string) => 
    updateProductState({ quantity });
  
  const setQuantityUnit = (unit: string) => 
    updateProductState({ quantityUnit: unit });

  // Contact handler
  const setAdditionalInfo = (info: string) => 
    updateProductState({ additionalInfo: info });

  const resetProductDetails = () => {
    setProductState({
      productType: "",
      description: "",
      presentation: "",
      clarification: "",
      cargoValue: "",
      shippingTime: "",
      quantity: "",
      quantityUnit: "",
      additionalInfo: "",
    });
  };

  return {
    ...productState,
    setProductType,
    setDescription,
    setPresentation,
    setClarification,
    setCargoValue,
    setShippingTime,
    setQuantity,
    setQuantityUnit,
    setAdditionalInfo,
    resetProductDetails,
  };
};
