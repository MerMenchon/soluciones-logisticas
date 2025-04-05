
import React from "react";
import { Input } from "@/components/ui/input";

interface DescriptionInputProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  isRequired: boolean;
  error: string | null;
}

const DescriptionInput = ({ 
  description, 
  onDescriptionChange,
  isRequired,
  error,
}: DescriptionInputProps) => {
  // Handle description input with 100 character limit
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value;
    if (newDescription.length <= 100) {
      onDescriptionChange(newDescription);
    }
  };

  const hasError = isRequired && !description || error !== null;

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
        maxLength={100}
        className={`w-full ${hasError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        required={isRequired}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {error || "La descripción del producto es obligatoria"}
        </p>
      )}
    </div>
  );
};

export default DescriptionInput;
