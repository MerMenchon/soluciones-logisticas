
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";

const productOptions = [
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
];

interface ProductDetailsProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  weight: string;
  onWeightChange: (weight: string) => void;
  volume: string;
  onVolumeChange: (volume: string) => void;
  value: string;
  onValueChange: (value: string) => void;
}

const ProductDetails = ({
  productType,
  onProductTypeChange,
  weight,
  onWeightChange,
  volume,
  onVolumeChange,
  value,
  onValueChange,
}: ProductDetailsProps) => {
  // Handle numeric input validation
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      onValueChange(newValue);
    }
  };

  return (
    <div className="form-section">
      <h2 className="form-title">
        <Package className="w-5 h-5" />
        <span>Detalles del Producto</span>
      </h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-agri-secondary mb-1">
            Tipo de producto *
          </label>
          <select
            id="productType"
            value={productType}
            onChange={(e) => onProductTypeChange(e.target.value)}
            className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          >
            <option value="" disabled>
              Seleccione un tipo de producto
            </option>
            {productOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-agri-secondary mb-1">
              Peso (kg)
            </label>
            <Input
              id="weight"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ingrese el peso en kilogramos
            </p>
          </div>
          
          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-agri-secondary mb-1">
              Volumen (m³)
            </label>
            <Input
              id="volume"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ingrese el volumen en metros cúbicos
            </p>
          </div>
        </div>
        
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-agri-secondary mb-1">
            Valor de la carga (USD) *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              $
            </span>
            <Input
              id="value"
              placeholder="0.00"
              value={value}
              onChange={handleValueChange}
              className="w-full pl-7"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ingrese el valor en dólares estadounidenses (USD), debe ser mayor a 0
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
