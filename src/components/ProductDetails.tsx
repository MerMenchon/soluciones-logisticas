
import React from "react";
import { Package } from "lucide-react";
import ProductTypeSelector from "./product/ProductTypeSelector";
import PresentationSelector from "./product/PresentationSelector";
import QuantityInput from "./product/QuantityInput";
import ValueInput from "./product/ValueInput";
import DescriptionInput from "./product/DescriptionInput";
import { useFormContext } from "@/contexts/form";

interface ProductDetailsProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  presentation: string;
  onPresentationChange: (presentation: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  shippingTime: string;
  onShippingTimeChange: (time: string) => void;
  clarification?: string;
  onClarificationChange?: (clarification: string) => void;
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  quantityUnit: string;
  onQuantityUnitChange: (unit: string) => void;
  errors?: {
    productType: string | null;
    description: string | null;
    presentation: string | null;
    quantity: string | null;
    quantityUnit: string | null;
    value: string | null;
  };
}

const ProductDetails = ({
  productType,
  onProductTypeChange,
  description,
  onDescriptionChange,
  presentation,
  onPresentationChange,
  value,
  onValueChange,
  shippingTime,
  onShippingTimeChange,
  clarification = "",
  onClarificationChange = () => {},
  quantity,
  onQuantityChange,
  quantityUnit,
  onQuantityUnitChange,
  errors = {
    productType: null,
    description: null,
    presentation: null,
    quantity: null,
    quantityUnit: null,
    value: null
  }
}: ProductDetailsProps) => {
  // Check if the product type is "Otro" to determine if description is required
  const isDescriptionRequired = productType === "Otro";
  const { setFieldTouched, validateField, validateOnBlur } = useFormContext();

  // Handlers with field tracking and immediate validation
  const handleProductTypeChange = (type: string) => {
    onProductTypeChange(type);
    setFieldTouched("productType");
    if (validateField) validateField("productType");
  };
  
  const handleDescriptionChange = (text: string) => {
    onDescriptionChange(text);
    setFieldTouched("description");
    if (validateField) validateField("description");
  };
  
  const handlePresentationChange = (value: string) => {
    onPresentationChange(value);
    setFieldTouched("presentation");
    if (validateField) validateField("presentation");
  };
  
  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    setFieldTouched("cargoValue");
    if (validateField) validateField("cargoValue");
  };

  const handleQuantityChange = (newQuantity: string) => {
    onQuantityChange(newQuantity);
    setFieldTouched("quantity");
    if (validateField) validateField("quantity");
  };

  const handleQuantityUnitChange = (newUnit: string) => {
    onQuantityUnitChange(newUnit);
    setFieldTouched("quantityUnit");
    if (validateField) validateField("quantityUnit");
  };
  
  // Blur handlers for validation
  const handleProductTypeBlur = () => validateOnBlur("productType");
  const handleDescriptionBlur = () => validateOnBlur("description");
  const handlePresentationBlur = () => validateOnBlur("presentation");
  const handleValueBlur = () => validateOnBlur("cargoValue");
  const handleQuantityBlur = () => validateOnBlur("quantity");
  const handleQuantityUnitBlur = () => validateOnBlur("quantityUnit");

  return (
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">
        <Package className="w-5 h-5 inline-block mr-2" />
        <span>Detalles del Producto</span>
      </h2>
      <div className="space-y-6">
        <ProductTypeSelector 
          productType={productType} 
          onProductTypeChange={handleProductTypeChange}
          error={errors.productType}
          onBlur={handleProductTypeBlur}
        />

        <PresentationSelector
          presentation={presentation}
          onPresentationChange={handlePresentationChange}
          clarification={clarification}
          onClarificationChange={onClarificationChange}
          error={errors.presentation}
          onBlur={handlePresentationBlur}
        />

        <QuantityInput
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          quantityUnit={quantityUnit}
          onQuantityUnitChange={handleQuantityUnitChange}
          errors={{
            quantity: errors.quantity,
            quantityUnit: errors.quantityUnit
          }}
          onQuantityBlur={handleQuantityBlur}
          onQuantityUnitBlur={handleQuantityUnitBlur}
        />
        
        <ValueInput
          value={value}
          onValueChange={handleValueChange}
          error={errors.value}
          onBlur={handleValueBlur}
        />

        <DescriptionInput
          description={description}
          onDescriptionChange={handleDescriptionChange}
          isRequired={isDescriptionRequired}
          error={errors.description}
          onBlur={handleDescriptionBlur}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
