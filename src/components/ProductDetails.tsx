import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchShippingTimes } from "@/data/locations";
import { Textarea } from "@/components/ui/textarea";

interface ProductDetailsProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  weight: string;
  onWeightChange: (weight: string) => void;
  volume: string;
  onVolumeChange: (volume: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  shippingTime: string;
  onShippingTimeChange: (time: string) => void;
  description?: string;
  onDescriptionChange?: (description: string) => void;
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
  shippingTime,
  onShippingTimeChange,
  description = "",
  onDescriptionChange = () => {},
}: ProductDetailsProps) => {
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [shippingTimeOptions, setShippingTimeOptions] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingShippingTimes, setIsLoadingShippingTimes] = useState(true);
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
        toast({
          title: "Error",
          description: "No se pudieron cargar los tipos de productos. Usando opciones predeterminadas.",
          variant: "destructive",
        });
        
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
    
    const fetchAvailableShippingTimes = async () => {
      setIsLoadingShippingTimes(true);
      try {
        const times = await fetchShippingTimes();
        setShippingTimeOptions(times);
      } catch (error) {
        console.error("Error fetching shipping times:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tiempos de envío. Usando opciones predeterminadas.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingShippingTimes(false);
      }
    };

    fetchProductTypes();
    fetchAvailableShippingTimes();
  }, [toast]);

  // Handle numeric input validation
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      // Check if value is greater than 0
      if (newValue === '' || parseFloat(newValue) > 0) {
        onValueChange(newValue);
      }
    }
  };

  // Check if the selected product type is "Otros" to show description field
  const isOtherProductType = productType === "Otros";

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
            disabled={isLoadingProducts}
          >
            <option value="" disabled>
              {isLoadingProducts ? "Cargando tipos de producto..." : "Seleccione un tipo de producto"}
            </option>
            {productOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        {isOtherProductType && (
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-agri-secondary mb-1">
              Descripción
            </label>
            <Textarea
              id="productDescription"
              placeholder="Describa el tipo de producto (máximo 100 caracteres)"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="resize-none"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/100 caracteres
            </p>
          </div>
        )}
        
        <div>
          <label htmlFor="shippingTime" className="block text-sm font-medium text-agri-secondary mb-1">
            Tiempo de envío estimado
          </label>
          <select
            id="shippingTime"
            value={shippingTime}
            onChange={(e) => onShippingTimeChange(e.target.value)}
            className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isLoadingShippingTimes}
          >
            <option value="" disabled>
              {isLoadingShippingTimes ? "Cargando tiempos de envío..." : "Seleccione un tiempo estimado"}
            </option>
            {shippingTimeOptions.map((option) => (
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
