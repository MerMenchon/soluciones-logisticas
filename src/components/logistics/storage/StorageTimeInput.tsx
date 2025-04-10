
import React from "react";
import { Label } from "@/components/ui/label";
import { FormState } from "@/contexts/form/types";

interface StorageTimeInputProps {
  estimatedStorageTime: string;
  onEstimatedTimeChange: (value: string) => void;
  isFieldTouched: (fieldName: keyof FormState) => boolean;
  getFieldError: (fieldName: string) => string | null;
}

const StorageTimeInput = ({
  estimatedStorageTime,
  onEstimatedTimeChange,
  isFieldTouched,
  getFieldError
}: StorageTimeInputProps) => {
  // Handle natural numbers only in estimated time input
  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow empty string or natural numbers (positive integers)
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      onEstimatedTimeChange(value);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-md bg-muted/10">
      <Label htmlFor="estimated-storage-time" className="block mb-2">
        Tiempo estimado de almacenamiento (en días)
      </Label>
      <div className="flex items-center gap-2">
        <input
          id="estimated-storage-time"
          type="number"
          min="1"
          value={estimatedStorageTime}
          onChange={handleEstimatedTimeChange}
          className="w-32 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="30"
        />
        <span className="text-sm text-muted-foreground">días</span>
      </div>
      {isFieldTouched('estimatedStorageTime') && getFieldError('estimatedStorageTime') && (
        <p className="text-sm text-destructive mt-1">
          {getFieldError('estimatedStorageTime')}
        </p>
      )}
    </div>
  );
};

export default StorageTimeInput;
