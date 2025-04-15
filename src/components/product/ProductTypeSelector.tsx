import React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { FormState } from "@/contexts/form/types";

interface ProductTypeSelectorProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  isFieldTouched?: (fieldName: keyof FormState) => boolean;
  getFieldError?: (fieldName: string) => string | null;
  markFieldTouched?: (fieldName: keyof FormState) => void;
  resetFieldError?: (fieldName: string) => void;
}

const ProductTypeSelector = ({
  productType,
  onProductTypeChange,
  isFieldTouched,
  getFieldError,
  markFieldTouched,
  resetFieldError
}: ProductTypeSelectorProps) => {
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProductTypes = async () => {
      setIsLoadingProducts(true);
      try {
        // Google Sheets needs to be published to the web as CSV
        // Using the shared sheet with the correct sheet name
        const sheetId = "1VYDCQfaz3-7IrhPUGpAO4UBLMDR1mEyl6UCHU1hznwQ";
        const sheetName = "PRODUCTOS"; // Specific sheet name
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
        
        const response = await fetch(sheetUrl);
        
        if (!response.ok) {
          throw new Error("Error al cargar los tipos de productos");
        }
        
        const csvText = await response.text();
        
        // Parse CSV to extract product types
        const rows = csvText.split('\n');
        
        // Find the column index for "PRODUCTOS"
        const headers = rows[0].split(',');
        const productColumnIndex = headers.findIndex(
          header => header.trim().replace(/"/g, '').toUpperCase() === 'PRODUCTOS'
        );
        
        if (productColumnIndex === -1) {
          throw new Error("No se encontró la columna 'PRODUCTOS' en la hoja");
        }
        
        // Extract product types
        const products = rows
          .slice(1) // Skip header row
          .map(row => {
            const columns = row.split(',');
            return columns[productColumnIndex]?.replace(/"/g, '').trim();
          })
          .filter(product => product && product.length > 0) // Filter out empty values
          .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
        
        setProductOptions(products);
      } catch (error) {
        console.error("Error fetching product types:", error);
        // Call toast with no arguments
        toast();
        
        // Fallback to default options if fetch fails
        setProductOptions([
          "Alimentos",
          "Alimentos refrigerados",
          "Bebidas",
          "Textiles",
          "Electrónica",
          "Maquinaria",
          "Químicos",
          "Materiales de construcción",
          "Productos farmacéuticos",
          "Otros"
        ]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProductTypes();
  }, [toast]);

  // Handle product type change
  const handleProductTypeChange = (value: string) => {
    if (resetFieldError) {
      resetFieldError('productType');
    }
    onProductTypeChange(value);
    
    // Mark as touched and validate only after a selection is made
    if (markFieldTouched) {
      markFieldTouched('productType');
    }
    setHasInteracted(true);
  };
  
  const handleBlur = () => {
    // Only mark as touched and validate on blur
    if (markFieldTouched) {
      markFieldTouched('productType');
    }
    setHasInteracted(true);
  };

  // Check if the field is touched and has an error
  const touched = isFieldTouched ? isFieldTouched('productType') : false;
  const errorMessage = getFieldError ? getFieldError('productType') : null;
  
  // Only show error after interacting and when the field is touched with an error
  const hasError = touched && errorMessage && hasInteracted;

  return (
    <div>
      <label htmlFor="productType" className="block text-sm font-medium text-agri-secondary mb-1">
        Tipo de producto *
      </label>
      <Select 
        value={productType} 
        onValueChange={handleProductTypeChange}
        onOpenChange={() => {
          // Don't mark as touched when opening the select dropdown
          // The interaction is set to true only on selection or blur
        }}
        disabled={isLoadingProducts}
      >
        <SelectTrigger 
          className={`w-full ${hasError ? 'border-red-500' : ''}`}
          onBlur={handleBlur}
        >
          <SelectValue placeholder={
            isLoadingProducts 
              ? "Cargando tipos de producto..." 
              : "Seleccione un tipo de producto"
          } />
        </SelectTrigger>
        <SelectContent>
          {productOptions.map((option) => (
            <SelectItem 
              key={option} 
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default ProductTypeSelector;
