import React from "react";
import { Package } from "lucide-react";
import ProductTypeSelector from "@/components/product/ProductTypeSelector";
import DescriptionInput from "@/components/product/DescriptionInput";
import PresentationSelector from "@/components/product/PresentationSelector";
import QuantityInput from "@/components/product/QuantityInput";
import ValueInput from "@/components/product/ValueInput";
import { FormState } from "@/contexts/form/types";

interface ProductDetailsProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  shippingTime: string;
  onShippingTimeChange: (value: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  presentation: string;
  onPresentationChange: (presentation: string) => void;
  clarification: string;
  onClarificationChange: (clarification: string) => void;
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  quantityUnit: string;
  onQuantityUnitChange: (unit: string) => void;
  isFieldTouched?: (fieldName: keyof FormState) => boolean;
  getFieldError?: (fieldName: string) => string | null;
  markFieldTouched?: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
}

const ProductDetails = ({
  productType,
  onProductTypeChange,
  value,
  onValueChange,
  shippingTime,
  onShippingTimeChange,
  description,
  onDescriptionChange,
  presentation,
  onPresentationChange,
  clarification,
  onClarificationChange,
  quantity,
  onQuantityChange,
  quantityUnit,
  onQuantityUnitChange,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
  resetFieldError // Add new prop
}: ProductDetailsProps) => {
  // Determine if the description input should be shown based on the product type
  const showDescription = productType === "Otro";

  return (
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">
        <Package className="w-5 h-5 inline-block mr-2" />
        <span>Detalles del producto</span>
      </h2>
      <div className="space-y-4">
        <ProductTypeSelector
          productType={productType}
          onProductTypeChange={onProductTypeChange}
          isFieldTouched={isFieldTouched}
          getFieldError={getFieldError}
          markFieldTouched={markFieldTouched}
          resetFieldError={resetFieldError}
        />

        {showDescription && (
          <DescriptionInput
            description={description}
            onDescriptionChange={onDescriptionChange}
            isRequired={productType === "Otro"}
            isFieldTouched={isFieldTouched}
            getFieldError={getFieldError}
            markFieldTouched={markFieldTouched}
            resetFieldError={resetFieldError}
          />
        )}

        <PresentationSelector 
          presentation={presentation}
          onPresentationChange={onPresentationChange}
          clarification={clarification}
          onClarificationChange={onClarificationChange}
          isFieldTouched={isFieldTouched}
          getFieldError={getFieldError}
          markFieldTouched={markFieldTouched}
          resetFieldError={resetFieldError}
        />

        <QuantityInput
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          quantityUnit={quantityUnit}
          onQuantityUnitChange={onQuantityUnitChange}
          isFieldTouched={isFieldTouched}
          getFieldError={getFieldError}
          markFieldTouched={markFieldTouched}
          resetFieldError={resetFieldError}
        />

        <ValueInput
          value={value}
          onValueChange={onValueChange}
          isFieldTouched={isFieldTouched}
          getFieldError={getFieldError}
          markFieldTouched={markFieldTouched}
          resetFieldError={resetFieldError}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
