
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
  const { setFieldTouched } = useFormContext();

  // Handlers with field tracking
  const handleProductTypeChange = (type: string) => {
    onProductTypeChange(type);
    setFieldTouched("productType");
  };
  
  const handleDescriptionChange = (text: string) => {
    onDescriptionChange(text);
    setFieldTouched("description");
  };
  
  const handlePresentationChange = (value: string) => {
    onPresentationChange(value);
    setFieldTouched("presentation");
  };
  
  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    setFieldTouched("cargoValue");
  };

  const handleQuantityChange = (newQuantity: string) => {
    onQuantityChange(newQuantity);
    setFieldTouched("quantity");
  };

  const handleQuantityUnitChange = (newUnit: string) => {
    onQuantityUnitChange(newUnit);
    setFieldTouched("quantityUnit");
  };

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
        />

        <PresentationSelector
          presentation={presentation}
          onPresentationChange={handlePresentationChange}
          clarification={clarification}
          onClarificationChange={onClarificationChange}
          error={errors.presentation}
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
        />
        
        <ValueInput
          value={value}
          onValueChange={handleValueChange}
          error={errors.value}
        />

        <DescriptionInput
          description={description}
          onDescriptionChange={handleDescriptionChange}
          isRequired={isDescriptionRequired}
          error={errors.description}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
