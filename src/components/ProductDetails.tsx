import React from "react";
import { Package } from "lucide-react";
import ProductTypeSelector from "@/components/product/ProductTypeSelector";
import PresentationSelector from "@/components/product/PresentationSelector";
import QuantityInput from "@/components/product/QuantityInput";
import ValueInput from "@/components/product/ValueInput";
import DescriptionInput from "@/components/product/DescriptionInput";
import { FormState } from "@/contexts/form/types";

interface ProductDetailsProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  shippingTime: string;
  onShippingTimeChange: (time: string) => void;
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
}

const ProductDetails = ({
  productType,
  onProductTypeChange,
  value,
  onValueChange,
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
}: ProductDetailsProps) => {
  return (
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">
        <Package className="w-5 h-5 inline-block mr-2" />
        <span>Información del producto</span>
      </h2>

      <div className="space-y-6">
        <ProductTypeSelector 
          productType={productType}
          onProductTypeChange={onProductTypeChange}
          isFieldTouched={isFieldTouched}
          getFieldError={getFieldError}
          markFieldTouched={markFieldTouched}
        />

        {/* Show description field if product type is "Otro" */}
        {productType === "Otro" && (
          <DescriptionInput 
            description={description}
            onDescriptionChange={onDescriptionChange}
            isRequired={true}
            isFieldTouched={isFieldTouched}
            getFieldError={getFieldError}
            markFieldTouched={markFieldTouched}
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
        />

        <div className="grid grid-cols-1 gap-6">
          <QuantityInput 
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            quantityUnit={quantityUnit}
            onQuantityUnitChange={onQuantityUnitChange}
            isFieldTouched={isFieldTouched}
            getFieldError={getFieldError}
            markFieldTouched={markFieldTouched}
          />

          <ValueInput 
            value={value}
            onValueChange={onValueChange}
            isFieldTouched={isFieldTouched}
            getFieldError={getFieldError}
            markFieldTouched={markFieldTouched}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
