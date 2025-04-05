
import React from "react";
import ProductDetails from "@/components/ProductDetails";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const ProductDetailsSection = () => {
  const {
    productType,
    setProductType,
    cargoValue,
    setCargoValue,
    shippingTime,
    setShippingTime,
    description,
    setDescription,
    presentation,
    setPresentation,
    clarification,
    setClarification,
    quantity,
    setQuantity,
    quantityUnit,
    setQuantityUnit,
    getFieldError,
  } = useLogisticsForm();

  return (
    <ProductDetails 
      productType={productType}
      onProductTypeChange={setProductType}
      value={cargoValue}
      onValueChange={setCargoValue}
      shippingTime={shippingTime}
      onShippingTimeChange={setShippingTime}
      description={description}
      onDescriptionChange={setDescription}
      presentation={presentation}
      onPresentationChange={setPresentation}
      clarification={clarification}
      onClarificationChange={setClarification}
      quantity={quantity}
      onQuantityChange={setQuantity}
      quantityUnit={quantityUnit}
      onQuantityUnitChange={setQuantityUnit}
      errors={{
        productType: getFieldError("productType"),
        description: getFieldError("description"),
        presentation: getFieldError("presentation"),
        quantity: getFieldError("quantity"),
        quantityUnit: getFieldError("quantityUnit"),
        value: getFieldError("cargoValue")
      }}
    />
  );
};

export default ProductDetailsSection;
