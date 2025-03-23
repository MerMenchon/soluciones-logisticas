
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductDetailsProps {
  productType: string;
  onProductTypeChange: (value: string) => void;
  weight: string;
  onWeightChange: (value: string) => void;
  volume: string;
  onVolumeChange: (value: string) => void;
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
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^$|^[0-9]+\.?[0-9]*$/.test(value)) {
      onWeightChange(value);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^$|^[0-9]+\.?[0-9]*$/.test(value)) {
      onVolumeChange(value);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^$|^[0-9]+\.?[0-9]*$/.test(value)) {
      onValueChange(value);
    }
  };

  const productTypes = [
    "Fertilizante",
    "Fitosanitario",
    "Silo bolsa",
    "Semillas",
    "Maquinaria agrícola",
    "Herramientas",
    "Otro",
  ];

  return (
    <div className="form-section">
      <h2 className="form-title">Detalles del producto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="product-type">Tipo de producto</Label>
          <Select value={productType} onValueChange={onProductTypeChange}>
            <SelectTrigger id="product-type">
              <SelectValue placeholder="Seleccione tipo de producto" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargo-value">Valor de la carga ($)</Label>
          <Input
            id="cargo-value"
            placeholder="Ingrese valor"
            value={value}
            onChange={handleValueChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            placeholder="Ingrese peso"
            value={weight}
            onChange={handleWeightChange}
          />
          <p className="text-xs text-muted-foreground">
            *Al menos uno de los campos Peso o Volumen es obligatorio
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume">Volumen (m³ o litros)</Label>
          <Input
            id="volume"
            placeholder="Ingrese volumen"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
