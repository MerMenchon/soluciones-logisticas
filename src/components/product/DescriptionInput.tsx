
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormState } from "@/contexts/form/types";

interface DescriptionInputProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  isRequired: boolean;
  isFieldTouched?: (fieldName: keyof FormState) => boolean;
  getFieldError?: (fieldName: string) => string | null;
  markFieldTouched?: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
}

const DescriptionInput = ({ 
  description, 
  onDescriptionChange,
  isRequired,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
  resetFieldError
}: DescriptionInputProps) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Handle description input with 100 character limit
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value;
    if (newDescription.length <= 100) {
      onDescriptionChange(newDescription);
      // Reset any validation errors while typing
      if (resetFieldError) {
        resetFieldError('description');
      }
    }
  };
  
  const handleBlur = () => {
    setHasInteracted(true);
    if (markFieldTouched) {
      markFieldTouched('description');
    }
  };

  // Check if the field is touched and has an error
  const touched = isFieldTouched ? isFieldTouched('description') : false;
  const errorMessage = getFieldError ? getFieldError('description') : null;
  
  // Only show error after interacting (blur) and when the field is touched with an error
  const hasError = touched && errorMessage && hasInteracted;

  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-agri-secondary mb-1">
        Descripción del producto {isRequired && <span className="text-red-500">*</span>}
      </label>
      <Input
        id="description"
        type="text"
        placeholder={isRequired 
          ? "Describa detalladamente su producto (obligatorio)" 
          : "Describa brevemente su producto"}
        value={description}
        onChange={handleDescriptionChange}
        onBlur={handleBlur}
        maxLength={100}
        className={`w-full ${hasError ? 'border-red-500' : ''}`}
        required={isRequired}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default DescriptionInput;
